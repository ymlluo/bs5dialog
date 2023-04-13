import { getOverlapDimensions, genDialogId, triggerEvent } from "../utils.js";
import { Offcanvas as bs5Offcanvas } from "bootstrap";

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
    onStart: function () {},
    onShown: function () {},
    onHidden: function () {}
  };
  options = { ...defaultOptions, ...options };

  options.onStart();

  let offcanvasElement;
  if (options.id && document.getElementById(options.id)) {
    offcanvasElement = document.getElementById(options.id);
  } else {
    offcanvasElement = document.createElement("div");
    options.id = options.id || genDialogId();
    offcanvasElement.setAttribute("id", options.id);
  }
  offcanvasElement.classList.add("offcanvas", "bs5dialog-offcanvas", "offcanvas-" + options.direction);

  offcanvasElement.setAttribute("tabindex", "-1");
  offcanvasElement.setAttribute("role", "dialog");
  if (options.scroll === true || options.scroll === "true") {
    offcanvasElement.setAttribute("data-bs-scroll", "true");
  }

  offcanvasElement.setAttribute("data-bs-backdrop", options.backdrop);
  if (options.direction === "start" || options.direction === "end") {
    offcanvasElement.style.width = options.size;
  }
  if (options.direction === "top" || options.direction === "bottom") {
    offcanvasElement.style.height = options.size;
  }

  offcanvasElement.innerHTML = `
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">${options.title || ""}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#${options.id}" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      ${content}
    </div>`;

  if (options.dark === true || options.dark === "true") {
    offcanvasElement.classList.add("text-bg-dark");
    offcanvasElement.querySelector(".btn-close").classList.add("btn-close-white");
  }

  document.body.appendChild(offcanvasElement);
  const offcanvasInstance = bs5Offcanvas.getOrCreateInstance(offcanvasElement);
  offcanvasInstance.toggle();

  const accordionDirection = options.direction === "start" ? "left" : options.direction === "end" ? "right" : options.direction || "";
  console.log(accordionDirection);
  const container = document.querySelector(options.container || "body");

  let prevContainerPanding = document.body.style.getPropertyValue("padding-" + accordionDirection);

  triggerEvent("bs5:dialog:show", { options: options });

  offcanvasElement.addEventListener("shown.bs.offcanvas", function () {
    triggerEvent("bs5:dialog:shown", { options: options });
    if (options.accordion) {
      let OverlapDimensions = getOverlapDimensions(offcanvasElement, container);
      const paddingSize = ["left", "right"].includes(accordionDirection)
        ? OverlapDimensions.overlapWidth + "px"
        : OverlapDimensions.overlapHeight + "px";
      container.style.setProperty("padding-" + accordionDirection, paddingSize);
    }
    if (typeof options.onShown === "function") {
      options.onShown(offcanvasElement);
    }
  });

  offcanvasElement.addEventListener("hide.bs.offcanvas", function () {
    triggerEvent("bs5:dialog:hide", { options: options });
  });
  offcanvasElement.addEventListener("hidden.bs.offcanvas", function () {
    triggerEvent("bs5:dialog:hidden", { options: options });
    if (options.accordion) {
      container.style.setProperty("padding-" + accordionDirection, prevContainerPanding);
    }
    if (typeof options.onHidden === "function") {
      options.onHidden(offcanvasElement);
    }
  });

  return {
    el: offcanvasElement,
    content: content,
    options: options
  };
}
