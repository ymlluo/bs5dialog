## Introduction

The prompt function is a part of the @ymlluo/bs5dialog package and is exported as a module. It creates a prompt dialog box with customizable options and returns an object containing the dialog element, content, and options.


## Usage Example

```
import { prompt } from '@ymlluo/bs5dialog';

const { el, content, options } = prompt('Enter your name:', {
  title: 'Please enter your name',
  type: 'primary',
  size: 'md',
  btnText: 'Submit',
  icon: 'person',
  iconClass: 'bi',
  iconStyle: 'color: blue',
  required: true,
  secret: false,
  onConfirm: (value) => {
    console.log(`Hello, ${value}!`);
  },
  onCancel: () => {
    console.log('Prompt dialog box was cancelled.');
  }
});

```

### CJS

```
const { prompt } = require('@ymlluo/bs5dialog');

const { el, content, options } = prompt('Enter your name:', {
  title: 'Please enter your name',
  type: 'primary',
  size: 'md',
  btnText: 'Submit',
  icon: 'person',
  iconClass: 'bi',
  iconStyle: 'color: blue',
  required: true,
  secret: false,
  onConfirm: (value) => {
    console.log(`Hello, ${value}!`);
  },
  onCancel: () => {
    console.log('Prompt dialog box was cancelled.');
  }
});

```

### UMD

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>bs5dialog Prompt Example</title>
    <!-- Include Bootstrap 5 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../bs5dialog.css">
    <script src="../bs5dialog.js"></script>
  </head>
  <body>
    <div class="container">
      <h1>bs5dialog Prompt Example</h1>
      <button id="prompt-btn" class="btn btn-primary">Open Prompt Dialog</button>
    </div>

    <script>
      const promptBtn = document.getElementById('prompt-btn');

      promptBtn.addEventListener('click', () => {
        const { el, content, options } = bs5dialog.prompt('Enter your name:', {
          title: 'Please enter your name',
          type: 'primary',
          size: 'md',
          btnText: 'Submit',
          icon: '',
          iconClass: '',
          iconStyle: '',
          required: true,
          secret: false,
          onConfirm: (value) => {
            console.log(`Hello, ${value}!`);
          },
          onCancel: () => {
            console.log('Prompt dialog box was cancelled.');
          }
        });
      });
    </script>
  </body>
</html>

```


## Parameters

The prompt function takes two parameters:
- content (required): The content to be displayed in the prompt dialog box.
- options (optional): An object containing customizable options for the prompt dialog box. The available options are:
- title (string): The title of the prompt dialog box.
- type (string): The type of the prompt dialog box. Possible values are primary, secondary, success, danger, warning, info, light, and dark.
- size (string): The size of the prompt dialog box. Possible values are sm, md, lg, and xl.
- btnText (string): The text to be displayed on the OK button.
- icon (string): The name of the icon to be displayed in the prompt dialog box.
- iconClass (string): The class to be applied to the icon.
- iconStyle (string): The style to be applied to the icon.
- required (boolean): Whether the input field is required or not.
- secret (boolean): Whether the input field should display the entered text as asterisks or not.
- onConfirm (function): A function to be called when the OK button is clicked. The entered value is passed as an argument to this function.
- onCancel (function): A function to be called when the Cancel button is clicked.

## List of Event Listeners

- bs5:dialog:typing
- bs5:dialog:ok
- bs5:dialog:cancel
- bs5:dialog:show
- bs5:dialog:shown
- bs5:dialog:hide
- bs5:dialog:hidden


These events can be listened to using the addEventListener method. For example:


```
modalElement.addEventListener('bs5:dialog:ok', function(event) {
  // Handle the event here
});
```





