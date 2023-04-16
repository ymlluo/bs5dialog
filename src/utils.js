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
 * Returns the target element
 * @param {Element|string} element - The element or the selector string
 * @returns {Element|null} - The target element or null
 */
export function getTargetElement(element) {
  if (element instanceof Element) {
    return element;
  }
  return typeof element === "string" ? document.querySelector(element) : null;
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
 * Locks the target element and sets a timeout to unlock it
 * @param {Element|string} element - The element or the selector string
 * @param {number} [timeout=1000] - The timeout in milliseconds
 * @returns {number} - The timeout ID
 */
export function replayLock(element, timeout = 1000) {
  const targetElement = getTargetElement(element);
  targetElement.disabled = true;
  targetElement.classList.add("disabled");
  targetElement.timeoutId = setTimeout(() => {
    cancelReplayLock(targetElement);
  }, timeout);
  return targetElement.timeoutId;
}

/**
 * Cancels the replay lock and unlocks the target element
 * @param {Element|string} element - The element or the selector string
 */
export function cancelReplayLock(element) {
  const targetElement = getTargetElement(element);
  targetElement.disabled = false;
  targetElement.classList.remove("disabled");
  clearTimeout(targetElement.timeoutId);
}

/**
 * Returns the maximum z-index value of all elements in the document.
 * @returns {number} The maximum z-index value.
 */
export function getMaxZIndex() {
  const maxZIndex = Math.max(
    ...[...document.querySelectorAll("*")].map(element => parseFloat(getComputedStyle(element).zIndex)).filter(zIndex => !isNaN(zIndex))
  );
  return maxZIndex;
}
/**
 * Returns the appropriate text color class based on the perceived brightness of a background color.
 * @param {string} bgColorClassName - The class name of the background color element.
 * @returns {string} - The class name of the appropriate text color.
 */
export function getTextClass(bgColorClassName) {
  switch (bgColorClassName) {
    case "bg-primary":
    case "bg-secondary":
    case "bg-success":
    case "bg-danger":
    case "bg-warning":
    case "bg-info":
    case "bg-dark":
      return "text-white";
    case "bg-light":
    case "bg-link":
    default:
      return "text-dark";
  }
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
      const contentType = response.headers["content-type"];
      if (contentType && contentType.indexOf("text/html") !== -1) {
        const data = await response.data;
        return {
          isSuccess: response.status >= 200 && response.status < 300,
          statusCode: response.status,
          content: data
        };
      } else {
        const data = await response.data;
        return {
          isSuccess: response.status >= 200 && response.status < 300,
          statusCode: response.status,
          content: data
        };
      }
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
        "Content-Type": "application/json",
        ...headers
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
      }
    }

    try {
      const response = await fetch(url, options);
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("text/html") !== -1) {
        const data = await response.text();
        return {
          isSuccess: response.ok,
          statusCode: response.status,
          content: data
        };
      } else {
        const data = await response.json();
        return {
          isSuccess: response.ok,
          statusCode: response.status,
          content: data
        };
      }
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
 * Creates and triggers a custom event with the given name and detail on the given element
 * @param {HTMLElement} element - The element on which to trigger the event
 * @param {string} eventName - The name of the event to trigger
 * @param {object} detail - The detail object to be attached to the event
 */
export function triggerEvent(element, eventName = "", detail = {}) {
  if (!eventName || !element) {
    return;
  }
  const newEvent = new CustomEvent(eventName, {
    bubbles: true,
    cancelable: true,
    detail: detail
  });
  if (event && event.target && event.target instanceof Element) {
    event.target.dispatchEvent(newEvent);
  }
  // console.log(eventName, element, detail);
  element.dispatchEvent(newEvent);
}

/**
 * Debounces a function call
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Throttles a function call
 * @param {Function} func - The function to throttle
 * @param {number} limit - The limit in milliseconds
 * @returns {Function} - The throttled function
 */
export function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return (...args) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Observes changes to a target element and triggers callbacks accordingly.
 * @param {HTMLElement} targetElement - The element to observe.
 * @param {object} options - The options object.
 * @param {Function} options.created - Callback to be executed when a new child node is added.
 * @param {Function} options.remove - Callback to be executed when a child node is removed.
 * @param {Function} options.rendered - Callback to be executed when the target element is first rendered.
 * @param {Function} options.hidden - Callback to be executed when the target element is hidden.
 * @param {Function} options.dragged - Callback to be executed when the target element is dragged.
 * @param {Function} options.resize - Callback to be executed when the target element is resized.
 * @returns {Promise} - A Promise that resolves when the observer is disconnected.
 */
export function observeElement(targetElement, options) {
  let resizeObserver;
  let hasRendered = false;
  let hasHidden = false;
  const position = { x: targetElement.offsetLeft, y: targetElement.offsetTop };
  let size = { width: 0, height: 0 };
  let targetElementStyle;
  let resizeElement;
  options.created?.(targetElement);
  let waitForInsertionTimeId;
  const waitForInsertion = () => {
    if (!targetElement.parentNode) {
      waitForInsertionTimeId = setTimeout(waitForInsertion, 100);
    } else {
      if (waitForInsertionTimeId) {
        clearTimeout(waitForInsertionTimeId);
      }
      options.rendered?.();
      hasRendered = true;
      resizeElement = targetElement.querySelector("div[style*='resize: both']");
      if (resizeElement) {
        size.width = resizeElement.offsetWidth;
        size.height = resizeElement.offsetHeight;
      }

      observer.observe(targetElement.parentNode, {
        childList: true,
        attributes: true,
        attributeFilter: ["style", "class"],
        subtree: true
      });
      positionObserver.observe(targetElement, {
        attributes: true,
        attributeFilter: ["style"],
        subtree: true
      });
    }
  };

  const observer = new MutationObserver(
    debounce(mutationsList => {
      for (const mutation of mutationsList) {
        const { type, target } = mutation;
        switch (type) {
          case "attributes":
            if (target !== targetElement) continue;
            targetElementStyle = window.getComputedStyle(target);
            if (hasRendered) {
              // Find the child element with 'resize' style
              if (resizeElement) {
                resizeObserver = new ResizeObserver(
                  throttle(() => {
                    if (resizeElement.offsetWidth != size.width || resizeElement.offsetHeight != size.height) {
                      size.width = resizeElement.offsetWidth;
                      size.height = resizeElement.offsetHeight;
                      options.resize?.();
                    }
                  }, 200)
                );
                resizeObserver.observe(resizeElement);
              }
              if (
                (hasHidden == false && targetElementStyle.display === "none") ||
                targetElementStyle.opacity === 0 ||
                targetElementStyle.visibility === "hidden"
              ) {
                hasHidden = true;
                hasRendered = false;
                options.hidden?.();
              } else {
                hasHidden = false;
                if (!hasRendered) {
                  options.rendered?.();
                }
              }
            }
            break;
          case "childList":
            mutation.removedNodes.forEach(function (removedNode) {
              if (removedNode === targetElement) {
                options.remove?.();
                observer.disconnect();
              }
            });
            break;
          default:
            break;
        }
      }
    }, 0)
  );

  const positionObserver = new MutationObserver(
    throttle(() => {
      const newPos = {
        x: targetElement.offsetLeft,
        y: targetElement.offsetTop
      };
      if (newPos.x !== position.x || newPos.y !== position.y) {
        options.dragged?.(newPos);
        position.x = newPos.x;
        position.y = newPos.y;
      }
    }, 200)
  );

  waitForInsertion();

  return Promise.resolve().finally(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });
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
  cancelReplayLock,
  getMaxZIndex,
  getTextClass,
  triggerEvent,
  debounce,
  throttle,
  observeElement
};
