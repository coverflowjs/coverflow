---
layout: default
title : getting started
categories : [tutorial]
---

### Getting started

**Checklist:**

<ul class="checklist">
    <li>include jQuery (Version >= 1.8.0)</li>
    <li>include JQueryUI (Version >= 1.9.0)</li>
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
    <link rel="stylesheet" type="text/css" href="jqueryui.css" />
    <link rel="stylesheet" type="text/css" href="coverflow.css" />
    <script src="jquery.min.js"></script>
    <script src="jqueryui.min.js"></script>

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
	<li>CSS based animation</li>
    <li>fallback based on jQuery animate</li>
    <li>rotation polyfill for older Internet Explorer versions</li>
    <li>mousewheel support</li>
</ul>

### Swipe support

This is based on **jQuery mobile** (jQm). If you use jQm swipe support is already enabled. Otherwise use the minimal configured jQm we included in our release package. If you use more jQuery mobile features besides swipe remember to include jQuery mobile at last.
