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
			// and kick off
            $('#coverflow').coverflow();
        });
    </script>

This minimal implementation should already work. 

## Minimal implementation demo

[**jsfiddle**](http://jsfiddle.net/rudygotya/7q8eapr2/2/)

### When to use the standalone version

If you are already using jQueryUI, just drop in the standalone version and save a few bytes.

### Swipe support

Momentum swipe support is based on external libraries. Officially supported libraries are **[jQuery mobile](http://jquerymobile.com)** and **[Hammer.js](http://eightmedia.github.io/hammer.js)**. Drop in any on these libraries and momentum swipe should work.

Simple swipe support with any other library may work - as long as this library is triggering *swipeleft* / *swiperight* events.
