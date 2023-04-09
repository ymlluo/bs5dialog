import { setModalWrapper, replayLock } from "../libs";
import { getIconHtml } from "../templates.js";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";

/**
 * Displays an alert modal with the given content and options.
 * @param {string} content - The content to display in the modal.
 * @param {Object} options - The options for the modal.
 * @param {string} options.title - The title of the modal.
 * @param {string} options.type - The type of the modal.
 * @param {string} options.size - The size of the modal.
 * @param {string} options.btnOkText - The text to display on the OK button.
 * @param {string} options.icon - The icon to display in the modal.
 * @param {string} options.icon_class - The class of the icon to display in the modal.
 * @param {string} options.icon_custom - The custom icon to display in the modal.
 * @param {function} options.onOk - The function to call when the OK button is clicked.
 * @param {number} options.timeout - The time in milliseconds before the modal automatically closes.
 */

export function alert(content, options = {}) {
  const defaultOptions = {
    title: "",
    type: "success",
    size: "sm",
    btnOkText: "",
    icon: "ok",
    icon_class: "",
    icon_custom: "",
    onOk: null,
    timeout: 0
  };
  options = { ...defaultOptions, ...options };
  const modalElement = setModalWrapper();
  modalElement.classList.add("bs5dialog-modal-alert");
  modalElement.innerHTML = `
    <div class="modal-dialog modal-${options.size || "sm"} modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-status bg-${options.type}"></div>
        <div class="modal-body text-center">
          ${options.icon_custom || getIconHtml(options.icon, options.icon_class || ("text-" + options.type + ' mb-3'),'4rem') || ""}
          <h3 class="modal-title mb-2">${options.title}</h3>
          <div class="text-muted">${content}</div>
        </div>
        <div class="modal-footer">
          <div class="w-100">
            <div class="row">
              <div class="col"></div>
              <div class="col">
                <button type="button" class="w-100 btn btn-default btn-ok btn-${options.type}">${
                  options.btnOkText || i18n.getConfig("ok")
                }</button>
              </div>
              <div class="col"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalElement);
  const modalInstance = bs5Modal.getOrCreateInstance(modalElement);
  modalInstance.show();
  const okBtnEl = modalElement.querySelector(".modal-footer .btn-ok");
  okBtnEl.addEventListener("click", () => {
    replayLock(okBtnEl);
    if (typeof options.onOk === "function") {
      options.onOk();
    }
    modalInstance.hide();
  });

  modalElement.addEventListener("hide.bs.modal", function () {
    modalElement.classList.add("hide");
  });

  modalElement.addEventListener("hidden.bs.modal", function () {
    modalElement.style.display = "none";
    modalElement.classList.remove("show", "hide");
  });

  if (options.timeout) {
    setTimeout(() => {
      modalInstance.hide();
    }, options.timeout);
  }
}

