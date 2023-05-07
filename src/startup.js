import { load } from "./components/load";
import { offcanvas } from "./components/offcanvas";
import { alert } from "./components/alert";
import { confirm } from "./components/confirm";
import { message, showSuccessMessage, showFailMessage } from "./components/message";
import { toast } from "./components/toast";
import { setSystemLang } from "./i18n";
import { makeRequest } from "./utils";
import { loading, showLoading, hideLoading } from "./components/loading";

const components = { alert, confirm, message, toast, load, offcanvas };

/**
 * Shows a dialog box with content passed or fetched
 * @param {HTMLElement} elem - The element that triggered the dialog box
 * @return {Promise} - A promise that resolves when the dialog is closed
 */
async function showDialog(elem) {
  let content = elem.title || elem.dataset.content || "";
  if (elem.dataset.remote === "true" && elem.tagName === "A") {
    const response = await makeRequest(elem.href);
    content = response.content;
  }

  const getDialogOptions = () => {
    return Object.fromEntries(
      [...elem.attributes]
        .filter(attr => attr.name.startsWith("data-bs5-dialog-option-"))
        .map(attr => [attr.name.replace("data-bs5-dialog-option-", ""), attr.value])
    );
  };

  const elemOpts = elem.dataset.bs5DialogOptions ? JSON.parse(elem.dataset.bs5DialogOptions) : {};
  const func = components[elem.dataset.bs5Dialog];
  if (typeof func === "function") {
    func(content.trim(), { ...getDialogOptions(), ...elemOpts });
  }
}

/**
 * Handles a request made by clicking an anchor element or submitting a form
 * @param {HTMLElement} elem - The anchor element or form submit button that triggered the request
 * @param {HTMLElement} wrapper - The parent element that should display the loading indicator
 * @return {void}
 */
export function handleRequest(elem) {
  if (!elem) {
    return;
  }
  let url, method, requestData, contentType;
  let enctype;
  if (elem.tagName === "A") {
    method = elem.dataset.bs5Request || "POST";
    if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      return;
    }
    requestData = Object.fromEntries(
      [...elem.attributes]
        .filter(attr => attr.name.startsWith("data-bs5-request-param-"))
        .map(attr => [attr.name.replace("data-bs5-request-param-", ""), attr.value])
    );
    const headers = {
      Accept: "application/json",
      ...Object.fromEntries(
        [...elem.attributes]
          .filter(attr => attr.name.startsWith("data-bs5-request-header-"))
          .map(attr => [attr.name.replace("data-bs5-request-header-", ""), attr.value])
      )
    };
    contentType = headers["Content-Type"] || "application/json";
    url = elem.href;
  } else if (elem.tagName === "BUTTON" && elem.type === "submit") {
    const form = elem.closest("form");
    if (!form) {
      return;
    }
    method = form.method || "POST";
    if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      return;
    }
    requestData = new FormData(form);
    enctype = form.enctype;
    const headers = {
      Accept: "application/json",
      ...Object.fromEntries(
        [...form.attributes]
          .filter(attr => attr.name.startsWith("data-bs5-request-header-"))
          .map(attr => [attr.name.replace("data-bs5-request-header-", ""), attr.value])
      )
    };
    contentType = enctype || headers["Content-Type"] || "application/x-www-form-urlencoded";
    url = form.action;
    // Check if form contains files
    let hasFile = false;
    for (let i = 0; i < form.elements.length; i++) {
      if (form.elements[i].type === "file") {
        enctype = "multipart/form-data";
        contentType = enctype;
        hasFile = true;
        break;
      }
    }
    if (hasFile) {
      form.enctype = enctype;
    }
  } else {
    return;
  }
  const showLoadingFn = typeof showLoading === "function" ? showLoading : loading;
  const wrapper = elem.dataset.bs5LoadingWrapper;
  if (elem.dataset.bs5Loading !== "false") {
    showLoadingFn(wrapper || elem.closest(".row") || document.body);
  }
  makeRequest(url, method, { "Content-Type": contentType, ...headers }, requestData) //pass in the content type header
    .then(data => {
      hideLoading(wrapper || elem.closest(".row") || document.body);
      const { content, isSuccess } = data;
      const { message } = content;
      if (isSuccess) {
        showSuccessMessage(message);
        if (elem.dataset.pageReload) {
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
        if (elem.dataset.redirect) {
          setTimeout(() => {
            window.location.href = elem.dataset.redirect;
          }, 500);
        }
        if (elem.dataset.removeParent) {
          elem.closest(elem.dataset.removeParent).remove();
        }
      } else {
        showFailMessage(message);
      }
    })
    .catch(error => {
      hideLoading(wrapper || elem.closest(".row"));
      console.error(error);
      showFailMessage("Failed to make request.");
      return Promise.reject(error);
    });
}

/**
 * Adds click listeners to all elements with the data-bs5-dialog attribute
 * @return {void}
 */
export function addDialogClickListeners() {
  document.addEventListener("click", e => {
    const elem = e.target.closest("[data-bs5-dialog]");
    if (elem) {
      e.preventDefault();
      showDialog(elem);
    }
    const reqElem = e.target.closest("[data-bs5-request]");
    if(reqElem){
      if (reqElem.dataset.bs5RequestConfirm) {
        const confirmMessage = reqElem.dataset.bs5RequestConfirm || "";
        confirm(confirmMessage, {
          onConfirm: function () {
            handleRequest(reqElem);
          }
        });
      } else {
        handleRequest(reqElem);
      }
    }

  });
}

/**
 * Initializes the dialog system by setting the system language and adding click listeners to all elements with the data-bs5-dialog attribute
 * @return {void}
 */
export function startup() {
  setSystemLang();
  addDialogClickListeners();
}

export default startup;
