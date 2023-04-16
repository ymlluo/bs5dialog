import { getMaxZIndex, getTextClass, triggerEvent, observeElement, debounce } from "../utils";
import { makeIcon } from "../resource/icons";

/**
 * Displays a toast message with customizable options.
 * @param {string} message - The message to display in the toast.
 * @param {Object} options - An object containing customizable options for the toast.
 * @param {string} options.title - The title of the toast.
 * @param {string} options.subtitle - The subtitle of the toast.
 * @param {string} options.position - The position of the toast on the screen.
 * @param {string} options.type - The type of toast (success, warning, error, etc.).
 * @param {boolean} options.closeBtn - Whether or not to display a close button on the toast.
 * @param {string} options.textColor - The text color of the toast.
 * @param {string} options.icon - The icon to display on the toast.
 * @param {string} options.iconClass - The class to apply to the icon on the toast.
 * @param {string} options.iconStyle - The style to apply to the icon on the toast.
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
    closeBtn: false,
    icon: "bs5-point",
    iconClass: "",
    iconStyle: "",
    timeout: 3000,
    onShow: function () {},
    onShown: function () {},
    onHidden: function () {}
  };

  options = { ...defaultOptions, ...options };

  const toastElement = document.createElement("div");

  observeElement(toastElement, {
    created: () => {
      options.onShow?.();
      triggerEvent(toastElement, "bs5:dialog:toast:created", { options: options, el: toastElement });
    },
    rendered: () => {
      options.onShown?.();
      triggerEvent(toastElement, "bs5:dialog:toast:rendered", { options: options, el: toastElement });
    },
    hidden: () => {
      options.onHidden?.();
      triggerEvent(toastElement, "bs5:dialog:toast:hidden", { options: options, el: toastElement });
    },
    remove: () => {
      triggerEvent(toastElement, "bs5:dialog:toast:remove", { options: options, el: toastElement });
    }
  });

  toastElement.classList.add("toast", "show", "bs5-dialog-msg", "bs5-dialog-msg-" + options.position);
  toastElement.setAttribute("role", "alert");
  toastElement.style.zIndex = getMaxZIndex() + 1;
  // Create toast body element
  const toastBodyElement = document.createElement("div");
  toastBodyElement.classList.add("toast-body", "bg-white");
  toastBodyElement.innerHTML = message;

  // Add header and body to toast element
  // Create toast header element
  if (options.title) {
    const toastHeaderElement = document.createElement("div");
    let textColor = getTextClass("bg-" + options.type);
    toastHeaderElement.classList.add("toast-header", `bg-${options.type}`, textColor);
    toastHeaderElement.innerHTML = `<strong class="me-auto">${
      options.title || ""
    }</strong> <small class="text-truncate" style="max-width: 50%;">${
      options.subtitle
    }</small><button type="button" class="btn-x btn-close ${
      textColor === "text-white" ? "btn-close-white" : ""
    }" data-bs-dismiss="toast" aria-label="Close"></button>`;
    toastElement.appendChild(toastHeaderElement);

    if (options.icon) {
      const iconElement = makeIcon(options.icon, options.iconClass, options.iconStyle);
      iconElement.classList.add(textColor);
      toastHeaderElement.prepend(iconElement);
      toastHeaderElement.classList.add("ps-1");
    }
  }

  toastElement.appendChild(toastBodyElement);
  document.body.appendChild(toastElement);

  // const toastInstance = new bs5Toast(toastElement, { delay: options.timeout, autohide: options.timeout ? true : false });
  // toastInstance.show();

  if (options.timeout) {
    debounce(() => {
      hideToast();
    }, options.timeout);
  }

  const hideToast = function () {
    console.log("hidden");
    toastElement.classList.add("bs5-dialog-msg-hide");
    debounce(() => {
      toastElement.style.display = "none";
      debounce(() => {
        toastElement.remove();
      }, 500);
    }, 300);
  };

  toastElement.hide = function () {
    hideToast();
  };
  if (event && event.target) {
    event.target.hide = function () {
      hideToast();
    };
  }

  const btnX = toastElement.querySelector(".btn-x");
  if (btnX) {
    btnX.addEventListener("click", () => {
      hideToast();
    });
  }

  return {
    el: toastElement,
    message,
    options
  };
}
