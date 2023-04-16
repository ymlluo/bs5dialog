## Introduction

The confirm function is exported from the @ymlluo/bs5dialog package and is used to display a confirmation modal with customizable options.

## Usage

### ESM

```
import { confirm } from '@ymlluo/bs5dialog';

const options = {
  title: 'Are you sure?',
  type: 'danger',
  btnOkText: 'Yes',
  btnCancelText: 'No',
  onConfirm: () => {
    console.log('Confirmed!');
  },
  onCancel: () => {
    console.log('Cancelled!');
  }
};

const { el, content, options: confirmedOptions } = confirm('Are you sure you want to do this?', options);
```

### CJS

```
const { confirm } = require('@ymlluo/bs5dialog');

const options = {
  title: 'Are you sure?',
  type: 'danger',
  btnOkText: 'Yes',
  btnCancelText: 'No',
  onConfirm: () => {
    console.log('Confirmed!');
  },
  onCancel: () => {
    console.log('Cancelled!');
  }
};

const { el, content, options: confirmedOptions } = confirm('Are you sure you want to do this?', options);
```

### UMD

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Confirm Modal Example</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../bs5dialog.css">
    <script src="../bs5dialog.js"></script>
  </head>
  <body>
    <button id="confirm-btn">Confirm</button>
    <script>
      const confirmBtn = document.getElementById('confirm-btn');
      confirmBtn.addEventListener('click', () => {
        const options = {
          title: 'Are you sure?',
          type: 'danger',
          btnOkText: 'Yes',
          btnCancelText: 'No',
          onConfirm: () => {
            console.log('Confirmed!');
          },
          onCancel: () => {
            console.log('Cancelled!');
          }
        };
        const { el, content, options: confirmedOptions } = bs5dialog.confirm('Are you sure you want to do this?', options);
      });
    </script>
  </body>
</html>
```

## Parameters

The confirm function takes in two parameters:

- content (string): The content to display in the modal.
- options (object): The options for the modal. It can contain the following properties:

- title (string): The title of the modal.
- type (string): The type of the modal. Possible values are primary, secondary, success, danger, warning, info, light, and dark.
- id (string): The ID of the modal.
- size (string): The size of the modal. Possible values are sm, md, lg, and xl.
- btnOkText (string): The text to display on the OK button.
- btnCancelText (string): The text to display on the Cancel button.
- icon (string): The icon to display in the modal.
- iconClass (string): The class of the icon to display in the modal.
- iconStyle (string): The style of the icon to display in the modal.
- onConfirm (function): The function to call when the OK button is clicked.
- onCancel (function): The function to call when the Cancel button is clicked.

## List of Event Listeners

- bs5:dialog:confirm:created
- bs5:dialog:confirm:rendered
- bs5:dialog:confirm:hidden
- bs5:dialog:confirm:remove
- bs5:dialog:confirm:ok
- bs5:dialog:confirm:cancel

## Usage of addEventListener

```
 const confirmBtn = document.getElementById('confirm-btn');
 confirmBtn.addEventListener('click', () => {
     bs5dialog.confirm('Are you sure you want to do this?');
  })

confirmBtn.addEventListener('bs5:dialog:confirm:ok', () => {
  console.log('OK button clicked.');
});


```
