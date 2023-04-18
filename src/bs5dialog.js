import "./bs5dialog.css";
import * as utils from "./utils";
import * as i18n from "./i18n.js";
import { load } from "./components/load";
import { offcanvas } from "./components/offcanvas";
import { alert } from "./components/alert";
import { confirm } from "./components/confirm";
import { prompt } from "./components/prompt";
import { message, msg } from "./components/message";
import { toast } from "./components/toast";
import { loading, showLoading, loadingClean, hideLoading } from "./components/loading";

export { alert, confirm, prompt, message, msg, toast, loading, showLoading, loadingClean, hideLoading, load, offcanvas, utils, i18n };

function getDialogFunc(dialogFunc) {
  const components = { alert, confirm, prompt, message, msg, toast };
  return components[dialogFunc];
}

export function addDialogClickListeners() {
  const dialogElems = document.querySelectorAll("[data-bs5-dialog]");
  for (const elem of dialogElems) {
    const opts = {};
    for (const attr of elem.attributes) {
      if (attr.name.startsWith("data-bs5-dialog-option-")) {
        const optName = attr.name.replace("data-bs5-dialog-option-", "");
        const attrVal = attr.value;
        opts[optName] = attrVal;
      }
    }
    elem.addEventListener("click", () => {
      const content = elem.title || elem.dataset.content;
      const elemOpts = elem.dataset.bs5DialogOptions ? JSON.parse(elem.dataset.bs5DialogOptions) : {};
      const dialogFunc = elem.dataset.bs5Dialog;
      const func = getDialogFunc(dialogFunc);
      if (typeof func === "function") {
        func(content.trim(), { ...opts, ...elemOpts });
      } else {
        console.log(`Function ${dialogFunc} does not exist`);
        return;
      }
    });
  }
}

const bs5dialog = {
  addDialogClickListeners,
  alert,
  confirm,
  prompt,
  message,
  msg,
  toast,
  loading,
  showLoading,
  loadingClean,
  hideLoading,
  load,
  offcanvas,
  utils,
  i18n
};

export default bs5dialog;
