import { getMaxZIndex, getTargetElement, observeElement, triggerEvent } from "../utils";
import { makeSpinner } from "../resource/loading";

/**
 * Creates a loading element and appends it to the target element.
 * @param {HTMLElement} element - The target element to append the loading to.
 * @param {Object} options - The options for the loading.
 * @param {string} options.animation - The animation for the loading.
 * @param {string} options.animationClass - The class of animation for the loading.
 * @param {string} options.animationStyle - The style of animation for the loading.
 * @param {string} options.text - The text of loading.
 * @param {string} options.type - The type of loading.
 * @param {boolean} options.backdrop - Whether or not to include a backdrop.
 * @param {number} options.timeout - The timeout for the loading.
 * @returns {Object} An object with the target element, loading element, and hide and clean functions.
 */

export function loading(element = document.body, options = {}) {
  const defaultOptions = {
    animation: "border",
    animationClass: "",
    animationStyle: "",
    text: "Please wait...",
    type: "warning",
    backdrop: true,
    timeout: 0
  };

  options = { ...defaultOptions, ...options };

  let evt = event && event.target ? event.target : null;

  let targetElement = getTargetElement(element);
  if (!targetElement) {
    console.error("target element not found");
    return;
  }

  const existingSpinner = targetElement.querySelector(".bs5-dialog-loading");
  if (existingSpinner) {
    existingSpinner.remove();
  }
  if (["fixed", "absolute"].includes(window.getComputedStyle(targetElement).getPropertyValue("position")) && targetElement.firstChild) {
    targetElement = targetElement.firstChild;
  }
  targetElement.style.position = "relative";

  let targetRect = targetElement.getBoundingClientRect();

  let overlay = document.createElement("div");
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
  overlay.classList.add("bs5-dailog-loading");

  observeElement(overlay, {
    created: () => {
      triggerEvent(overlay, "bs5:dialog:loading:created", { options: options, el: overlay });
    },
    rendered: () => {
      triggerEvent(overlay, "bs5:dialog:loading:rendered", { options: options, el: overlay });
    },
    hidden: () => {
      triggerEvent(overlay, "bs5:dialog:loading:hidden", { options: options, el: overlay });
    },
    remove: () => {
      triggerEvent(overlay, "bs5:dialog:loading:remove", { options: options, el: overlay });
    }
  });

  if (options.backdrop === false || options.backdrop === "false") {
    overlay.style.backgroundColor = "transparent";
    overlay.style.pointerEvents = "none";
  }

  if (options.type) {
    if (!options.type.startsWith("text-")) {
      options.type = "text-" + options.type;
    }
    options.animationClass = options.animationClass + " " + options.type;
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
  let timer;
  let preCursor = targetElement.style.getPropertyValue("cursor");
  targetElement.appendChild(overlay);
  targetElement.style.cursor = "wait";

  var hideloading = function () {
    overlay.remove();
    targetElement.style.cursor = preCursor;
    clearTimeout(timer);
  };

  if (options.timeout > 0) {
    timer = setTimeout(() => {
      hideloading();
    }, options.timeout);
  }

  targetElement.hide = function () {
    hideloading();
  };

  return {
    el: targetElement,
    options: options
  };
}

/**
 * Removes all loading elements from the document.
 */
export function loadingClean() {
  let loadings = document.querySelectorAll(".bs5-dailog-loading");
  if (loadings) {
    loadings.forEach(el => {
      el.parentNode.style.cursor = "auto";
      el.remove();
    });
  }
}

export const showLoading = loading;
export const hideLoading = loadingClean;
