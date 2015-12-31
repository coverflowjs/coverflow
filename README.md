# CoverflowJS

![](https://raw.github.com/coverflowjs/coverflow/master/demo/img/screenshot.png)

The Coverflow project seeks to create a fully functional 'CoverFlow' effect using a combination of jQuery, jQuery UI components and CSS3 transforms.

## Getting Started

`#: git clone --recursive git://github.com/coverflowjs/coverflow.git`

## Documentation

 - [JS Fiddle](http://jsfiddle.net/rudygotya/7q8eapr2/2/)
 - [Get started](http://coverflowjs.github.io/coverflow/tutorial/get-started/)
 - [API options](http://coverflowjs.github.io/coverflow/api/options/)
 - [API events](http://coverflowjs.github.io/coverflow/api/events/)
 - [API methods](http://coverflowjs.github.io/coverflow/api/methods/)

## License
Copyright (c) 2008-2015 Paul Baukus, Addy Osmani, Sebastian Sauer, Brandon Belvin
Licensed under the MIT licenses.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](http://gruntjs.com).

### Important notes
Please don't edit files in the `dist` subdirectory as they are generated via grunt. You'll find source code in the `src` subdirectory!

While grunt can run the included unit tests via PhantomJS, this shouldn't be considered a substitute for the real thing. Please be sure to test the `tests/qunit/*.html` unit test file(s) in _actual_ browsers.

### Installing grunt
_This assumes you have [node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed already._

1. Test that grunt is installed globally by running `grunt --version` at the command-line.
1. If grunt isn't installed globally, run `npm install -g grunt` to install the latest version. _You may need to run `sudo npm install -g grunt`._
1. From the root directory of this project, run `npm install` to install the project's dependencies.

### Installing PhantomJS

In order for the qunit task to work properly, [PhantomJS](http://www.phantomjs.org/) must be installed and in the system PATH (if you can run "phantomjs" at the command line, this task should work).

Unfortunately, PhantomJS cannot be installed automatically via npm or grunt, so you need to install it yourself. There are a number of ways to install PhantomJS.

* [PhantomJS and Mac OS X](http://ariya.ofilabs.com/2012/02/phantomjs-and-mac-os-x.html)
* [PhantomJS Installation](http://code.google.com/p/phantomjs/wiki/Installation) (PhantomJS wiki)

Note that the `phantomjs` executable needs to be in the system `PATH` for grunt to see it.

* [How to set the path and environment variables in Windows](http://www.computerhope.com/issues/ch000549.htm)
* [Where does $PATH get set in OS X 10.6 Snow Leopard?](http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard)
* [How do I change the PATH variable in Linux](https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux)
