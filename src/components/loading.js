import { getMaxZIndex, getTargetElement, observeElement, triggerEvent } from "../utils.js";
import { makeSpinner } from "../resource/loading.js";
import { initializeBootstrapComponents } from "../utils/bootstrapInit.js";

/**
 * Creates a loading element and appends it to the target element.
 * @param {HTMLElement|string} element - The target element or selector to append the loading to.
 * @param {Object} options - The options for the loading.
 * @param {string} options.animation - The animation for the loading.
 * @param {string} options.animationClass - The class of animation for the loading.
 * @param {string} options.animationStyle - The style of animation for the loading.
 * @param {string} options.text - The text of loading.
 * @param {string} options.type - The type of loading.
 * @param {boolean} options.backdrop - Whether or not to include a backdrop.
 * @param {number} options.timeout - The timeout for the loading in milliseconds.
 * @returns {Object} An object with the target element and options.
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

  const targetElement = getTargetElement(element);
  if (!targetElement) {
    console.error("Target element not found");
    return;
  }

  // Remove any existing spinner
  targetElement.querySelector(".bs5-dialog-loading")?.remove();

  // Handle positioning
  const computedStyle = window.getComputedStyle(targetElement);
  const isPositioned = ["fixed", "absolute"].includes(computedStyle.position);
  const elementToUse = isPositioned && targetElement.firstChild ? targetElement.firstChild : targetElement;
  elementToUse.style.position = "relative";

  const targetRect = elementToUse.getBoundingClientRect();

  // Create overlay
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "auto",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: String(getMaxZIndex() + 1)
  });
  overlay.classList.add("bs5-dialog-loading");

  // Set up observers
  observeElement(overlay, {
    created: () => triggerEvent(overlay, "bs5:dialog:loading:created", { options, el: overlay }),
    rendered: () => {
      triggerEvent(overlay, "bs5:dialog:loading:rendered", { options, el: overlay });
      initializeBootstrapComponents(overlay);
    },
    hidden: () => triggerEvent(overlay, "bs5:dialog:loading:hidden", { options, el: overlay }),
    remove: () => triggerEvent(overlay, "bs5:dialog:loading:remove", { options, el: overlay })
  });

  // Handle backdrop option
  if (options.backdrop === false || options.backdrop === "false") {
    overlay.style.backgroundColor = "transparent";
    overlay.style.pointerEvents = "none";
  }

  // Handle type option
  if (options.type) {
    options.type = options.type.startsWith("text-") ? options.type : `text-${options.type}`;
    options.animationClass = `${options.animationClass} ${options.type}`.trim();
  }

  // Create and add spinner
  const animation = makeSpinner(options.animation, options.animationClass, options.animationStyle);
  const animationRect = animation.getBoundingClientRect();
  overlay.appendChild(animation);

  // Add text if specified
  if (options.text) {
    const overlayText = document.createElement("div");
    Object.assign(overlayText.style, {
      position: "relative",
      textAlign: "center",
      color: "#333",
      bottom: `-${animationRect.height}px`
    });
    overlayText.innerText = options.text;
    overlay.appendChild(overlayText);

    if (targetRect.height <= 40) {
      animation.remove();
    }
  }

  // Store original cursor and update
  const preCursor = elementToUse.style.cursor;
  elementToUse.appendChild(overlay);
  elementToUse.style.cursor = "wait";

  // Create hide function
  const hideLoading = () => {
    overlay.remove();
    elementToUse.style.cursor = preCursor;
    if (timer) clearTimeout(timer);
  };

  // Handle timeout
  let timer;
  if (options.timeout > 0) {
    timer = setTimeout(hideLoading, options.timeout);
  }

  // Add hide method to element
  elementToUse.hide = hideLoading;

  return {
    el: elementToUse,
    options
  };
}

/**
 * Removes all loading elements from the document.
 */
export function loadingClean() {
  document.querySelectorAll(".bs5-dialog-loading").forEach(el => {
    el.parentNode.style.cursor = "auto";
    el.remove();
  });
}

export const showLoading = loading;
export const hideLoading = loadingClean;
