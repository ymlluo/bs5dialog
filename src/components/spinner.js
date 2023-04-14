import { getMaxZIndex, getTargetElement, replayLock, triggerEvent, onElementRendered } from "../utils";
import { makeSpinner } from "../resource/loading";

/**
 * Creates a spinner element and appends it to the target element.
 * @param {HTMLElement} element - The target element to append the spinner to.
 * @param {Object} options - The options for the spinner.
 * @param {string} options.animation - The animation for the spinner.
 * @param {string} options.animationClass - The class of animation for the spinner.
 * @param {string} options.animationStyle - The style of animation for the spinner.
 * @param {string} options.text - The text of spinner.
 * @param {string} options.type - The type of spinner.
 * @param {boolean} options.backdrop - Whether or not to include a backdrop.
 * @param {number} options.timeout - The timeout for the spinner.
 * @returns {Object} An object with the target element, spinner element, and hide and clean functions.
 */

export function spinner(element = document.body, options = {}) {
  const defaultOptions = {
    animation: "border",
    animationClass: "text-warning",
    animationStyle: "",
    text: "Please wait...",
    type: "",
    backdrop: true,
    timeout: 0
  };

  options = { ...defaultOptions, ...options };

  let evt = event && event.target?event.target:null;

  const targetElement = getTargetElement(element);
  if (!targetElement) {
    console.error("target element not found");
    return;
  }

  const existingSpinner = targetElement.querySelector(".bs5-modal-spinner");
  if (existingSpinner) {
    existingSpinner.remove();
  }
  if (["fixed", "absolute"].includes(window.getComputedStyle(targetElement).getPropertyValue("position")) && targetElement.firstChild) {
    targetElement = targetElement.firstChild;
  }
  targetElement.style.position = "relative";

  const targetRect = targetElement.getBoundingClientRect();

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


  let animation = makeSpinner(options.animation, options.animationClass, options.animationStyle);
  const animationRect = animation.getBoundingClientRect();

  overlay.appendChild(animation);

  if (options.text) {
    let overlayText = document.createElement("div");
    overlayText.style.position = "relative";
    overlayText.style.textAlign = "center";
    overlayText.style.color = "#333";
    overlayText.style.bottom = "-" + animationRect.height + "px";
    overlayText.innerText = options.text;
    overlay.appendChild(overlayText);
    if (targetRect.height <= 40) {
      animation.remove();
    }
  }

  onElementRendered(overlay).then(() => {
    triggerEvent(targetElement,"bs5:spinner:shown", { options: options, el: targetElement });
    if (options.timeout > 0) {
      timer = setTimeout(() => {
        hidespinner();
      }, options.timeout);
    }
  });
  
  let preCursor = targetElement.style.getPropertyValue("cursor");
  targetElement.appendChild(overlay);
  targetElement.style.cursor = "wait";
  let timer;


  var hidespinner = function () {
    overlay.remove();
    targetElement.style.cursor = preCursor;
    clearTimeout(timer);
    triggerEvent(targetElement,"bs5:spinner:hidden", { options: options, el: targetElement });
    triggerEvent(evt,"bs5:spinner:hidden", { options: options, el: targetElement });

  };
  return {
    el: targetElement,
    hide() {
      hidespinner();
    },
    clean: () => {
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
