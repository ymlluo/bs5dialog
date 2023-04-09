import axios from "axios";

export function isUrlOrPath(text) {
  // 匹配以http、https、ftp、ftps、file、data、mailto、tel、sms、urn开头的字符串，或者以/或./开头的字符串
  var regex = /^(http|https|ftp|ftps|file|data|mailto|tel|sms|urn):\/\/[\S]+|^\/[\S]+|^\.\/[\S]+/;
  return regex.test(text);
}

/**
 *
 * @param {*} element
 * @returns
 */
export function getTargetElement(element) {
  if (element instanceof Element) {
    return element;
  }else {
    return document.querySelector(element);
  }
}

export function makeResizable(el) {
  var element = getTargetElement(el);
  element.style.position = "absolute";
  element.style.resize = "both";
  element.style.overflow = "auto";
}

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

export async function getUrl(url) {
  try {
    if (typeof axios === "function") {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error; // re-throw error to propagate it to the caller
      }
    }
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "url", false); // false表示使用同步请求
    xhr.send();
    if (xhr.status === 200) {
      return xhr.responseText;
    } else {
      console.error("请求失败：" + xhr.status);
    }
  } catch (error) {
    console.error(error);
    return "";
  }
}

export async function postUrl(url, data) {
  try {
    if (typeof axios === "function") {
      const response = await axios.post(url, data);
      return response.data;
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 201) {
        return xhr.responseText;
      } else {
        console.error("请求失败：" + xhr.status);
      }
    };
    xhr.send(data);
    if (xhr.status === 200) {
      return xhr.responseText;
    } else {
      console.error("请求失败：" + xhr.status);
    }
  } catch (error) {
    console.error(error);
    return error;
  }
}

export function genDialogId() {
  const modalId = "dialg-" + Math.floor(Math.random() * 1000000);
  return modalId;
}

export function setModalWrapper() {
  let modal = document.createElement("div");
  modal.classList.add("modal", "bs5dialog-modal", "fade");
  modal.setAttribute("data-bs-backdrop", "static");
  modal.setAttribute("tabindex", "-1");

  return modal;
}

/**
 * add disabled class ，default lock 1s timeout
 * @param {*} element
 * @param {*} timeout
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

export async function makeRequest(url, method = 'GET', headers = {}, body = null) {
  const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfTokenMeta) {
    headers['X-CSRF-TOKEN'] = csrfTokenMeta.content;
  }

  if (typeof axios !== 'undefined') {
    axios.defaults.crossDomain=true
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    // Use axios if it's available
    try {
      const axiosConfig = {
        url,
        method,
        headers,
        withCredentials: false, // Allow cookies to be sent and received for cross-domain requests
      };

      if (body) {
        if (body instanceof FormData) {
          // If body is a FormData object, do not set Content-Type header and pass the FormData directly to axios
          axiosConfig.data = body;
        } else {
          // If body is not a FormData object, assume it's JSON data
          axiosConfig.data = JSON.stringify(body);
          axiosConfig.headers['Content-Type'] = 'application/json';
        }
      }

      const response = await axios(axiosConfig);
      return {
        isSuccess: true,
        statusCode: response.status,
        content: response.data,
      };
    } catch (error) {
      
      return {
        isSuccess: false,
        statusCode: error.response?.status,
        content: error.response?.data || error.message,
      };
    }
  } else {
    // Use fetch if axios is not available
    const options = {
      method,
      headers: {
        ...headers,
        'Accept': 'application/json',
      },
      credentials: 'include', // Allow cookies to be sent and received for cross-domain requests
    };

    if (body) {
      if (body instanceof FormData) {
        // If body is a FormData object, do not set Content-Type header and pass the FormData directly to fetch
        options.body = body;
      } else {
        // If body is not a FormData object, assume it's JSON data
        options.body = JSON.stringify(body);
        options.headers['Content-Type'] = 'application/json';
      }
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return {
        isSuccess: response.ok,
        statusCode: response.status,
        content: data,
      };
    } catch (error) {
      return {
        isSuccess: false,
        statusCode: error.status,
        content: error.message,
      };
    }
  }
}



export default {
  getTargetElement,
  isUrlOrPath,
  makeDraggable,
  makeResizable,
  makeRequest,
  getUrl,
  postUrl,
  getOverlapDimensions,
  genDialogId,
  setModalWrapper,
  replayLock,
  getMaxZIndex,
  getTextClass
};
