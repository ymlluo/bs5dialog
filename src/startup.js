import { load } from "./components/load";
import { offcanvas } from "./components/offcanvas";
import { alert } from "./components/alert";
import { confirm } from "./components/confirm";
import { message, showSuccessMessage, showFailMessage } from "./components/message";
import { toast } from "./components/toast";
import { setSystemLang } from "./i18n";
import { makeRequest, replayLock } from "./utils";
import { loading, showLoading, hideLoading } from "./components/loading";

const components = { alert, confirm, message, toast, load, offcanvas };

function getDialogOptions(elem) {
  const dialogOptions = {};
  for (let i = 0; i < elem.attributes.length; i++) {
    const attr = elem.attributes[i];
    if (attr.name.startsWith("data-bs5-dialog-option-")) {
      dialogOptions[attr.name.replace("data-bs5-dialog-option-", "")] = attr.value;
    }
  }
  return dialogOptions;
}

/**
 * Shows a dialog box with content passed or fetched
 * @param {HTMLElement} elem - The element that triggered the dialog box
 * @return {Promise} - A promise that resolves when the dialog is closed
 */
async function showDialog(elem) {
  let title = elem.dataset.title || elem.title || "";
  let content = elem.dataset.content || elem.title || "";
  switch (elem.dataset.bs5Dialog) {
    case "toast":
    case "load":
    case "offcanvas":
      if (elem.tagName === "A" && !elem.dataset.content) {
        if (!title) {
          title = elem.innerHTML;
        }
        replayLock(elem);
        if (elem.dataset.bs5Loading !== "false") {
          showLoading();
        }
        const response = await makeRequest(elem.href);
        content = response.content;
        hideLoading();
      }
      break;
    default:
      break;
  }
  const elemOpts = elem.dataset.bs5DialogOptions ? JSON.parse(elem.dataset.bs5DialogOptions) : {};
  const func = components[elem.dataset.bs5Dialog];
  if (typeof func === "function") {
    func(content.trim(), { ...{ title: title }, ...getDialogOptions(elem), ...elemOpts });
  }
}

/**
 * Handles a request made by clicking an anchor element or submitting a form
 * @param {HTMLElement} elem - The anchor element or form submit button that triggered the request
 * @param {HTMLElement} wrapper - The parent element that should display the loading indicator
 * @return {void}
 */
export function handleAnchorRequest(elem) {
  if (elem.tagName !== "A") {
    return;
  }
  const url = elem.href;
  if (!url) return;
  const method = elem.dataset.bs5Request;
  if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())) return;

  let headers = {
    Accept: "application/json",
    ...Object.fromEntries(
      [...elem.attributes]
        .filter(attr => attr.name.startsWith("data-bs5-request-header-"))
        .map(attr => [attr.name.replace("data-bs5-request-header-", ""), attr.value])
    )
  };
  headers["Content-Type"] = headers["Content-Type"] || "application/json";
  const requestData = Object.fromEntries(
    [...elem.attributes]
      .filter(attr => attr.name.startsWith("data-bs5-request-param-"))
      .map(attr => [attr.name.replace("data-bs5-request-param-", ""), attr.value])
  );

  const wrapper = elem.dataset.bs5LoadingWrapper;
  if (elem.dataset.bs5Loading !== "false") {
    showLoading(wrapper || elem.closest(".row") || document.body);
  }
  makeRequest(url, method, headers, requestData) //pass in the content type header
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
        if (elem.dataset.redirect ||  data.content?.data?.redirect ) {
          setTimeout(() => {
            window.location.href = elem.dataset.redirect || data.content?.data?.redirect;
          }, 500);
        }
        if (elem.dataset.removeParent) {
          elem.closest(elem.dataset.removeParent).remove();
        }
      } else {
        showFailMessage(message);
      }
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
    const anchor = e.target.closest("a[data-bs5-request]");
    if (anchor) {
      e.preventDefault();
      if (typeof anchor.dataset.bs5RequestConfirm === "undefined") {
        handleAnchorRequest(anchor);
      } else {
        const confirmMessage = anchor.dataset.bs5RequestConfirm || "";
        confirm(confirmMessage, {
          onConfirm: function () {
            handleAnchorRequest(anchor);
          }
        });
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


