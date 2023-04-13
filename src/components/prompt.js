import { setModalWrapper, replayLock, triggerEvent, genDialogId } from "../utils";
import { makeIcon } from "../resource/icons";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";

/**
 * Displays a prompt dialog with customizable options.
 * @param {string} content - The content to display in the dialog.
 * @param {Object} options - The options for the dialog.
 * @param {string} options.title - The title of the dialog.
 * @param {string} options.type - The type of the dialog.
 * @param {string} options.size - The size of the dialog.
 * @param {string} options.btnText - The text to display on the button.
 * @param {string} options.icon - The icon to display in the dialog.
 * @param {string} options.iconClass - The class of the icon to display in the dialog.
 * @param {string} options.iconStyle - The style of the icon to display in the dialog.
 * @param {boolean} options.required - Whether the input is required.
 * @param {boolean} options.secret - Whether the input should be hidden.
 * @param {function} options.onConfirm - The function to call when the user confirms the dialog.
 * @param {function} options.onCancel - The function to call when the user cancels the dialog.
 * @returns {Object} - An object containing the dialog element, content, and options.
 */
export function prompt(content, options = {}) {
  const defaultOptions = {
    title: "",
    type: "secondary",
    size: "md",
    btnText: "",
    icon: null,
    iconClass: "",
    iconStyle: "",
    required: true,
    secret: false,
    onConfirm: null,
    onCancel: null
  };
  options = { ...defaultOptions, ...options };
  let modalElement;
  if (options.id && document.getElementById(options.id)) {
    modalElement = document.getElementById(options.id);
  } else {
    modalElement = setModalWrapper();
    options.id = options.id || genDialogId();
    modalElement.setAttribute("id", options.id);
  }
  modalElement.classList.add("bs5dialog-modal-prompt");
  modalElement.innerHTML = `
    <div class="modal-dialog modal-${options.size} modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-status bg-${options.type}"></div>
      <div class="modal-body text-center py-4">
      <div class='modal-icon'></div>
        <h5 class="modal-title mb-2">${options.title}</h5>
        <div class="text-muted mb-2">${content}</div>
        <input class="form-control" type="${options.secret === true ? "password" : "text"}" placeholder="">
      </div>
      <div class="modal-footer">
        <div class="w-100">
          <div class="row">
            <div class="col">
              <button type="button" class="w-100 btn btn-default btn-cancel text-truncate" data-bs-dismiss="modal">${i18n.getConfig(
                "cancel"
              )}</button>
            </div>
            <div class="col">
              <button type="button" class="w-100 btn btn-default btn-${options.type} btn-ok text-truncate">${i18n.getConfig("ok")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;

  if (options.type && options.icon == null) {
    options.icon = "bs5-code";
    options.iconClass = "text-" + options.type;
  }
  const iconElement = makeIcon(options.icon, options.iconClass, options.iconStyle);
  modalElement.querySelector(".modal-icon").appendChild(iconElement);
  document.body.appendChild(modalElement);
  const modalInstance = new bs5Modal(modalElement);
  triggerEvent("bs5dialog:prompt:show", { options: options });
  modalInstance.show();
  triggerEvent("bs5dialog:prompt:shown", { options: options });
  const okBtnEl = modalElement.querySelector(".modal-footer .btn-ok");
  const inputEl = modalElement.querySelector(".modal-body input");
  if (options.required) {
    okBtnEl.classList.add("disabled");
  }
  inputEl.addEventListener("keyup", function (event) {
    event.preventDefault();
    triggerEvent("bs5:dialog:typing", { options: options, value: inputEl.value });
    inputEl.value.length > 0 ? okBtnEl.classList.remove("disabled") : okBtnEl.classList.add("disabled");
    if (event.keyCode === 13 && !okBtnEl.classList.contains("disabled")) {
      okBtnEl.click();
    }
  });

  okBtnEl.addEventListener("click", () => {
    replayLock(okBtnEl);
    triggerEvent("bs5:dialog:ok", { options: options, value: inputEl.value });
    if (typeof options.onConfirm === "function") {
      options.onConfirm(inputEl.value);
    }
    modalInstance.hide();
  });
  const cancelBtnEl = modalElement.querySelector(".modal-footer .btn-cancel");
  cancelBtnEl.addEventListener("click", () => {
    replayLock(cancelBtnEl);
    triggerEvent("bs5:dialog:cancel", { options: options });
    if (typeof options.onCancel === "function") {
      options.onCancel();
    }
    modalInstance.hide();
  });

  triggerEvent("bs5:dialog:show", { options: options });

  modalElement.addEventListener("shown.bs.modal", function () {
    triggerEvent("bs5:dialog:shown", { options: options });
  });

  modalElement.addEventListener("hide.bs.modal", function () {
    triggerEvent("bs5:dialog:hide", { options: options });
  });

  modalElement.addEventListener("hidden.bs.modal", function () {
    triggerEvent("bs5:dialog:hidden", { options: options });
  });

  return {
    el: modalElement,
    content,
    options
  };
}
