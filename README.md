[Forked from Addy Osmani](https://github.com/addyosmani/jqueryui-coverflow-ii) - The jQueryUI Coverflow project seeks to create a fully functional 'CoverFlow' effect using a combination of jQuery, jQuery UI components and CSS3 transforms.

**please note**

This is highly experimental code. IE support temporarily dropped - I'll reinclude support after more testing/refactoring.

**public events:**
 - beforeselect
 - select
 - orientationchange
 
**changelog:**

refactored internals:

 - options related:
    - add itemscale to options (and take care for negative margins then)
    - multiple trigger support, defaults to focus and click
    - removed center and recenter options (don't see a usecase here)
    - add animation related options: duration + easing

 - jQuery 1.8 related:
    - drop prefix testing

 - jQueryUI 1.9 related:
    - add jQueryUI 1.9 bindings
    - add destroy method (needs testing)
    - allow orientation change by providing _init() (needs testing + custom event)

 - internals:
    - use easier assignments (dropped props-Property)
    - whitespacing - see jQueryUI code guidelines
    - add: beforeselect event
    - fix: move select event trigger - triggers after animation finished
    - fix: animation stop - jump to end
    - fix: currentIndex assignMent
    - refactored internals to make the code DRY
    - moved demo/lib related files
	- fix itemscale
	- cleanup dirs
	- added jQueryui dist files
	- added jshint (use `npm install -d` and run `make test`)

**LICENSE**
    MIT-license

**Authors**
 - Sebastian Sauer
 - Addy Osmani
 - Paul Baukus
