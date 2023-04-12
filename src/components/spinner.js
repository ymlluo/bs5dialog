import { getMaxZIndex, getTargetElement, replayLock, triggerEvent } from "../utils";
import { makeSpinner } from "../resource/loading";

/**
 * Creates a spinner element and appends it to the target element.
 * @param {HTMLElement} element - The target element to append the spinner to.
 * @param {Object} options - The options for the spinner.
 * @param {string} options.animation - The type of animation for the spinner.
 * @param {string} options.type - The type of spinner.
 * @param {boolean} options.backdrop - Whether or not to include a backdrop.
 * @param {number} options.timeout - The timeout for the spinner.
 * @returns {Object} An object with the target element, spinner element, and hide and clean functions.
 */

export function spinner(element = document.body, options = {}) {
  const defaultOptions = {
    loader: "",
    loaderClass: "text-warning",
    loaderStyle: "",
    text: "Please wait...",
    type: "",
    backdrop: true,
    timeout: 2000
  };

  options = { ...defaultOptions, ...options };

  const targetElement = getTargetElement(element);
  if (!targetElement) {
    console.error("target element not found");
    return;
  }
  // 如果已经存在 spinner 动画，直接返回
  if (targetElement.querySelector(".bs5-modal-spinner")) {
    targetElement.querySelector(".bs5-modal-spinner").remove();
  }
  targetElement.style.position = "relative";
  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.pointerEvents = "auto";
  overlay.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
  overlay.style.setProperty("z-index", getMaxZIndex() + 1);

  if (options.backdrop === false || options.backdrop === "false") {
    overlay.style.backgroundColor = "transparent";
    overlay.style.pointerEvents = "none";
  }

  triggerEvent(targetElement, "bs5:dialog:show", { options: options, el: targetElement });

  let loader = makeSpinner(options.loader, options.loaderClass, options.loaderStyle);
  overlay.appendChild(loader);

  if (options.text) {
    const loaderRect = loader.getBoundingClientRect();
    let overlayText = document.createElement("div");
    overlayText.style.position = "relative";
    overlayText.style.textAlign = "center";
    overlayText.style.color = "#333";
    overlayText.style.bottom = "-" + loaderRect.height + "px";
    overlayText.innerText = options.text;
    overlay.appendChild(overlayText);
  }

  let typeColor = getComputedStyle(document.documentElement).getPropertyValue("--bs-" + options.type + "-rgb");

  let preCursor = targetElement.style.getPropertyValue("cursor");
  targetElement.appendChild(overlay);
  targetElement.style.cursor = "wait";
  let targetLockTimer = replayLock(targetElement, options.timeout);

  triggerEvent(targetElement, "bs5:dialog:shown", { options: options, el: targetElement });

  let timer;
  if (options.timeout > 0) {
    triggerEvent(targetElement, "bs5:dialog:hide", { options: options, el: targetElement });

    timer = setTimeout(() => {
      hidespinner();
    }, options.timeout);
  }
  var hidespinner = function (el = targetElement) {
    overlay.remove();
    targetElement.style.cursor = preCursor;
    clearTimeout(timer);
    clearTimeout(targetLockTimer);
    triggerEvent(targetElement, "bs5:dialog:shown", { options: options, el: targetElement });
  };

  return {
    /**
     * The target element to append the spinner to.
     * @type {HTMLElement}
     */
    el: targetElement,
    /**
     * The spinner element.
     * @type {HTMLElement}
     */
    overlay: overlay,
    /**
     * Hides the spinner.
     */
    hide() {
      hidespinner();
    },
    /**
     * Cleans up all spinner elements.
     */
    clean() {
      spinnerClean();
    }
  };
}

/**
 * Removes all spinner elements from the document.
 */
export function spinnerClean() {
  let spinners = document.querySelectorAll(".bs5-modal-spinner");
  if (spinners) {
    spinners.forEach(el => {
      el.parentNode.style.cursor = "auto";
      el.remove();
    });
  }
}

export const showLoading = spinner;
export const hideLoading = spinnerClean;
