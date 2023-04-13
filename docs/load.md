## Introduction

Loads content or remote page into a Bootstrap 5 modal dialog with customizable options.supports default dragging, zooming, and maximizing of the modal window.


## Usage Example

### ESM

```
import { load } from '@ymlluo/bs5dialog';

load('https://example.com', {
  title: 'Example Modal',
  type: 'primary',
  size: 'md',
  id: 'example-modal',
  centered: true,
  scrollable: true,
  maximize: false,
  backdrop: true,
  focus: true,
  keyboard: true,
  draggable: true,
  resizable: true,
  btnOkText: 'OK',
  btnCancelText: 'Cancel',
  onShow: () => console.log('Modal is shown'),
  onShown: () => console.log('Modal is fully shown'),
  onHide: () => console.log('Modal is hiding'),
  onHidden: () => console.log('Modal is fully hidden'),
  isForm: true,
  onSubmit: () => console.log('Modal is submitted'),
  onSubmitSuccess: () => console.log('Modal is successfully submitted'),
  onSubmitError: () => console.log('Modal submission error'),
  onSubmitDone: () => console.log('Modal submission is done')
});

```

### CJS

```
const { load } = require('@ymlluo/bs5dialog');

load('https://example.com', {
  title: 'Example Modal',
  type: 'primary',
  size: 'md',
  id: 'example-modal',
  centered: true,
  scrollable: true,
  maximize: false,
  backdrop: true,
  focus: true,
  keyboard: true,
  draggable: true,
  resizable: true,
  btnOkText: 'OK',
  btnCancelText: 'Cancel',
  onShow: () => console.log('Modal is shown'),
  onShown: () => console.log('Modal is fully shown'),
  onHide: () => console.log('Modal is hiding'),
  onHidden: () => console.log('Modal is fully hidden'),
  isForm: true,
  onSubmit: () => console.log('Modal is submitted'),
  onSubmitSuccess: () => console.log('Modal is successfully submitted'),
  onSubmitError: () => console.log('Modal submission error'),
  onSubmitDone: () => console.log('Modal submission is done')
});

```

### UMD

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Load Example</title>
    <!-- Include Bootstrap 5 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../bs5dialog.css">

    <script src="https://cdn.bootcdn.net/ajax/libs/axios/1.3.4/axios.js"></script>
    <script src="../bs5dialog.js"></script>  </head>
  </head>
  <body>
    <button id="example-button">Open Modal</button>
    <script>
      const exampleButton = document.getElementById('example-button');
      exampleButton.addEventListener('click', () => {
        bs5dialog.load('./form.html', {
          title: 'Example Modal',
          type: 'primary',
          size: 'md',
          id: 'example-modal',
          centered: true,
          scrollable: true,
          maximize: false,
          backdrop: true,
          focus: true,
          keyboard: true,
          draggable: true,
          resizable: true,
          btnOkText: 'OK',
          btnCancelText: 'Cancel',
          onShow: () => console.log('Modal is shown'),
          onShown: () => console.log('Modal is fully shown'),
          onHide: () => console.log('Modal is hiding'),
          onHidden: () => console.log('Modal is fully hidden'),
          isForm: true,
          onSubmit: () => console.log('Modal is submitted'),
          onSubmitSuccess: () => console.log('Modal is successfully submitted'),
          onSubmitError: () => console.log('Modal submission error'),
          onSubmitDone: () => console.log('Modal submission is done')
        });
      });
    </script>
  </body>
</html>

```

## Parameters

- content (string): The content to be loaded into the modal dialog. Can be a URL or HTML content.
- options (Object): An object containing customizable options for the modal dialog.

- title (string): The title of the modal dialog.
- type (string): The type of the modal dialog, which determines the color of the status bar.
- size (string): The size of the modal dialog.
- id (string): The ID of the modal dialog.
- centered (boolean): Whether the modal dialog should be centered on the screen.
- scrollable (boolean): Whether the modal dialog should be scrollable.
- maximize (boolean): Whether the modal dialog should be maximize.
- backdrop (boolean): Whether the modal dialog should have a backdrop.
- focus (boolean): Whether the modal dialog should be focused.
- keyboard (boolean): Whether the keyboard should be enabled for the modal dialog.
- draggable (boolean): Whether the modal dialog should be draggable.
- resizable (boolean): Whether the modal dialog should be resizable.
- btnOkText (string): The text to display on the OK button.
- btnCancelText (string): The text to display on the Cancel button.
- onShow (function): A function to be called when the modal dialog is shown.
- onShown (function): A function to be called after the modal dialog is shown.
- onHide (function): A function to be called when the modal dialog is hidden.
- onHidden (function): A function to be called after the modal dialog is hidden.
- isForm (boolean): Whether the modal dialog should be a form.
- onSubmit (function): A function to be called when the modal dialog is submitted.
- onSubmitSuccess (function): A function to be called after the modal dialog is successfully submitted.
- onSubmitError (function): A function to be called if there is an error submitting the modal dialog.
- onSubmitDone (function): A function to be called after the modal dialog is submitted, regardless of success or failure.


## List of Event Listeners

- bs5:dialog:ok
- bs5:dialog:cancel
- bs5:dialog:show
- bs5:dialog:shown
- bs5:dialog:hide
- bs5:dialog:hidden

If options.isForm is true, when the form is submitted 

- bs5:dialog:form:submit:success
- bs5:dialog:form:submit:error
- bs5:dialog:form:submit:complete

