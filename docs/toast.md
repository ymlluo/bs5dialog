
# Introduction
Displays a toast message with customizable options.

# Usage Example

## ESM

```
import { toast } from "./path/to/toast.js";

toast("Hello world!", {
  position: "top-center",
  type: "warning",
  title: "My Title",
  subtitle: "My Subtitle",
  icon: "bi bi-alarm",
  iconClass: "me-2",
  iconStyle: { fontSize: "1.5rem" },
  timeout: 5000,
  onHide: () => console.log("Toast hidden"),
  onHidden: () => console.log("Toast fully hidden"),
  onShow: () => console.log("Toast shown"),
  onShown: () => console.log("Toast fully shown"),
});
```

## CJS

```
const { toast } = require("./path/to/toast.js");

toast("Hello world!", {
  position: "top-center",
  type: "warning",
  title: "My Title",
  subtitle: "My Subtitle",
  icon: "bi bi-alarm",
  iconClass: "me-2",
  iconStyle: { fontSize: "1.5rem" },
  timeout: 5000,
  onHide: () => console.log("Toast hidden"),
  onHidden: () => console.log("Toast fully hidden"),
  onShow: () => console.log("Toast shown"),
  onShown: () => console.log("Toast fully shown"),
});

```
## UMD

```
<!DOCTYPE html>
<html>
  <head>
    <!-- Include Bootstrap 5 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" />
    <!-- Include Bootstrap icons CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.min.css" />
    <link rel="stylesheet" href="../bs5dialog.css" />
    <script src="../bs5dialog.js"></script>
  </head>

  <body>
    <button id="toastButton">Show Toast</button>
    <script>
      const toastButton = document.getElementById("toastButton");
      toastButton.addEventListener("click", () => {
        bs5dialog.toast("Hello world!", {
          position: "right-top",
          type: "warning",
          title: "My Title",
          subtitle: "My Subtitle",
          icon: "bi bi-alarm",
          iconClass: "me-2",
          iconStyle: '{ fontSize: "1.5rem" }',
          timeout: 5000,
          onHidden: () => console.log("Toast fully hidden"),
          onShow: () => console.log("Toast shown"),
          onShown: () => console.log("Toast fully shown")
        });
      });
    </script>
  </body>
</html>

```
# Parameters

- message (string): The message to display in the toast.
- options (Object): An object containing customizable options for the toast.
- title (string): The title of the toast.
- subtitle (string): The subtitle of the toast.
- position (string): The position of the toast on the screen.
- type (string): The type of toast (success, warning, error, etc.).
- closeBtn (boolean): Whether or not to display a close button on the toast.
- textColor (string): The text color of the toast.
- icon (string): The icon to display on the toast.
- iconClass (string): The class to apply to the icon on the toast.
- iconStyle (string): The style to apply to the icon on the toast.
- timeout (number): The amount of time (in milliseconds) to display the toast.
- onShow (function): A function to call when the toast is shown.
- onShown (function): A function to call after the toast is shown.
- onHidden (function): A function to call after the toast is hidden.


# List of Event Listeners

- bs5:dialog:toast:created
- bs5:dialog:toast:rendered
- bs5:dialog:toast:hidden
- bs5:dialog:toast:remove
