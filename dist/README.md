# UI Coverflow

![](https://raw.github.com/coverflowjs/coverflow/master/demo/img/screenshot.png)

The jQueryUI Coverflow project seeks to create a fully functional 'CoverFlow' effect using a combination of jQuery, jQuery UI components and CSS3 transforms.

## Getting Started

`#: git clone git://github.com/coverflowjs/coverflow.git`

`#: cd coverflow`

`#: git pull origin master && git submodule update --init`

## automatic event binding:

This coverflow effect binds to the following events on initialization:

 - mousewheel
 - mobile swipe events
 - keyboard selection (tabbed)
 - items.click
 - items.focus

## public events:
 - beforeselect
 - select

## Documentation

**Plugin Methods**

 - select( Int/{jQuery} item ):

    Returns a boolean (selection success). Pass an item index (zero based) or any valid jQuery coverflow item. So these expressions are equivalent:

    ` $('#coverflow' ).coverflow( 'select', 2 );`

    ` $('#coverflow' ).coverflow( 'select', $('#coverflow > *:eq(2)' ) );`

 - next()

    ` $('#coverflow' ).coverflow( 'prev' );`

    Returns a boolean (selection success). Selects next/previous item.
    
 - prev()

    ` $('#coverflow' ).coverflow( 'prev' );`

    Returns a boolean (selection success). Selects next/previous item.


**Plugin Options:**

 - items (string):

    Any valid jQuery Selector. Default any child element of your coverflow container.

 - stacking (float):

    Value between 0 and 1. Defines how close items should stack. Default 0.73.

 - active (int >=0):

    active item index on initialisation, zero based. Default the first item got selected.

 - duration (int):

    animation duration in ms, default 200.

 - easing (string):

    easing used for animation. Defaults to 'easeOutQuint'

 - trigger (plain object):

    automatic event bindings you may want to customize. Your options are:

        - itemfocus
        - itemclick
        - mousewheel
        - swipe

**Swipe Support:**

Swipe support depends on jQuery mobile. If you only want to support swipe (and don't need the full jQm lib), you can use the custom build that ships with this repository (it's just jQm core/events).

**CSS3 Transitions support:**

Depends on [$.fn.transit](https://github.com/rstacruz/jquery.transit) and [requestAnimationFrame(RAF) polyfill](https://gist.github.com/paulirish/1579671). Simply include libs/jquery.transit.js and libs/raf.js.

**jQuery animate fallback:**

Don't want to include any external libraries besides jQueryUI? No problem. Coverflowjs will fallback to jQuery's animate fn.

**Mousewheel support:**

No external lib needed.

**Internet Explorer transformations for IE<=9:**

You don't need transformie or sylvester. Filter matrices for IE are applied if there's no css3 transform support.

## Examples

Check out demo/index.html or tests/visual.html in your browser.

## License
Copyright (c) 2008-2012 Paul Baukus, Addy Osmani, Sebastian Sauer
Licensed under the MIT licenses.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

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
