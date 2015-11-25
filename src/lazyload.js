/**
 * jQuery.lazyLoad | https://github.com/Ennexa/jQuery.lazyLoad
 * Lazy load javascript and css files
 *
 * Copyright 2015 Ennexa Technologies (P) Ltd | http://www.ennexa.com/
 * @author Joyce Babu
 * @version 2.0
 */

(function ($) {
	"use strict";
	var promises = {}, queue = [];
	
	function createElement(tag, attr) {
		var el = document.createElement(tag);
		for (var i in attr) {
			el.setAttribute(i, attr[i]);
		}
		return el;
	}
	
	function _loadFile(url, type){
		var deferred = new $.Deferred();
		if ($((((type === 'css') ? 'link[href' : 'script[src')+'="'+url+'"]')).length) {
			deferred.resolve();
		} else {
			var s = null;
			var cb = (function() {
				return function () {
					var rs = this.readyState;
					if (rs && rs != 'complete' && rs != 'loaded') return;
					s.onload = s.onreadystatechange = null;
					deferred.resolve();
				};
				
			})();
			if (type === 'css') {
				s = createElement('link', {type: 'text/css', rel: 'stylesheet', href: url});
				setTimeout(cb, 500);
			} else {
				s = createElement('script', {async: true, src: url});
				s.onload = s.onreadystatechange = cb;
			}
			if ($.isReady) {
				document.getElementsByTagName('head')[0].appendChild(s);
			} else {
				queue.push(s);
			}
		}
		return deferred.promise();
	};
	
	function _getPromise(file) {
		var type = 'js', pos = file.indexOf('!');
		if (pos != -1) {
			type = file.substring(0, pos);
			file = file.substring(pos + 1);
		} else if (file.indexOf('.css') != -1) {
			type = 'css';
		}
		if (!promises[file]) promises[file] = _loadFile(file, type);
		return promises[file];
	}
	
	$(document).on('ready', function () {
		for (var i = 0, len = queue.length; i < len; i++) {
			document.getElementsByTagName('head')[0].appendChild(queue[i]);
		}
	});
	
	$.lazyLoad = function (file, callback) {
		if (file.constructor == Array) {
			var deferred = new $.Deferred();
			if (callback) deferred.done(callback);

			var counter = file.length;
			var list = [];
			for (var i = 0; i < counter; i++) {
				var f = file[i], promise;
				// If current file item is an array, postpone remaining file loading until current array is resolved
				if (f.constructor == Array) {
					var d2 = new $.Deferred;
					$.lazyLoad(f).done(function () {
						var remaining = file.slice(i + 1);
						$.lazyLoad(file.slice(i + 1)).done(function () {
							d2.resolve();
						});
					})
					list.push(d2.promise());
					break;
				} else {
					list.push(_getPromise(f));
				}
			}
			$.when.apply($, list).then(function () {
				deferred.resolve();
			});
			return deferred.promise();
		} else {
			var promise = _getPromise(file);
			if (callback) {
				promise.done(callback);
			}
			return promise;
		}
	};
})(jQuery);