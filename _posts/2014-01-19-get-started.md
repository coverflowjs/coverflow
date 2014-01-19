---
layout: default
title : getting started
categories : [tutorial]
---

### Getting started

**Checklist:**

<ul class="checklist">
    <li>include jQuery (Version >= 1.8.0)</li>
    <li>include coverflowjs files (css + js)</li>
</ul>

Your html may look like this:

    <div id="coverflow">
        <!-- these children will be part of the coverflow -->
        <div class="something_fancy"></div>
        <img src=".." />
        <picture><source .. /></picture>
    </div>

    <!-- put this in your html header -->
    <link rel="stylesheet" type="text/css" href="coverflow.css" />
    <script src="jquery.min.js"></script>

    <!-- include coverflow after all dependencies-->
    <script src="coverflow.min.js"></script>
    <script>
        $(function() {
            $('#coverflow').coverflow();
        });
    </script>

This minimal implementation should already work.

What we got there?

<ul class="checklist">
	<li>CSS transformed items (auto-detects 3D-support)</li>
    <li>with a polyfill for older Internet Explorer versions</li>
	<li>CSS based animation</li>
    <li>fallback based on jQuery animate</li>
    <li>mousewheel support</li>
</ul>

### Standalone Version

If you are already using jQueryUI, just drop in the standalone version and save a few bytes.

### Swipe support

This is based on external libraries. Officially supported libraries are **[jQuery mobile](http://jquerymobile.com)** and **[Hammer.js](http://eightmedia.github.io/hammer.js)**. Drop in any on these libraries and swipe left/right shall work.

Any other library works - as long as these are triggering *swipeleft* / *swiperight* events.
