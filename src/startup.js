import { load } from "./components/load";
import { offcanvas } from "./components/offcanvas";
import { alert } from "./components/alert";
import { confirm } from "./components/confirm";
import { prompt } from "./components/prompt";
import { message, msg } from "./components/message";
import { toast } from "./components/toast";
import { setSystemLang } from "./i18n";

const components = { alert, confirm, prompt, message, toast, load, offcanvas };
/**
 * Returns an object containing all the data-bs5-dialog-option-* attributes of an element
 * @param {HTMLElement} elem - The element to get the options from
 * @returns {Object} - An object containing all the options
 */
function getDialogOptions(elem) {
  return Object.fromEntries(
    [...elem.attributes]
      .filter(attr => attr.name.startsWith("data-bs5-dialog-option-"))
      .map(attr => [attr.name.replace("data-bs5-dialog-option-", ""), attr.value])
  );
}

/**
 * Shows a dialog based on the data-bs5-dialog attribute of an element
 * @param {HTMLElement} elem - The element to show the dialog for
 */
function showDialog(elem) {
  const content = elem.title || elem.dataset.content || "";
  const elemOpts = elem.dataset.bs5DialogOptions ? JSON.parse(elem.dataset.bs5DialogOptions) : {};
  const func = components[elem.dataset.bs5Dialog];
  if (typeof func === "function") {
    func(content.trim(), { ...getDialogOptions(elem), ...elemOpts });
  } else {

  }
}

/**
 * Adds click listeners to all elements with the data-bs5-dialog attribute
 */
export function addDialogClickListeners() {
  const dialogElems = document.querySelectorAll("[data-bs5-dialog]");
  for (const elem of dialogElems) {
    elem.addEventListener("click", () => {
      showDialog(elem);
    });
  }
}

/**
 * Initializes the dialog system by setting the system language and adding click listeners to all elements with the data-bs5-dialog attribute
 */
export function startup() {
  setSystemLang();
  addDialogClickListeners();
}

export default startup;


