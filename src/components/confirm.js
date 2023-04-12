import { setModalWrapper, replayLock ,triggerEvent,genDialogId} from "../utils";
import { makeIcon } from "../resource/icons";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";

/**
 * Displays a confirmation modal with the given content and options.
 * @param {string} content - The content to display in the modal.
 * @param {Object} options - The options for the modal.
 * @param {string} options.title - The title of the modal.
 * @param {string} options.type - The type of the modal.
 * @param {string} options.id - The ID of the modal.
 * @param {string} options.size - The size of the modal.
 * @param {string} options.btnOkText - The text to display on the OK button.
 * @param {string} options.btnCancelText - The text to display on the Cancel button.
 * @param {string} options.icon - The icon to display in the modal.
 * @param {string} options.icon_class - The class of the icon to display in the modal.
 * @param {string} options.icon_style - The style of the icon to display in the modal.
 * @param {function} options.onConfirm - The function to call when the OK button is clicked.
 * @param {function} options.onCancel - The function to call when the Cancel button is clicked.
 */
export function confirm(content = "", options = {}) {
  const defaultOptions = {
    title: i18n.getConfig("sure"),
    type: "danger",
    id: "",
    size: "md",
    btnOkText: "",
    btnCancelText: "",
    icon: null,
    icon_class: "",
    icon_style: "",
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
  modalElement.classList.add("bs5dialog-modal-confirm");
  modalElement.innerHTML = `
    <div class="modal-dialog modal-${options.size} modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-status bg-${options.type}"></div>
      <div class="modal-body text-center py-4">
      <div class='modal-icon'></div>
      <h3 class="modal-title mb-1">${options.title}</h3>
        <div class="text-muted">${content}</div>
      </div>
      <div class="modal-footer">
        <div class="w-100">
          <div class="row">
            <div class="col">
              <button type="button" class="w-100 btn btn-default btn-cancel text-truncate mb-2" data-bs-dismiss="modal">${
                options.btnCancelText || i18n.getConfig("cancel")
              }</button>
            </div>
            <div class="col">
              <button type="button" class="w-100 btn btn-default btn-${options.type} btn-ok text-truncate mb-2">${
    options.btnOkText || i18n.getConfig("confirm")
  }</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;

  if (options.type && options.icon == null) {
    options.icon = "bs5-alert-" + options.type;
  }
  const iconElement = makeIcon(options.icon, options.icon_class, options.icon_style);
  modalElement.querySelector(".modal-icon").appendChild(iconElement);

  document.body.appendChild(modalElement);
  const modalInstance = new bs5Modal(modalElement);
  modalInstance.show();
  const okBtnEl = modalElement.querySelector(".modal-footer .btn-ok");
  okBtnEl.addEventListener("click", () => {
    replayLock(okBtnEl);
    triggerEvent(modalElement, "bs5:dialog:ok", { options: options });
    if (typeof options.onConfirm === "function") {
      options.onConfirm();
    }
    modalInstance.hide();
  });

  const cancelBtnEl = modalElement.querySelector(".modal-footer .btn-cancel");
  cancelBtnEl.addEventListener("click", () => {
    replayLock(cancelBtnEl);
    triggerEvent(modalElement, "bs5:dialog:cancel", { options: options });
    if (typeof options.onCancel === "function") {
      options.onCancel();
    }
    modalInstance.hide();
  });

  modalElement.addEventListener("show.bs.modal", function () {
    triggerEvent(modalElement, "bs5:dialog:show", { options: options });
  });
  modalElement.addEventListener("shown.bs.modal", function () {
    triggerEvent(modalElement, "bs5:dialog:shown", { options: options });
  });
  modalElement.addEventListener("hide.bs.modal", function () {
    triggerEvent(modalElement, "bs5:dialog:hide", { options: options });
  });

  modalElement.addEventListener("hidden.bs.modal", function () {
    triggerEvent(modalElement, "bs5:dialog:hidden", { options: options });
  });

  return {
    el: modalElement,
    content: content,
    options: options
  };
}
