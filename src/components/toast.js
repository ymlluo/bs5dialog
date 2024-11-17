import { getMaxZIndex, getTextClass, triggerEvent, observeElement, debounce } from "../utils";
import { makeIcon } from "../resource/icons";
import { initializeBootstrapComponents } from "../utils/bootstrapInit";

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
export function toast(message, options = {}) {
  const defaultOptions = {
    title: "Notice",
    subtitle: "",
    position: "center",
    type: "success",
    closeBtn: false,
    icon: "",
    iconClass: "",
    iconStyle: "",
    timeout: 3000,
    onShow: () => { },
    onShown: () => { },
    onHide: () => { },
    onHidden: () => { }
  };

  options = { ...defaultOptions, ...options };

  const toastElement = document.createElement("div");

  const hideToast = () => {
    options.onHide?.();
    toastElement.classList.add("bs5-dialog-msg-hide");
    debounce(() => {
      toastElement.style.display = "none";
      debounce(() => {
        toastElement.remove();
      }, 500);
    }, 300);
  };

  observeElement(toastElement, {
    created: () => {
      options.onShow?.();
      triggerEvent(toastElement, "bs5:dialog:toast:created", { options, el: toastElement });
    },
    rendered: () => {
      options.onShown?.();
      triggerEvent(toastElement, "bs5:dialog:toast:rendered", { options, el: toastElement });
      initializeBootstrapComponents(toastElement);
    },
    hidden: () => {
      options.onHidden?.();
      triggerEvent(toastElement, "bs5:dialog:toast:hidden", { options, el: toastElement });
    },
    remove: () => {
      triggerEvent(toastElement, "bs5:dialog:toast:remove", { options, el: toastElement });
    }
  });

  toastElement.classList.add("toast", "show", "bs5-dialog-msg", `bs5-dialog-msg-${options.position}`);
  toastElement.setAttribute("role", "alert");
  toastElement.style.zIndex = getMaxZIndex() + 1;

  const toastBodyElement = document.createElement("div");
  toastBodyElement.classList.add("toast-body", "bg-white");
  toastBodyElement.innerHTML = message;

  if (options.title) {
    const toastHeaderElement = document.createElement("div");
    const textColor = getTextClass(`bg-${options.type}`);
    toastHeaderElement.classList.add("toast-header", `bg-${options.type}`, textColor);

    const closeButtonClass = textColor === "text-white" ? "btn-close-white" : "";
    toastHeaderElement.innerHTML = `
      <strong class="me-auto">${options.title}</strong>
      <small class="text-truncate" style="max-width: 50%;">${options.subtitle}</small>
      <button type="button" class="btn-x btn-close ${closeButtonClass}" data-bs-dismiss="toast" aria-label="Close"></button>
    `;

    if (options.icon) {
      const iconElement = makeIcon(options.icon, options.iconClass, options.iconStyle);
      iconElement.classList.add(textColor);
      toastHeaderElement.prepend(iconElement);
      toastHeaderElement.classList.add("ps-1");
    }

    toastElement.appendChild(toastHeaderElement);
  }

  toastElement.appendChild(toastBodyElement);
  document.body.appendChild(toastElement);

  if (options.timeout) {
    debounce(hideToast, options.timeout);
  }

  toastElement.hide = hideToast;

  const btnX = toastElement.querySelector(".btn-x");
  if (btnX) {
    btnX.addEventListener("click", hideToast);
  }

  return {
    el: toastElement,
    message,
    options
  };
}
