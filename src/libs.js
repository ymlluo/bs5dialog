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
  } else if (element.startsWith("#")) {
    return document.getElementById(element.slice(1));
  } else if (element.startsWith(".")) {
    return document.querySelector(element);
  } else {
    console.error("Invalid element provided.");
    return null;
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

export default {
  getTargetElement,
  isUrlOrPath,
  makeDraggable,
  makeResizable,
  getUrl,
  postUrl
};
