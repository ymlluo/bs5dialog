[![Node.js Package](https://github.com/ymlluo/bs5dialog/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/ymlluo/bs5dialog/actions/workflows/npm-publish.yml)
[![Version](https://img.shields.io/npm/v/@ymlluo/bs5dialog.svg)](https://www.npmjs.com/package/@ymlluo/bs5dialog)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

# Introduction

bs5dialog is a library for creating Bootstrap 5 dialogs. It provides a set of components for creating alerts, prompts, confirms, messages, toasts, tabs, spinners, and offcanvas dialogs.

## Demo

Here is a simple demo page, which will be completed later
### ✨ [Demo](https://ymlluo.github.io/bs5dialog/dist/index.html)


---

# Installation

To install bs5dialog, run the following command:

```
npm install @ymlluo/bs5dialog
```

### CDN via jsDelivr 
Skip the download with jsDelivr to deliver cached version of bs5dialog's compiled CSS and JS to your project.

``` html
<link href="https://cdn.jsdelivr.net/gh/ymlluo/bs5dialog@master/dist/bs5dialog.css" rel="stylesheet" crossorigin="anonymous">

<script src="https://cdn.jsdelivr.net/gh/ymlluo/bs5dialog@master/dist/bs5dialog.js" crossorigin="anonymous"></script>

```


# Components

## [Alert](docs/alert.md)
Displays an alert modal with the given content and options.


## [Confirm](docs/confirm.md)
Displays a confirmation modal with the given content and options.

## [Prompt](docs/prompt.md)
Displays a prompt dialog with customizable options.

## [Message](docs/message.md)
Displays a message with customizable options

## [Spinner](docs/spinner.md)
Creates a spinner element and appends it to the target element.
> Tips:You can also use the function alias `showLoading`

## [Toast](docs/toast.md)
Displays a toast message with customizable options.

## [Offcanvas](docs/offcanvas.md)
Creates an offcanvas element with the given content and options.

## [Load](docs/load.md)

Loads content or remote page into a Bootstrap 5 modal dialog with customizable options.supports default dragging, zooming, and maximizing of the modal window.

# Internationalization

bs5dialog includes internationalization support through the i18n module. To use it, import the desired language file:


```
import { i18n } from 'bs5dialog';

```

Then, set the language using the setLanguage function:

```
bs5dialog.i18n.setCurrentLang("zh")
```


# Acknowledgments

[twbs/bootstrap](https://github.com/twbs/bootstrap)

[tabler/tabler](https://github.com/tabler/tabler)

A lot of inspiration and styling comes from these great libraries, big thanks to them



# License 

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details