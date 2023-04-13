## Introduction

The offcanvas function is a part of the @ymlluo/bs5dialog package, which is based on Bootstrap 5. This function creates an offcanvas element with the given content and options.

## Usage Example

### ESM

```
import { offcanvas } from '@ymlluo/bs5dialog';

const content = 'This is the content of the offcanvas.';
const options = {
  title: 'Offcanvas Title',
  direction: 'start',
  size: '300px',
  id: 'offcanvas-id',
  backdrop: true,
  scroll: true,
  dark: false,
  accordion: true,
  container: '',
  onStart: function () {},
  onShown: function () {},
  onHidden: function () {}
};

const offcanvasInstance = offcanvas(content, options);
```


### CJS

```
const { offcanvas } = require('@ymlluo/bs5dialog');

const content = 'This is the content of the offcanvas.';
const options = {
  title: 'Offcanvas Title',
  direction: 'start',
  size: '300px',
  id: 'offcanvas-id',
  backdrop: true,
  scroll: true,
  dark: false,
  accordion: true,
  container: '',
  onStart: function () {},
  onShown: function () {},
  onHidden: function () {}
};

const offcanvasInstance = offcanvas(content, options);

```

### UMD

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Offcanvas Example</title>
    <!-- Include Bootstrap 5 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../bs5dialog.css">
    <script src="../bs5dialog.js"></script>  </head>
  <body>
    <button id="open-offcanvas">Open Offcanvas</button>
    <script>
      const content = 'This is the content of the offcanvas.';
      const options = {
        title: 'Offcanvas Title',
        direction: 'start',
        size: '300px',
        id: 'offcanvas-id',
        backdrop: true,
        scroll: true,
        dark: false,
        accordion: true,
        container: '',
        onStart: function () {},
        onShown: function () {},
        onHidden: function () {}
      };

      const openOffcanvasButton = document.getElementById('open-offcanvas');
      openOffcanvasButton.addEventListener('click', function () {
        const offcanvasInstance = bs5dialog.offcanvas(content, options);
      });
    </script>
  </body>
</html>
```

## Parameters

The offcanvas function takes two parameters:

- content (string): The content to be displayed in the offcanvas.
- options (object): The options for the offcanvas. The available options are:
- title (string): The title of the offcanvas.
- direction (string): The direction of the offcanvas. Possible values are "start", "end", "top", and "bottom".
- size (string): The size of the offcanvas. This should be a CSS value, such as "300px".
- id (string): The id of the offcanvas.
- backdrop (boolean): Whether or not to show a backdrop.
- scroll (boolean): Whether or not to allow scrolling.
- dark (boolean): Whether or not to use dark mode.
- accordion (boolean): Whether or not to use accordion mode.
- container (string): The container for the offcanvas.
- onStart (function): The function to be called when the offcanvas starts.
- onShown (function): The function to be called when the offcanvas is shown.
- onHidden (function): The function to be called when the offcanvas is hidden.




## List of Event Listeners

- bs5:dialog:ok
- bs5:dialog:show
- bs5:dialog:shown
- bs5:dialog:hide
- bs5:dialog:hidden

These events can be listened to using the addEventListener method. For example:

offcanvasInstance.el.addEventListener('bs5:dialog:shown', (event) => {
  console.log(event.detail);
});
```