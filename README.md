# jQuery.lazyLoad

Simple jQuery plugin for lazy loading JS/CSS resources. The file loading will start only after DOMReady event has fired. This is not a full fledged dependency management solution.


## Usage

```js 
$.lazyLoad('/js/test/abc.js', function () {
	alert('File is loaded');
});
```

The $.lazyLoad function returns a promise object. The above code can be rewritten using [promise](https://api.jquery.com/promise/) as 
```js 
$.lazyLoad('/js/test/abc.js').done(function () {
	alert('File is loaded');
});
```

### Parallel Download

Multiple files can be loaded in parallel by specifying them as an array

```js 
$.lazyLoad(['foo.js', 'bar.js']).done(function () {
	alert('Files are loaded');
});
```

### Dependencies

Arrays can also be used to specify dependencies. Files specified after an array will be loaded only after the array has loaded. For example, in the 
following code `foo.js` and `bar.js` will start loading only after `jquery.js` has completed loading.

```js 
$.lazyLoad([['jquery.js'], ['foo.js', 'bar.js']]).done(function () {
	alert('Files are loaded');
});
```

### Loading CSS

The plugin can also load `css` files. But since it is impossible to reliably detect if the file has completed loading, the load event will auto trigger after 500ms.

```js 
$.lazyLoad(['theme.js', 'theme.css']).done(function () {
	alert('Theme is ready');
});
```

The plugin expect CSS files to end with `.css` extension. If that is not the case, the file type can be specified by prefixing the url with `css!`.

```js 
$.lazyLoad('css!http://localhost/get/custom/css').done(function () {
	alert('Files are loaded');
});
```

### Credits
This plugin was created for [Prokerala.com](http://www.prokerala.com).