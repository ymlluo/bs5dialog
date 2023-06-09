import { getMaxZIndex, triggerEvent, observeElement, getTextClass } from "../utils";
import { makeIcon } from "../resource/icons";

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
 * @param {string} options.icon - The icon to display with the message (default: "")
 * @param {string} options.iconClass - The class of the icon to display with the message (default: "")
 * @param {string} options.iconStyle - The style of the icon to display with the message (default: "")
 * @param {number} options.timeout - The time in milliseconds before the message disappears (default: 3000)
 * @param {function} options.onClose - The function to call when the message is closed (default: function() {})
 * @param {function} options.onClosed - The function to call after the message is closed (default: function() {})
 */
export function message(message, options = {}) {
  // Set default options
  const defaultOptions = {
    position: "center",
    type: "",
    closeBtn: false,
    background: "",
    textColor: "",
    fontsize: "",
    icon: "",
    iconClass: "",
    iconStyle: "",
    timeout: 3000,
    onClosed: function () {}
  };

  options = { ...defaultOptions, ...options };

  // Create alert element
  let messageElement = document.createElement("div");

  observeElement(messageElement, {
    created: () => {
      triggerEvent(messageElement, "bs5:dialog:message:created", { options: options, el: messageElement });
    },
    rendered: () => {
      triggerEvent(messageElement, "bs5:dialog:message:rendered", { options: options, el: messageElement });
    },
    hidden: () => {
      options.onClosed?.();
      triggerEvent(messageElement, "bs5:dialog:message:hidden", { options: options, el: messageElement });
    },
    remove: () => {
      triggerEvent(messageElement, "bs5:dialog:message:remove", { options: options, el: messageElement });
    }
  });

  messageElement.classList.add("bs5-dialog-msg");
  const positionClass = `bs5-dialog-msg-${options.position}`;
  messageElement.classList.add(positionClass);
  messageElement.style.setProperty("z-index", getMaxZIndex() + 1);
  messageElement.setAttribute("role", "alert");

  let messageBodyElement = document.createElement("div");
  options.type = options.type ? options.type : "dark";
  let textColor = getTextClass("bg-" + options.type);
  messageBodyElement.classList.add(`bg-${options.type}`, "text-start", textColor, "rounded-1", "py-0", "ps-3", "pe-2", "fw-normal");
  messageBodyElement.style.setProperty("height", "3rem");
  messageBodyElement.style.setProperty("line-height", "3rem");
  messageBodyElement.style.setProperty("padding", "0.375rem 1px");
  messageBodyElement.innerHTML = `<span class="bs5-dialog-msg-content">${message}</span>`;

  if (options.background) {
    messageBodyElement.style.background = options.background;
  }
  if (options.textColor) {
    messageBodyElement.style.color = options.textColor;
  }
  if (options.fontsize) {
    messageBodyElement.style.fontSize = options.fontsize;
  }

  if (options.icon) {
    const iconElment = makeIcon(options.icon, options.iconClass, options.iconStyle);
    iconElment.style.setProperty("margin-inline-end", "8px");
    iconElment.style.setProperty("margin-bottom", "4px");
    messageBodyElement.prepend(iconElment);
  }
  if (options.closeBtn) {
    const closeBtn = makeIcon(
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="margin-bottom:4px;cursor:pointer"  onMouseOver="this.style.color='#e0e0e0;'" onMouseOut="this.style.color='#eaeaea'"  class="btn-x"  stroke-width="1"  viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M18 6l-12 12"></path>
    <path d="M6 6l12 12"></path>
 </svg>`,
      "btn-x",
      ""
    );
    closeBtn.role = "button";
    closeBtn.style.setProperty("margin-inline-start", "8px");
    closeBtn.setAttribute("aria-label", "Close");
    messageBodyElement.appendChild(closeBtn);
  }

  messageElement.appendChild(messageBodyElement);

  document.body.appendChild(messageElement);
  // Add alert element to body

  if (options.timeout) {
    setTimeout(() => {
      hideMessage();
    }, options.timeout);
  }

  function hideMessage() {
    messageElement.classList.add("bs5-dialog-msg-hide");
    setTimeout(() => {
      messageElement.style.display = "none";
      setTimeout(() => {
        messageElement.remove();
      }, 500);
    }, 300);
  }

  const btnX = messageElement.querySelector(".btn-x");
  if (btnX) {
    btnX.addEventListener("click", () => {
      hideMessage();
    });
  }

  messageElement.hide = function () {
    hideMessage();
  };

  if (event && event.target) {
    event.target.hide = function () {
      hideMessage();
    };
  }

  return {
    el: messageElement,
    message,
    options,
    hide: () => {
      hideMessage();
    }
  };
}

export const msg = message;
