import { setModalWrapper, replayLock } from "../utils";
import { getIconHtml } from "../templates.js";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";

/**
 * Displays a confirmation dialog with the given content and options.
 * @param {string} content - The content to display in the dialog.
 * @param {Object} options - The options for the dialog.
 * @param {string} options.title - The title of the dialog.
 * @param {string} options.type - The type of the dialog.
 * @param {string} options.size - The size of the dialog.
 * @param {string} options.btnOkText - The text to display on the OK button.
 * @param {string} options.btnCancelText - The text to display on the Cancel button.
 * @param {string} options.icon - The icon to display in the dialog.
 * @param {string} options.icon_class - The class of the icon to display in the dialog.
 * @param {function} options.onConfirm - The function to call when the OK button is clicked.
 * @param {function} options.onCancel - The function to call when the Cancel button is clicked.
 */
export function confirm(content = "", options = {}) {
  const defaultOptions = {
    title: i18n.getConfig("sure"),
    type: "danger",
    size: "md",
    btnOkText: "",
    btnCancelText: "",
    icon: "alert",
    icon_class: "",
    onConfirm: null,
    onCancel: null
  };
  options = { ...defaultOptions, ...options };

  const modal = setModalWrapper();
  modal.classList.add("bs5dialog-modal-confirm");
  modal.innerHTML = `
    <div class="modal-dialog modal-${options.size} modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-status bg-${options.type}"></div>
      <div class="modal-body text-center py-4">
      ${getIconHtml(options.icon,  'mb-2 '+(options.icon_class || "text-" + options.type),'3rem') || ""}
      <h3 class="modal-title mb-1">${options.title}</h3>
        <div class="text-muted">${content}</div>
      </div>
      <div class="modal-footer">
        <div class="w-100">
          <div class="row">
            <div class="col">
              <button type="button" class="w-100 btn btn-default btn-cancel" data-bs-dismiss="modal">${
                options.btnCancelText || i18n.getConfig("cancel")
              }</button>
            </div>
            <div class="col">
              <button type="button" class="w-100 btn btn-default btn-${options.type} btn-ok">${
    options.btnOkText || i18n.getConfig("confirm")
  }</button>
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
  okBtnEl.addEventListener("click", () => {
    replayLock(okBtnEl);
    if (typeof options.onConfirm === "function") {
      options.onConfirm();
    }
    modalEl.hide();
  });

  const cancelBtnEl = modal.querySelector(".modal-footer .btn-cancel");
  cancelBtnEl.addEventListener("click", () => {
    replayLock(cancelBtnEl);
    if (typeof options.onCancel === "function") {
      options.onCancel();
    }
    modalEl.hide();
  });
}

