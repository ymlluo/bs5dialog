import { getOverlapDimensions, genDialogId, triggerEvent, observeElement } from "../utils.js";
import { initializeBootstrapComponents, checkBootstrapAvailability } from "../utils/bootstrapInit.js";

/**
 * Creates an offcanvas element with the given content and options.
 * @param {string} content - The content to be displayed in the offcanvas.
 * @param {Object} options - The options for the offcanvas.
 * @param {string} options.title - The title of the offcanvas.
 * @param {string} options.direction - The direction of the offcanvas.
 * @param {string} options.size - The size of the offcanvas.
 * @param {string} options.id - The id of the offcanvas.
 * @param {boolean} options.backdrop - Whether or not to show a backdrop.
 * @param {boolean} options.scroll - Whether or not to allow scrolling.
 * @param {boolean} options.dark - Whether or not to use dark mode.
 * @param {boolean} options.accordion - Whether or not to use accordion mode.
 * @param {string} options.container - The container for the offcanvas.
 * @param {Function} options.onStart - The function to be called when the offcanvas starts.
 * @param {Function} options.onShown - The function to be called when the offcanvas is shown.
 * @param {Function} options.onHidden - The function to be called when the offcanvas is hidden.
 */
export function offcanvas(content, options = {}) {
  if (!checkBootstrapAvailability()) {
    return { el: null, content, options };
  }

  const defaultOptions = {
    title: "",
    direction: "start",
    size: "",
    id: "",
    backdrop: true,
    scroll: true,
    dark: false,
    accordion: true,
    container: "",
    onShown: () => { },
    onHidden: () => { }
  };
  options = { ...defaultOptions, ...options };

  const container = document.querySelector(options.container || "body");
  const accordionDirection = getAccordionDirection(options.direction);
  let prevContainerPadding;

  const offcanvasElement = options.id && document.getElementById(options.id)
    ? document.getElementById(options.id)
    : createOffcanvasElement(options);

  setupOffcanvasObserver(offcanvasElement, options, container, accordionDirection, prevContainerPadding);
  setupOffcanvasAttributes(offcanvasElement, options);
  setupOffcanvasContent(offcanvasElement, content, options);

  document.body.appendChild(offcanvasElement);
  const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
  offcanvasInstance.toggle();

  return {
    el: offcanvasElement,
    content,
    options
  };
}

function getAccordionDirection(direction) {
  return direction === "start" ? "left"
    : direction === "end" ? "right"
      : direction;
}

function createOffcanvasElement(options) {
  const element = document.createElement("div");
  element.setAttribute("id", options.id || genDialogId());
  return element;
}

function setupOffcanvasObserver(element, options, container, accordionDirection, prevContainerPadding) {
  observeElement(element, {
    created: () => {
      triggerEvent(element, "bs5:dialog:offcanvas:created", { options, el: element });
    },
    rendered: () => {
      prevContainerPadding = document.body.style.getPropertyValue(`padding-${accordionDirection}`);
      if (options.accordion) {
        const overlapDimensions = getOverlapDimensions(element, container);
        const paddingSize = ["left", "right"].includes(accordionDirection)
          ? `${overlapDimensions.overlapWidth}px`
          : `${overlapDimensions.overlapHeight}px`;
        container.style.setProperty(`padding-${accordionDirection}`, paddingSize);
      }
      triggerEvent(element, "bs5:dialog:offcanvas:rendered", { options, el: element });
      initializeBootstrapComponents(element);
      options.onShown?.(element);
    },
    hidden: () => {
      if (options.accordion) {
        container.style.setProperty(`padding-${accordionDirection}`, prevContainerPadding);
      }
      triggerEvent(element, "bs5:dialog:offcanvas:hidden", { options, el: element });
      options.onHidden?.(element);
    },
    remove: () => {
      triggerEvent(element, "bs5:dialog:offcanvas:remove", { options, el: element });
    }
  });
}

function setupOffcanvasAttributes(element, options) {
  element.classList.add("offcanvas", "bs5dialog-offcanvas", `offcanvas-${options.direction}`);
  element.setAttribute("tabindex", "-1");
  element.setAttribute("role", "dialog");

  if (options.scroll === true || options.scroll === "true") {
    element.setAttribute("data-bs-scroll", "true");
  }
  element.setAttribute("data-bs-backdrop", options.backdrop);

  if (options.direction === "start" || options.direction === "end") {
    element.style.width = options.size;
  } else if (options.direction === "top" || options.direction === "bottom") {
    element.style.height = options.size;
  }
}

function setupOffcanvasContent(element, content, options) {
  element.innerHTML = `
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">${options.title || ""}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#${options.id}" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      ${content}
    </div>`;

  if (options.dark === true || options.dark === "true") {
    element.classList.add("text-bg-dark");
    element.querySelector(".btn-close").classList.add("btn-close-white");
  }
}
