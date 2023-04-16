##  Introduction

Displays a message with customizable options

## Usage Examples

### ESM

```
import { message } from '@ymlluo/bs5dialog';

const options = {
  position: "center",
  type: "success",
  closeBtn: true,
  background: "#28a745",
  textColor: "#fff",
  fontsize: "1rem",
  icon: "check-circle",
  iconClass: "bi",
  iconStyle: "font-size: 1.5rem;",
  timeout: 5000,
  onClose: function () {},
  onClosed: function () {}
};

const msg = message("This is a success message", options);

```


### CJS 

```
const { message } = require('@ymlluo/bs5dialog');

const options = {
  position: "center",
  type: "success",
  closeBtn: true,
  background: "#28a745",
  textColor: "#fff",
  fontsize: "1rem",
  icon: "check-circle",
  iconClass: "bi",
  iconStyle: "font-size: 1.5rem;",
  timeout: 5000,
  onClose: function () {},
  onClosed: function () {}
};

const msg = message("This is a success message", options);
```

### UMD

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>bs5dialog Message Example</title>
    <!-- Include Bootstrap 5 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="../bs5dialog.css" />
    <script src="../bs5dialog.js"></script>
  </head>
  <body>
    <button id="show-message-btn">Show Message</button>
    <script>
      const showMessageBtn = document.getElementById("show-message-btn");
      showMessageBtn.addEventListener("click", () => {
        const options = {
          position: "center",
          type: "success",
          closeBtn: true,
          background: "#28a745",
          textColor: "#fff",
          fontsize: "",
          icon: "bs5-circle-check",
          iconClass: "",
          iconStyle: "",
          timeout: 0,
          onClosed: function () {}
        };
        const msg = bs5dialog.message("This is a success message", options);
      });
    </script>
  </body>
</html>

```


## Parameters

- message (string): The message to display.
- options (object): The options to customize the message display.
- position (string): The position of the message on the screen (default: "center").
- type (string): The type of message (default: "").
- closeBtn (boolean): Whether to display a close button (default: false).
- background (string): The background color of the message (default: "").
- textColor (string): The text color of the message (default: "").
- fontsize (string): The font size of the message (default: "").
- icon (string): The icon to display with the message (default: "").
- iconClass (string): The class of the icon to display with the message (default: "").
- iconStyle (string): The style of the icon to display with the message (default: "").
- timeout (number): The time in milliseconds before the message disappears (default: 3000).
- onClosed (function): The function to call after the message is closed (default: function() {}).

## List of Event Listeners

- bs5:dialog:message:created
- bs5:dialog:message:rendered
- bs5:dialog:message:hidden
- bs5:dialog:message:remove
