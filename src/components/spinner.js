import { getTargetElement, replayLock } from "../libs";
import { getSpinnerHtml } from "../templates";

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
    animation: "border",
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
  var targetZIndex = targetElement.style.zIndex;

  const spinnerElement = document.createElement("div");
  spinnerElement.style.position = "absolute";
  spinnerElement.style.top = 0;
  spinnerElement.style.left = 0;
  spinnerElement.style.width = "100%";
  spinnerElement.style.height = "100%";
  spinnerElement.style.display = "flex";
  spinnerElement.style.justifyContent = "center";
  spinnerElement.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
  spinnerElement.style.setProperty("z-index", targetZIndex + 1);
  
  spinnerElement.classList.add("bs5-modal-spinner");
  if (options.backdrop === false || options.backdrop === "false") {
    spinnerElement.style.backgroundColor = "transparent";
    spinnerElement.style.pointerEvents = "none";
  }

  if (options.animation === "border" || options.animation == "grow") {
    spinnerElement.innerHTML = `<div class="spinner-${options.animation} text-${options.type}" role="status"><span class="visually-hidden">Loading...</span></div>`;
  } else {
    spinnerElement.classList.add("text-white");
    spinnerElement.innerHTML = getSpinnerHtml(options.animation);
  }

  let typeColor = getComputedStyle(document.documentElement).getPropertyValue("--bs-" + options.type + "-rgb");
  let skColor = typeColor ? "rgb(" + typeColor + ")" : options.backdrop ? "#fff" : "#333";
  const rootStyles = `:root {--sk-color: ${skColor};--sk-size: ${options.size || "40px"};} `;

  document.head.insertAdjacentHTML("beforeend", `<style>${rootStyles}</style>`);

  let preCursor = targetElement.style.getPropertyValue("cursor");
  targetElement.appendChild(spinnerElement);
  targetElement.style.cursor = "wait";
  let targetLockTimer = replayLock(targetElement, options.timeout);
  let timer;
  if (options.timeout > 0) {
    timer = setTimeout(() => {
      hidespinner();
    }, options.timeout);
  }
  var hidespinner = function () {
    spinnerElement.remove();
    targetElement.style.cursor = preCursor;
    clearTimeout(timer);
    clearTimeout(targetLockTimer);
  };

  return {
    /**
     * The target element to append the spinner to.
     * @type {HTMLElement}
     */
    targetElement: targetElement,
    /**
     * The spinner element.
     * @type {HTMLElement}
     */
    spinnerElement: spinnerElement,
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
  }
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

export const showLoading =spinner
export const hideLoading = spinnerClean


