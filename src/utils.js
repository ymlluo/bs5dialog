import axios from "axios";

/**
 * Determines whether the given text is a URL or a path.
 * @param {string} text - The text to check.
 * @returns {boolean} - True if the text is a URL or a path, false otherwise.
 */
export function isUrlOrPath(text) {
  const regex = /^(http|https|ftp|ftps|file|data|mailto|tel|sms|urn):\/\/[\S]+|^\/[\S]+|^\.\/[\S]+/;
  return regex.test(text);
}

/**
 * Returns the target element.
 * @param {Element|string} element - The element or selector string.
 * @returns {Element} - The target element.
 */
export function getTargetElement(element) {
  if (element instanceof Element) {
    return element;
  } else {
    return document.querySelector(element);
  }
}

/**
 * Makes the given element resizable.
 * @param {HTMLElement} el - The element to make resizable.
 */
export function makeResizable(el) {
  const element = getTargetElement(el);
  if (element) {
    element.style.position = "absolute";
    element.style.resize = "both";
    element.style.overflow = "auto";
  }
}
/**
 * Makes an element draggable
 * @param {HTMLElement} elmnt - The element to be made draggable
 * @param {HTMLElement} handler - The element to be used as the handler for dragging
 */
export function makeDraggable(elmnt, handler) {
  elmnt = getTargetElement(elmnt);
  handler = getTargetElement(handler);
  handler.style.cursor = "move";
  // Make an element draggable (or if it has a .window-top class, drag based on the .window-top element)
  let currentPosX = 0,
    currentPosY = 0,
    previousPosX = 0,
    previousPosY = 0,
    prevLeft = 0,
    prevTop = 0;

  // If there is a window-top classed element, attach to that element instead of full window
  if (handler) {
    // If present, the window-top element is where you move the parent element from
    handler.onmousedown = dragMouseDown;
  } else {
    // Otherwise, move the element itself
    elmnt.onmousedown = dragMouseDown;
  }

  /**
   * Function called when the mouse is pressed down on the draggable element
   * @param {MouseEvent} e - The mouse event
   */
  function dragMouseDown(e) {
    // Prevent any default action on this element (you can remove if you need this element to perform its default action)
    e.preventDefault();
    // Get the mouse cursor position and set the initial previous positions to begin
    previousPosX = e.clientX;
    previousPosY = e.clientY;
    // When the mouse is let go, call the closing event
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves
    document.onmousemove = elementDrag;
  }

  /**
   * Function called when the draggable element is being dragged
   * @param {MouseEvent} e - The mouse event
   */
  function elementDrag(e) {
    // Prevent any default action on this element (you can remove if you need this element to perform its default action)
    e.preventDefault();
    // Calculate the new cursor position by using the previous x and y positions of the mouse
    currentPosX = previousPosX - e.clientX;
    currentPosY = previousPosY - e.clientY;
    // Replace the previous positions with the new x and y positions of the mouse
    previousPosX = e.clientX;
    previousPosY = e.clientY;
    // Set the element's new position
    elmnt.style.top = elmnt.offsetTop - currentPosY + "px";
    elmnt.style.left = elmnt.offsetLeft - currentPosX + "px";
    // console.error(currentPosX, currentPosY, previousPosX, previousPosY);
  }

  /**
   * Function called when the mouse button is released, stopping the dragging of the element
   * @param {MouseEvent} e - The mouse event
   */
  function closeDragElement(e) {
    // Stop moving when mouse button is released and release events
    document.onmouseup = null;
    document.onmousemove = null;
    let handlerInfo = handler.getBoundingClientRect();
    let elmntRect = elmnt.getBoundingClientRect();

    if (handlerInfo.top + handler.offsetHeight < 0 || handlerInfo.top > window.innerHeight) {
      elmnt.style.top = prevTop + "px";
    } else {
      prevTop = elmntRect.top;
    }
    if (handlerInfo.left + handler.offsetWidth + 60 < 0 || handlerInfo.right - handler.offsetWidth > window.innerWidth) {
      elmnt.style.left = prevLeft + "px";
    } else {
      prevLeft = elmntRect.left;
    }
  }
}

/**
 * Calculates the dimensions of the overlap between two divs.
 * @param {HTMLElement} div1 - The first div element.
 * @param {HTMLElement} div2 - The second div element.
 * @returns {Object} An object containing the width and height of the overlap.
 */
export function getOverlapDimensions(div1, div2) {
  const rect1 = div1.getBoundingClientRect();
  const rect2 = div2.getBoundingClientRect();

  const overlapLeft = Math.max(rect1.left, rect2.left);
  const overlapTop = Math.max(rect1.top, rect2.top);
  const overlapRight = Math.min(rect1.right, rect2.right);
  const overlapBottom = Math.min(rect1.bottom, rect2.bottom);

  const overlapWidth = overlapRight - overlapLeft;
  const overlapHeight = overlapBottom - overlapTop;

  return { overlapWidth, overlapHeight };
}

/**
 * Generates a unique dialog ID.
 * @returns {string} The generated dialog ID.
 */
export function genDialogId() {
  const modalId = "dialg-" + Math.floor(Math.random() * 1000000);
  return modalId;
}

/**
 * Creates a modal wrapper element with specific classes and attributes.
 * @returns {HTMLElement} The modal wrapper element.
 */
export function setModalWrapper() {
  let modal = document.createElement("div");
  modal.classList.add("modal", "bs5dialog-modal", "fade");
  modal.setAttribute("data-bs-backdrop", "static");
  modal.setAttribute("tabindex", "-1");

  return modal;
}

/**
 * Locks the replay button for a specified amount of time.
 * @param {HTMLElement} element - The replay button element.
 * @param {number} [timeout=1000] - The amount of time to lock the button in milliseconds.
 * @returns {number} - The timer ID.
 */
export function replayLock(element, timeout = 1000) {
  const targetElement = getTargetElement(element);
  targetElement.classList.add("disabled");
  targetElement.setAttribute("disabled", "disabled");
  var timer = setTimeout(() => {
    targetElement.classList.remove("disabled");
    targetElement.removeAttribute("disabled");
  }, timeout);
  return timer;
}

/**
 * Returns the maximum z-index value of all elements in the document.
 * @returns {number} The maximum z-index value.
 */
export function getMaxZIndex() {
  let maxZIndex = 0;
  document.querySelectorAll("*").forEach(element => {
    const zIndex = parseFloat(getComputedStyle(element).zIndex);
    if (!isNaN(zIndex) && zIndex > maxZIndex) {
      maxZIndex = zIndex;
    }
  });
  return maxZIndex;
}
/**
 * Returns the appropriate text color class based on the perceived brightness of a background color.
 * @param {string} bgColorClassName - The class name of the background color element.
 * @returns {string} - The class name of the appropriate text color.
 */
export function getTextClass(bgColorClassName) {
  if (bgColorClassName === "bg-link") {
    return "text-black";
  }

  let bgColor;
  if (document.querySelector("." + bgColorClassName)) {
    bgColor = getComputedStyle(document.querySelector("." + bgColorClassName)).backgroundColor;
  } else {
    // Create temporary element
    let tempElement = document.createElement("div");
    tempElement.classList.add(bgColorClassName);
    // Add element to body
    document.body.appendChild(tempElement);

    // Get background color of element
    bgColor = getComputedStyle(tempElement).backgroundColor;

    // Remove element from body
    tempElement.remove();
  }

  // Get RGB values of background color
  const colorValues = bgColor.match(/\d+/g);
  const red = colorValues[0];
  const green = colorValues[1];
  const blue = colorValues[2];

  // Calculate perceived brightness of background color
  const perceivedBrightness = Math.sqrt(red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114);

  // Return text color class based on perceived brightness
  return perceivedBrightness > 150 ? "text-black" : "text-white";
}

/**
 * Makes a request to the specified URL using either axios or fetch.
 * @param {string} url - The URL to make the request to.
 * @param {string} [method="GET"] - The HTTP method to use for the request.
 * @param {Object} [headers={}] - The headers to include in the request.
 * @param {FormData|Object|null} [body=null] - The body of the request.
 * @returns {Promise<Object>} - A Promise that resolves to an object containing the success status, status code, and content of the response.
 */
export async function makeRequest(url, method = "GET", headers = {}, body = null) {
  const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfTokenMeta) {
    headers["X-CSRF-TOKEN"] = csrfTokenMeta.content;
  }

  if (typeof axios !== "undefined") {
    axios.defaults.crossDomain = true;
    axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    // Use axios if it's available
    try {
      const axiosConfig = {
        url,
        method,
        headers,
        withCredentials: false // Allow cookies to be sent and received for cross-domain requests
      };

      if (body) {
        if (body instanceof FormData) {
          // If body is a FormData object, do not set Content-Type header and pass the FormData directly to axios
          axiosConfig.data = body;
        } else {
          // If body is not a FormData object, assume it's JSON data
          axiosConfig.data = JSON.stringify(body);
          axiosConfig.headers["Content-Type"] = "application/json";
        }
      }

      const response = await axios(axiosConfig);
      return {
        isSuccess: true,
        statusCode: response.status,
        content: response.data
      };
    } catch (error) {
      return {
        isSuccess: false,
        statusCode: error.response?.status,
        content: error.response?.data || error.message
      };
    }
  } else {
    // Use fetch if axios is not available
    const options = {
      method,
      headers: {
        ...headers,
        Accept: "application/json"
      },
      credentials: "include" // Allow cookies to be sent and received for cross-domain requests
    };

    if (body) {
      if (body instanceof FormData) {
        // If body is a FormData object, do not set Content-Type header and pass the FormData directly to fetch
        options.body = body;
      } else {
        // If body is not a FormData object, assume it's JSON data
        options.body = JSON.stringify(body);
        options.headers["Content-Type"] = "application/json";
      }
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return {
        isSuccess: response.ok,
        statusCode: response.status,
        content: data
      };
    } catch (error) {
      return {
        isSuccess: false,
        statusCode: error.status,
        content: error.message
      };
    }
  }
}

/**
 * Creates a custom event with the given name and detail
 * @param {string} eventName - The name of the event
 * @param {object} detail - The detail object to be attached to the event
 * @returns {CustomEvent|Event} - The created event
 */
export function makeEvent(eventName, detail) {
  const params = {
    bubbles: true,
    cancelable: true,
    detail: detail
  };
  if (typeof window.CustomEvent === "function") {
    return new CustomEvent(eventName, params);
  } else {
    // IE 11 support
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
    const evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
}

/**
 * Triggers a custom event with the given name and detail on the given element
 * @param {HTMLElement} element - The element on which to trigger the event
 * @param {string} eventName - The name of the event to trigger
 * @param {object} detail - The detail object to be attached to the event
 */
export function triggerEvent(element, eventName = "", detail = {}) {
  if (!element || !eventName) {
    return;
  }
  const event = makeEvent(eventName, detail);
  element.dispatchEvent(event);
}


export default {
  getTargetElement,
  isUrlOrPath,
  makeDraggable,
  makeResizable,
  makeRequest,
  getOverlapDimensions,
  genDialogId,
  setModalWrapper,
  replayLock,
  getMaxZIndex,
  getTextClass,
  makeEvent,
  triggerEvent
};
