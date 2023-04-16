## Introduction

The alert function displays an alert modal with the given content and options. It returns an object containing the alert modal element, content, and options.

## Usage Example

### ESM

```
import { alert } from '@ymlluo/bs5dialog';

alert('This is an alert message.', {
  title: 'Alert',
  type: 'warning',
  size: 'md',
  btnOkText: 'OK',
  onOk: () => {
    console.log('OK button clicked.');
  },
  timeout: 5000
});
```

### CJS

```
const { alert } = require('@ymlluo/bs5dialog');

alert('This is an alert message.', {
  title: 'Alert',
  type: 'warning',
  size: 'md',
  btnOkText: 'OK',
  onOk: () => {
    console.log('OK button clicked.');
  },
  timeout: 5000
});

```

### UMD

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>UMD Example</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
    <script src="../bs5dialog.js"></script>
  </head>
  <body>
    <button id="alertBtn">Show Alert</button>
    <script>
      const alertBtn = document.getElementById('alertBtn');
      alertBtn.addEventListener('click', () => {
        bs5dialog.alert('This is an alert message.', {
          title: 'Alert',
          type: 'warning',
          size: 'md',
          btnOkText: 'OK',
          onOk: () => {
            console.log('OK button clicked.');
          },
          timeout: 5000
        });
      });
    </script>
  </body>
</html>
```


# Parameters

- content (string): The content to display in the alert modal.
- options (Object): The options for the alert modal.
- title (string): The title of the alert modal.
- type (string): The type of the alert modal (e.g. "success", "warning", "danger").
- size (string): The size of the alert modal (e.g. "sm", "md", "lg").
- id (string): The ID of the alert modal.
- btnOkText (string): The text to display on the OK button.
- icon (string): The name of the icon to display in the alert modal.
- iconClass (string): The CSS class for the icon.
- iconStyle (string): The CSS style for the icon.
- onOk (function): The function to call when the OK button is clicked.
- timeout (number): The time in milliseconds before the alert modal automatically closes.

## List of Event Listeners

- bs5:dialog:alert:created
- bs5:dialog:alert:rendered
- bs5:dialog:alert:hidden
- bs5:dialog:alert:remove
- bs5:dialog:alert:ok
- bs5:dialog:alert:cancel

## Usage of addEventListener

```
 const alertBtn = document.getElementById('alertBtn');
      alertBtn.addEventListener('click', () => {
        bs5dialog.alert('This is an alert message.');
      });
alertBtn.addEventListener('bs5:dialog:alert:ok', (event) => {
  console.log('ok.');
});

```