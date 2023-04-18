import { load } from "./components/load";
import { offcanvas } from "./components/offcanvas";
import { alert } from "./components/alert";
import { confirm } from "./components/confirm";
import { prompt } from "./components/prompt";
import { message, msg } from "./components/message";
import { toast } from "./components/toast";
import { setSystemLang } from "./i18n";

const components = { alert, confirm, prompt, message, toast, load, offcanvas };
export function addDialogClickListeners() {
  const dialogElems = document.querySelectorAll("[data-bs5-dialog]");
  for (const elem of dialogElems) {
    const opts = Object.fromEntries(
      [...elem.attributes]
        .filter(attr => attr.name.startsWith("data-bs5-dialog-option-"))
        .map(attr => [attr.name.replace("data-bs5-dialog-option-", ""), attr.value])
    );
    elem.addEventListener("click", () => {
      const content = elem.title || elem.dataset.content || "";
      const elemOpts = elem.dataset.bs5DialogOptions ? JSON.parse(elem.dataset.bs5DialogOptions) : {};
      const func = components[elem.dataset.bs5Dialog];
      if (typeof func === "function") {
        func(content.trim(), { ...opts, ...elemOpts });
      } else {
        console.log(`Function ${elem.dataset.bs5Dialog} does not exist`);
      }
    });
  }
}

export function startup() {
  setSystemLang();
  addDialogClickListeners();
}

export default startup;
