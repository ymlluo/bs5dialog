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

export async function getUrl(url) {
  try {
    if (typeof axios === "function") {
      try {
        const response = await axios.get(url);
        console.log('axios res', response.data);
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
    xhr.open("POST", "https://jsonplaceholder.typicode.com/posts");

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
  getUrl
};
