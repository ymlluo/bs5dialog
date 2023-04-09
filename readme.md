
[![Node.js Package](https://github.com/ymlluo/bs5dialog/actions/workflows/npm-publish.yml/badge.svg?branch=master)](https://github.com/ymlluo/bs5dialog/actions/workflows/npm-publish.yml)

Table of Contents
=================

* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#usage)
* [Components](#components)
   * [Alert](#alert)
      * [Usage](#usage-1)
      * [Parameters](#parameters)
   * [Confirm](#confirm)
      * [Usage](#usage-2)
      * [Parameters](#parameters-1)
   * [Prompt](#prompt)
      * [Usage](#usage-3)
      * [Parameters](#parameters-2)
   * [Message](#message)
      * [Usage](#usage-4)
      * [Parameters](#parameters-3)
   * [Spinner](#spinner)
      * [Usage](#usage-5)
      * [Parameters](#parameters-4)
   * [Toast](#toast)
      * [Usage](#usage-6)
      * [Parameters](#parameters-5)
   * [Offcanvas](#offcanvas)
      * [Usage](#usage-7)
      * [Parameters](#parameters-6)
   * [Load](#load)
      * [Usage](#usage-8)
      * [Parameters](#parameters-7)
* [Internationalization](#internationalization)

Created by [gh-md-toc](https://github.com/ekalinin/github-markdown-toc)

# Introduction

bs5dialog is a library for creating Bootstrap 5 dialogs. It provides a set of components for creating alerts, prompts, confirms, messages, toasts, tabs, spinners, and offcanvas dialogs. It also includes a replayLock function for preventing multiple dialog instances from being opened at the same time.

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

## Alert

The alert component creates a Bootstrap 5 alert dialog. To use it, call the alert function with the desired message:
### Usage

To use the alert function, simply import it and call it with the desired parameters. Here's an example:

```
import { alert } from "bs5dialog";

alert("This is an alert message.", {
  title: "Alert",
  type: "warning",
  size: "md",
  btnOkText: "OK",
  icon: "warning",
  icon_class: "text-warning",
  onOk: () => {
    console.log("OK button clicked.");
  },
  timeout: 5000
});
```
### Parameters
The alert function takes two parameters:

- content (string, required): The content to display in the modal.
- options (object, optional): The options for the modal.

The options object can have the following properties:

- title (string, default: ""): The title of the modal.
- type (string, default: "success"): The type of the modal. Possible values are "success", "info", "warning", and "danger".
- size (string, default: "sm"): The size of the modal. Possible values are "sm", "md", and "lg".
- btnOkText (string, default: ""): The text to display on the OK button.
- icon (string, default: "ok"): The icon to display in the modal. Possible values are "ok", "info", "warning", "danger", "question", and "custom".
- icon_class (string, default: ""): The class of the icon to display in the modal.
- icon_custom (string, default: ""): The custom icon to display in the modal.
- onOk (function, default: null): The function to call when the OK button is clicked.
- timeout (number, default: 0): The time in milliseconds before the modal automatically closes.

For more information on the available options, please refer to the comments in the alert.js file.

--- 

## Confirm

The confirm function displays a confirmation dialog with the given content and options. It is used to confirm an action before proceeding.

### Usage

To use the Confirm function, simply import it and call it with the desired parameters. Here's an example:

```
import { confirm } from "bs5dialog";
confirm("Are you sure you want to delete this item?", {
  title: "Delete Item",
  type: "danger",
  size: "sm",
  btnOkText: "Delete",
  btnCancelText: "Cancel",
  icon: "warning",
  icon_class: "text-danger",
  onConfirm: () => {
    // delete item
  },
  onCancel: () => {
    // do nothing
  }
});
```
### Parameters

The content parameter is the message to display in the dialog. The options parameter is an object with the following properties:
- title: The title of the dialog.
- type: The type of the dialog. Can be "primary", "secondary", "success", "danger", "warning", "info", or "light".
- size: The size of the dialog. Can be "sm", "md", or "lg".
- btnOkText: The text to display on the OK button.
- btnCancelText: The text to display on the Cancel button.
- icon: The icon to display in the dialog. Can be "alert", "check", "info", "question", or "trash".
- icon_class: The class of the icon to display in the dialog.
- onConfirm: The function to call when the OK button is clicked.
- onCancel: The function to call when the Cancel button is clicked.

For more information on the available options, please refer to the comments in the confirm.js file.

--- 

## Prompt

The prompt component creates a Bootstrap 5 prompt dialog. To use it, call the prompt function with the desired message and a callback function to handle the user's input:

### Usage

To use the prompt function, simply import it and call it with the desired parameters. Here's an example:
```
import { prompt } from "bs5dialog";

prompt("Enter your name:", {
  title: "Name Prompt",
  type: "primary",
  size: "sm",
  btnText: "Submit",
  icon: "person",
  icon_class: "text-primary",
  required: true,
  secret: false,
  onConfirm: (name) => {
    console.log(`Hello, ${name}!`);
  },
  onCancel: () => {
    console.log("Prompt cancelled.");
  }
});
```

### Parameters

The prompt function takes two parameters:

- content (required): The content to display in the modal body.
- options (optional): An object containing optional parameters.

The following options are available:

- title (string): The title of the modal.
- type (string): The type of the modal (e.g. primary, secondary, success, etc.).
- size (string): The size of the modal (e.g. sm, md, lg, etc.).
- btnText (string): The text to display on the confirmation button.
- icon (string): The name of the icon to display in the modal.
- icon_class (string): The class to apply to the icon.
- icon_custom (string): Custom HTML for the icon.
- required (boolean): Whether or not the input should be a required field.
- secret (boolean): Whether or not the input should be a password field.
- onConfirm (function): A function to call when the confirmation button is clicked.
- onCancel (function): A function to call when the cancel button is clicked.
For more information on the available options, please refer to the comments in the prompt.js file.

---


## Message

The message component creates a Bootstrap 5 message dialog. 

### Usage


To use the message function, simply import it and call it with the desired parameters. Here's an example:

```
import { message } from "bs5dialog";

message("Hello world!", {
  position: "top",
  type: "success",
  closeBtn: true,
  background: "#28a745",
  textColor: "#fff",
  fontsize: "1.2rem",
  opacity: 0.9,
  backdrop: true,
  icon: "success",
  icon_class: "",
  timeout: 5000,
  onClose: function() {
    console.log("Alert closed!");
  },
  onClosed: function() {
    console.log("Alert closed and hidden!");
  }
});
```
> Tips:You can also use the function alias `msg`

### Parameters
It takes in two parameters: message (string) and options (object). The available options are:

- position (string): The position of the message on the screen (default: "center")
- type (string): The type of message (default: "")
- closeBtn (boolean): Whether to display a close button (default: false)
- background (string): The background color of the message (default: "")
- textColor (string): The text color of the message (default: "")
- fontsize (string): The font size of the message (default: "")
- opacity (number): The opacity of the message (default: 1)
- backdrop (boolean): Whether to display a backdrop (default: false)
- icon (string): The icon to display with the message (default: "")
- icon_class (string): The class of the icon to display with the message (default: "")
- timeout (number): The time in milliseconds before the message disappears (default: 3000)
- onClose (function): The function to call when the message is closed (default: function() {})
- onClosed (function): The function to call after the message is closed (default: function() {})

For more information on the available options, please refer to the comments in the message.js file.

---


## Spinner

The spinner component creates a Bootstrap 5 spinner. 
### Usage


To use the spinner function, simply import it and call it with the desired parameters. Here's an example:

```
import { spinner } from "bs5dialog";

const targetElement = document.getElementById("my-element");
const options = {
  animation: "border",
  type: "warning",
  backdrop: true,
  timeout: 3000
};

const mySpinner = spinner(targetElement, options);
```
This will create a spinner element and append it to the my-element element with the specified options.

> Tips:You can also use the function alias `showLoading`

### Parameters

The spinner function takes two parameters:

- element (optional): The target element to append the spinner to. Defaults to document.body.
- options (optional): An object with the following properties:
- animation (optional): The type of animation for the spinner. Can be "border" or "grow". Defaults to "border".options:plane,chase,bounce,wave,pulse,flow,swing,circle,grid,fold,wander 
- type (optional): The type of spinner. Can be "primary", "secondary", "success", "danger", "warning", "info", or "light". Defaults to "warning".
- backdrop (optional): Whether or not to include a backdrop. Can be true, false, "true", or "false". Defaults to true.
- timeout (optional): The timeout for the spinner in milliseconds. Set to 0 to disable the timeout. Defaults to 3000.

For more information on the available options, please refer to the comments in the spinner.js file.

The spinner function returns an object with the following properties:

- targetElement: The target element that the spinner was appended to.
- spinnerElement: The spinner element.
- hide(): A function that hides the spinner.
- clean(): A function that removes all spinner elements from the document.


The spinnerClean function can be used to remove the spinner:

```
import { spinnerClean } from "bs5dialog";

spinnerClean();
```
> Tips:You can also use the function alias `hideLoading`

----

## Toast
The toast function displays a toast message with customizable options.

### Usage

To use the toast function, simply import it and call it with the desired parameters. Here's an example:

```
import { toast } from "bs5dialog";

toast("Hello, world!", { position: "right-bottom", type: "info", timeout: 5000 });
```
This will display a toast message with the text "Hello, world!" at the right bottom of the screen, with an info icon and a timeout of 5 seconds.

### Parameters

The toast function takes two parameters:

- message (required): The message to display in the toast.
- options (optional): An object containing customizable options for the toast. The available options are:

- title (string): The title of the toast.
- subtitle (string): The subtitle of the toast.
- position (string): The position of the toast on the screen. Possible values are "top-left", "top-center", "top-right", "bottom-left", "bottom-center", and "bottom-right". Default is "bottom-right".
- type (string): The type of toast. Possible values are "success", "warning", "error", "info", and all boostrap button types. Default is "success".
- border (number): The border size of the toast. Default is 0.
- closeBtn (boolean): Whether or not to display a close button on the toast. Default is false.
- background (string): The background color of the toast. Default is "#fff".
- textColor (string): The text color of the toast.
- fontsize (string): The font size of the toast.
- opacity (number): The opacity of the toast. Default is 1.
- backdrop (boolean): Whether or not to display a backdrop behind the toast. Default is false.
- icon (string): The icon to display on the toast. Possible values are "dot", "help", "alert", "success", "error". Default is "dot".
- icon_class (string): The class to apply to the icon on the toast.
- timeout (number): The amount of time (in milliseconds) to display the toast. Default is 3000.
- onShow (function): A function to call when the toast is shown.
- onShown (function): A function to call after the toast is shown.
- onHide (function): A function to call when the toast is hidden.
- onHidden (function): A function to call after the toast is hidden.

For more information on the available options, please refer to the comments in the toast.js file.

---


## Offcanvas

The offcanvas function creates an offcanvas element with the given content and options.

### Usage

To use the toast function, simply import it and call it with the desired parameters. Here's an example:

```
import { offcanvas } from "bs5dialog";

offcanvas("Hello, world!", {
  title: "My Offcanvas",
  direction: "start",
  size: "50%",
  id: "my-offcanvas",
  backdrop: true,
  scroll: true,
  dark: false,
  accordion: true,
  container: "",
  onStart: function () {},
  onShown: function () {},
  onHidden: function () {}
});

```


### Parameters

The offcanvas function takes two parameters:

- content (required): The content to be displayed in the offcanvas.
- options (optional): The options for the offcanvas. The available options are:

- title (string): The title of the offcanvas.
- direction (string): The direction of the offcanvas. Can be one of "start", "end", "top", or "bottom".
- size (string): The size of the offcanvas. Can be any valid CSS size value.
- id (string): The id of the offcanvas. If not provided, a unique id will be generated.
- backdrop (boolean): Whether or not to show a backdrop.
- scroll (boolean): Whether or not to allow scrolling.
- dark (boolean): Whether or not to use dark mode.
- accordion (boolean): Whether or not to use accordion mode.
- container (string): The container for the offcanvas. Can be any valid CSS selector.
- onStart (function): The function to be called when the offcanvas starts.
- onShown (function): The function to be called when the offcanvas is shown.
- onHidden (function): The function to be called when the offcanvas is hidden.

For more information on the available options, please refer to the comments in the offcanvas.js file.


---

## Load

The load function is used to open a modal dialog with the given content and options.
The load function is a powerful alternative to the Bootstrap modal. It allows you to open a modal dialog with the given content and options, and provides a lot of flexibility and customization options.

Compared to the Bootstrap modal, the load function provides more control over the modal's behavior and appearance. For example, you can specify whether the modal should be draggable or resizable and etc
the load function can indeed load a form and replace form submit. You can achieve this by passing a string of HTML containing the form as the content parameter, and defining a function to be called when the form is submitted using the onSubmit option

Regarding reloading a remote page, you can achieve this by passing a URL as the content parameter
Finally, if a page renders an iframe, you can load the iframe content in a modal dialog by passing the iframe's src attribute as the content parameter.

### Usage

To use the load function, simply import it and call it with the desired parameters. Here's an example:

```
import { load } from "bs5dialog";

load({
  title: "Example Modal",
  content: "<p>This is an example modal.</p>",
  size: "md",
  type: "primary",
  onShow: function() {
    console.log("Modal shown.");
  },
  onHide: function() {
    console.log("Modal hidden.");
  }
});
```

the load function can indeed load a form and replace form submit. You can achieve this by passing a string of HTML containing the form as the content parameter, and defining a function to be called when the form is submitted using the onSubmit option. Here's an example:

```
import { load } from "bs5dialog";
load({
  title: "Remote Form Modal",
  content: "/path/to/remote/form.html",
  size: "md",
  type: "primary",
  onSubmitSuccess: function(result) {
    console.log("Form submitted successfully:", result);
  },
  onSubmitError: function(result) {
    console.error("Form submission failed:", result);
  }
});
```


### Parameters

- options (object): An object containing the following properties:
- id (string, optional): The ID of the modal element. If not provided, a unique ID will be generated.
- title (string): The title of the modal.
- content (string): The content of the modal. This can be either a string of HTML or a URL to fetch content from.
- size (string, optional): The size of the modal. Can be "sm", "md", "lg", "xl", or "xxl". Defaults to "md".
- fullscreen (boolean, optional): Whether or not the modal should be displayed in fullscreen mode. Defaults to false.
- centered (boolean, optional): Whether or not the modal should be vertically centered. Defaults to false.
- scrollable (boolean, optional): Whether or not the modal should be scrollable. Defaults to false.
- type (string, optional): The type of the modal. Can be "primary", "secondary", "success", "danger", "warning", "info", or "light". Defaults to "primary".
- keyboard (boolean, optional): Whether or not the modal should be closed when the escape key is pressed. Defaults to true.
- focus (boolean, optional): Whether or not the modal should be focused when opened. Defaults to true.
- backdrop (boolean, optional): Whether or not a backdrop should be displayed behind the modal. Defaults to true.
- draggable (boolean, optional): Whether or not the modal should be draggable. Defaults to false.
- resizable (boolean, optional): Whether or not the modal should be resizable. Defaults to false.
- btnOkText (string, optional): The text to display on the "OK" button. Defaults to "Save".
- onShow (function, optional): A function to be called when the modal is shown.
- onShown (function, optional): A function to be called after the modal is shown.
- onHide (function, optional): A function to be called when the modal is hidden.
- onHidden (function, optional): A function to be called after the modal is hidden.
- onSubmit (function, optional): A function to be called when the modal's form is submitted.
- onSubmitSuccess (function, optional): A function to be called when the modal's form is successfully submitted.
- onSubmitError (function, optional): A function to be called when the modal's form submission fails.
- onSubmitDone (function, optional): A function to be called after the modal's form is submitted, regardless of success or failure.

For more information on the available options, please refer to the comments in the load.js file.

---


# Internationalization

bs5dialog includes internationalization support through the i18n module. To use it, import the desired language file:


```
import { i18n } from 'bs5dialog';

```

Then, set the language using the setLanguage function:

```
bs5dialog.i18n.setCurrentLang("zh")
```
