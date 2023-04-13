# Introduction

The spinner function is a utility function exported by the @ymlluo/bs5dialog package. It creates a spinner element and appends it to the target element. The function returns an object with the target element, spinner element, and hide and clean functions.

# Usage Example

## ESM

```
import { spinner } from '@ymlluo/bs5dialog';

const targetElement = document.getElementById('my-element');
const options = {
  animation: 'border',
  animationClass: 'text-warning',
  animationStyle: '',
  text: 'Please wait...',
  type: '',
  backdrop: true,
  timeout: 2000
};

const { hide } = spinner(targetElement, options);

// To hide the spinner:
hide();
```

## CJS


```
const { spinner } = require('@ymlluo/bs5dialog');

const targetElement = document.getElementById('my-element');
const options = {
  animation: 'border',
  animationClass: 'text-warning',
  animationStyle: '',
  text: 'Please wait...',
  type: '',
  backdrop: true,
  timeout: 2000
};

const { hide } = spinner(targetElement, options);

// To hide the spinner:
hide();
```

## UMD

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Spinner Example</title>
    <!-- Include Bootstrap 5 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="../bs5dialog.css" />
    <script src="../bs5dialog.js"></script>
  </head>
  <body>
    <div class="container">
      <h1>Spinner Example</h1>
      <div id="targetElement" style="width: 200px; height: 200px; border: 1px solid #666; margin: 20px 0"></div>
      <button id="my-button" class="btn btn-primary">Click me</button>
    </div>
    <script>
      const myButton = document.querySelector("#my-button");
      const targetElement = document.querySelector("#targetElement");
      const options = {
        animation: "border",
        animationClass: "text-warning",
        animationStyle: "",
        text: "Please wait...",
        type: "",
        backdrop: true,
        timeout: 2000
      };

      myButton.addEventListener("click", () => {
        bs5dialog.spinner(targetElement, options);
      });
    </script>
  </body>
</html>

```

# Parameters

The spinner function takes two parameters:

- element (optional): The target element to append the spinner to. Defaults to document.body.
- options (optional): An object with the following properties:
- animation (optional): The animation for the spinner. Defaults to "border".
- animationClass (optional): The class of animation for the spinner. Defaults to "text-warning".
- animationStyle (optional): The style of animation for the spinner. Defaults to "".
- text (optional): The text of spinner. Defaults to "Please wait...".
- type (optional): The type of spinner. Defaults to "".
- backdrop (optional): Whether or not to include a backdrop. Defaults to true.
- timeout (optional): The timeout for the spinner. Defaults to 2000.


## List of Event Listeners

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
