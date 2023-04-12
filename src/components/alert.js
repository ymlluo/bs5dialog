import { setModalWrapper, replayLock,triggerEvent,genDialogId} from "../utils";
import { makeIcon } from "../resource/icons";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";

/**
 * Displays an alert modal with the given content and options.
 * @param {string} content - The content to display in the modal.
 * @param {Object} options - The options for the modal.
 * @param {string} options.title - The title of the modal.
 * @param {string} options.type - The type of the modal.
 * @param {string} options.size - The size of the modal.
 * @param {string} options.id - The ID of the modal.
 * @param {string} options.btnOkText - The text to display on the OK button.
 * @param {string} options.icon - The icon to display in the modal.
 * @param {string} options.icon_class - The class of the icon to display in the modal.
 * @param {string} options.icon_style - The style of the icon to display in the modal.
 * @param {function} options.onOk - The function to call when the OK button is clicked.
 * @param {number} options.timeout - The time in milliseconds before the modal automatically closes.
 */

export function alert(content, options = {}) {
  const defaultOptions = {
    title: "",
    type: "success",
    size: "md",
    id:"",
    btnOkText: "",
    icon: null,
    icon_class: "",
    icon_style: "",
    onOk: null,
    timeout: 0
  };
  options = { ...defaultOptions, ...options };
  let modalElement;
  if (options.id && document.getElementById(options.id)) {
    modalElement = document.getElementById(options.id);
  } else {
    modalElement = setModalWrapper();
    options.id = options.id ||  genDialogId();
    modalElement.setAttribute("id", options.id);
  }
  modalElement.classList.add("bs5dialog-modal-alert");
  modalElement.innerHTML = `
    <div class="modal-dialog modal-${options.size || "sm"} modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-status bg-${options.type}"></div>
        <div class="modal-body text-center py-4">
        <div class='modal-icon'></div>
          <h3 class="modal-title mb-2">${options.title}</h3>
          <div class="text-muted">${content}</div>
        </div>
        <div class="modal-footer">
          <div class="w-100">
            <div class="row">
              <div class="col"></div>
              <div class="col">
                <button type="button" class="w-100 text-truncate btn btn-default btn-ok btn-${options.type}">${
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

  if (options.type && options.icon == null) {
    options.icon = "bs5-alert-" + options.type;
  }
  const iconElement = makeIcon(options.icon, options.icon_class, options.icon_style);
  modalElement.querySelector(".modal-icon").appendChild(iconElement);

  document.body.appendChild(modalElement);
  const modalInstance = bs5Modal.getOrCreateInstance(modalElement);
  modalInstance.show();
  const okBtnEl = modalElement.querySelector(".modal-footer .btn-ok");
  okBtnEl.addEventListener("click", () => {
    replayLock(okBtnEl);
    if (typeof options.onOk === "function") {
      options.onOk();
    }
    triggerEvent(modalElement,'bs5:dialog:ok',{options:options})
    modalInstance.hide();
  });

  modalElement.addEventListener("show.bs.modal", function () {
    triggerEvent(modalElement,'bs5:dialog:show',{options:options})
  });
  modalElement.addEventListener("shown.bs.modal", function () {
    triggerEvent(modalElement,'bs5:dialog:shown',{options:options})
  });

  modalElement.addEventListener("hide.bs.modal", function () {
    triggerEvent(modalElement,'bs5:dialog:hide',{options:options})
  });

  modalElement.addEventListener("hidden.bs.modal", function () {
    triggerEvent(modalElement,'bs5:dialog:hidden',{options:options})
  });

  if (options.timeout) {
    setTimeout(() => {
      modalInstance.hide();
    }, options.timeout);
  }
  return {
    el:modalElement,
    content:content,
    options:options
  }
}
