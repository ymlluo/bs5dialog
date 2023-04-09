import { getMaxZIndex,getTextClass } from "../libs";
import { getIconHtml } from "../templates.js";
import { Toast as bs5Toast } from "bootstrap";

/**
 * Displays a toast message with customizable options.
 * @param {string} message - The message to display in the toast.
 * @param {Object} options - An object containing customizable options for the toast.
 * @param {string} options.title - The title of the toast.
 * @param {string} options.subtitle - The subtitle of the toast.
 * @param {string} options.position - The position of the toast on the screen.
 * @param {string} options.type - The type of toast (success, warning, error, etc.).
 * @param {number} options.border - The border size of the toast.
 * @param {boolean} options.closeBtn - Whether or not to display a close button on the toast.
 * @param {string} options.background - The background color of the toast.
 * @param {string} options.textColor - The text color of the toast.
 * @param {string} options.fontsize - The font size of the toast.
 * @param {number} options.opacity - The opacity of the toast.
 * @param {boolean} options.backdrop - Whether or not to display a backdrop behind the toast.
 * @param {string} options.icon - The icon to display on the toast.
 * @param {string} options.icon_class - The class to apply to the icon on the toast.
 * @param {number} options.timeout - The amount of time (in milliseconds) to display the toast.
 * @param {function} options.onShow - A function to call when the toast is shown.
 * @param {function} options.onShown - A function to call after the toast is shown.
 * @param {function} options.onHide - A function to call when the toast is hidden.
 * @param {function} options.onHidden - A function to call after the toast is hidden.
 */

export function toast(message, options) {
  // Set default options
  const defaultOptions = {
    title: "",
    subtitle: "",
    position: "bottom-right",
    type: "success",
    border:0,
    closeBtn: false,
    background: "#fff",
    textColor: "",
    fontsize: "",
    opacity: 1,
    backdrop: false,
    icon: "dot",
    icon_class: "",
    timeout: 3000,
    onShow: function () {},
    onShown: function () {},
    onHide: function () {},
    onHidden: function () {}
  };

  options = { ...defaultOptions, ...options };

  const toastElement = document.createElement("div");
  toastElement.classList.add("toast", "bs5-dialog-msg", "bs5-dialog-msg-" + options.position,'border-'+options.border);
  toastElement.setAttribute("role", "alert");
  toastElement.style.zIndex=getMaxZIndex() + 1;
  // Create toast body element
  const toastBodyElement = document.createElement("div");
  toastBodyElement.classList.add("toast-body");
  toastBodyElement.innerHTML = message;

  // Add header and body to toast element
  // Create toast header element
  if (options.title) {
    const toastHeaderElement = document.createElement("div");
    let textColor = getTextClass('bg-'+options.type)
    toastHeaderElement.classList.add("toast-header", `bg-${options.type}`,textColor);
    toastHeaderElement.innerHTML = `${options.icon_custom || getIconHtml(options.icon, 'text-red '+ (options.icon_class || textColor),'1rem') || ""}<strong class="me-auto">${
      options.title || ''
    }</strong> <small class="text-truncate" style="max-width: 50%;">${options.subtitle}</small><button type="button" class="btn-close ${textColor==='text-white'?"btn-close-white":""}" data-bs-dismiss="toast" aria-label="Close"></button>`;
    toastElement.appendChild(toastHeaderElement);
  }

  if (options.background) {
    toastElement.style.background = options.background;
  }
  if (options.textColor) {
    toastElement.style.color = options.textColor;
  }
  if (options.fontsize) {
    toastElement.style.fontSize = options.fontsize;
  }
  
  toastElement.appendChild(toastBodyElement);
  document.body.appendChild(toastElement);

  const toastInstance = new bs5Toast(toastElement, { delay: options.timeout, autohide: options.timeout ? true : false });
  toastInstance.show();
  toastElement.addEventListener("hide.bs.toast", event => {
    toastElement.classList.add("bs5-dialog-msg-hide");
    if (typeof options.onHide === "function") {
      options.onHide(event);
    }
  });
  toastElement.addEventListener("hidden.bs.toast", event => {
    if (typeof options.onHidden === "function") {
      options.onHidden(event);
    }
  });

  toastElement.addEventListener("show.bs.toast", event => {
    if (typeof options.onShow === "function") {
      options.onShow(event);
    }
  });
  toastElement.addEventListener("shown.bs.toast", event => {
    if (typeof options.onShown === "function") {
      options.onShown(event);
    }
  });

}
