import {getMaxZIndex } from "../libs";
import { getIconHtml } from "../templates.js";
import { Alert as bs5Alert } from "bootstrap";



/**
 * Displays a message with customizable options
 * @param {string} message - The message to display
 * @param {Object} options - The options to customize the message display
 * @param {string} options.position - The position of the message on the screen (default: "center")
 * @param {string} options.type - The type of message (default: "")
 * @param {boolean} options.closeBtn - Whether to display a close button (default: false)
 * @param {string} options.background - The background color of the message (default: "")
 * @param {string} options.textColor - The text color of the message (default: "")
 * @param {string} options.fontsize - The font size of the message (default: "")
 * @param {number} options.opacity - The opacity of the message (default: 1)
 * @param {boolean} options.backdrop - Whether to display a backdrop (default: false)
 * @param {string} options.icon - The icon to display with the message (default: "")
 * @param {string} options.icon_class - The class of the icon to display with the message (default: "")
 * @param {number} options.timeout - The time in milliseconds before the message disappears (default: 3000)
 * @param {function} options.onClose - The function to call when the message is closed (default: function() {})
 * @param {function} options.onClosed - The function to call after the message is closed (default: function() {})
 */ 
export function message(message, options) {
  // Set default options
  const defaultOptions = {
    position: "center",
    type: "",
    closeBtn: false,
    background: "",
    textColor: "",
    fontsize: "",
    opacity: 1,
    backdrop: false,
    icon: "",
    icon_class: "",
    timeout: 3000,
    onClose: function () {},
    onClosed: function () {}
  };

  if (options.type === "link" || !options.type) {
    options.background = "rgba(0,0,0,0.5)";
    options.textColor = "#fff";
  }

  if (options.type === "light" && !options.icon_class) {
    options.icon_class = "text-dark";
  }

  options = { ...defaultOptions, ...options };

  const overlayElement = document.createElement("div");
  if (options.backdrop) {
    overlayElement.classList.add("modal-backdrop", "fade", "show");
    document.body.appendChild(overlayElement);
    document.body.style.setProperty("overflow", "hidden");
    overlayElement.style.setProperty("z-index", getMaxZIndex() + 1);
  }

  // Create alert element
  const alertElement = document.createElement("div");
  alertElement.classList.add(
    "alert",
    `alert-${options.type}`,
    "bs5-dialog-msg",
    'text-center'
  );


  const positionClass = `bs5-dialog-msg-${options.position}`;
  alertElement.classList.add(positionClass);
  alertElement.style.opacity = options.opacity;
  alertElement.style.setProperty("z-index", getMaxZIndex() + 1);
  alertElement.setAttribute("role", "alert");

  if (options.background) {
    alertElement.style.background = options.background;
  }
  if (options.textColor) {
    alertElement.style.color = options.textColor;
  }
  if (options.fontsize) {
    alertElement.style.fontSize = options.fontsize;
  }

  alertElement.innerHTML = `<span>${
    options.icon_custom || getIconHtml(options.icon, options.icon_class || "text-" + options.type) || ""
  } ${message} ${
    options.closeBtn ? `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>` : ""
  }</span>`;

  // Add alert element to body
  document.body.appendChild(alertElement);
  const alertInstance = bs5Alert.getOrCreateInstance(alertElement);

  alertElement.addEventListener("close.bs.alert", event => {
    if (typeof options.onClose === "function") {
      options.onClose(event);
    }
  });
  alertElement.addEventListener("closed.bs.alert", event => {
    if (typeof options.onClosed === "function") {
      options.onClosed(event);
    }
  });
  if (options.timeout) {
    setTimeout(() => {
      alertElement.classList.add("bs5-dialog-msg-hide");
      setTimeout(() => {
        alertInstance.close();
        overlayElement.remove();
        document.body.style.removeProperty("overflow");
      }, 500);
    }, options.timeout);
  }
}
