import { setModalWrapper, replayLock } from "../utils";
import { getIconHtml } from "../templates.js";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";

/**
 * Displays a prompt modal with customizable options.
 * @param {string} content - The content to display in the modal body.
 * @param {Object} options - An object containing optional parameters.
 * @param {string} options.title - The title of the modal.
 * @param {string} options.type - The type of the modal (e.g. primary, secondary, success, etc.).
 * @param {string} options.size - The size of the modal (e.g. sm, md, lg, etc.).
 * @param {string} options.btnText - The text to display on the confirmation button.
 * @param {string} options.icon - The name of the icon to display in the modal.
 * @param {string} options.icon_class - The class to apply to the icon.
 * @param {string} options.icon_custom - Custom HTML for the icon.
 * @param {boolean} options.secret - Whether or not the input should be a required field.
 * @param {boolean} options.secret - Whether or not the input should be a password field.
 * @param {function} options.onConfirm - A function to call when the confirmation button is clicked.
 * @param {function} options.onCancel - A function to call when the cancel button is clicked.
 */

export function prompt(content, options = {}) {
  const defaultOptions = {
    title: "",
    type: "secondary",
    size: "md",
    btnText: "",
    icon: "code",
    icon_class: "",
    icon_custom: "",
    required: true,
    secret: false,
    onConfirm: null,
    onCancel: null
  };
  options = { ...defaultOptions, ...options };
  const modal = setModalWrapper();
  modal.classList.add("bs5dialog-modal-prompt");
  modal.innerHTML = `
    <div class="modal-dialog modal-${options.size} modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-status bg-${options.type}"></div>
      <div class="modal-body text-center py-4">
        ${options.icon_custom || getIconHtml(options.icon, options.icon_class || "text-" + options.type) || ""}
        <h5 class="modal-title mb-2">${options.title}</h5>
        <div class="text-muted mb-2">${content}</div>
        <input class="form-control" type="${options.secret === true ? "password" : "text"}" placeholder="">
      </div>
      <div class="modal-footer">
        <div class="w-100">
          <div class="row">
            <div class="col">
              <button type="button" class="w-100 btn btn-default btn-cancel" data-bs-dismiss="modal">${i18n.getConfig("cancel")}</button>
            </div>
            <div class="col">
              <button type="button" class="w-100 btn btn-default btn-${options.type} btn-ok">${i18n.getConfig("ok")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;

  document.body.appendChild(modal);
  const modalEl = new bs5Modal(modal);
  modalEl.show();
  const okBtnEl = modal.querySelector(".modal-footer .btn-ok");
  const inputEl = modal.querySelector(".modal-body input");
  if (options.required) {
    okBtnEl.classList.add("disabled");
  }
  inputEl.addEventListener("keyup", function (event) {
    event.preventDefault();
    inputEl.value.length > 0 ? okBtnEl.classList.remove("disabled") : okBtnEl.classList.add("disabled");
    if (event.keyCode === 13 && !okBtnEl.classList.contains("disabled")) {
      okBtnEl.click();
    }
  });

  okBtnEl.addEventListener("click", () => {
    replayLock(okBtnEl);
    if (typeof options.onConfirm === "function") {
      options.onConfirm(inputEl.value);
    }
    modalEl.hide();
  });
  const cancelBtnEl = modal.querySelector(".modal-footer .btn-cancel");
  okBtnEl.addEventListener("click", () => {
    replayLock(okBtnEl);
    if (typeof options.onCancel === "function") {
      options.onCancel();
    }
    modalEl.hide();
  });
}
