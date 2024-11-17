import { setModalWrapper, replayLock, triggerEvent, genDialogId, observeElement } from "../utils";
import { makeIcon } from "../resource/icons";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";
import { initializeBootstrapComponents } from "../utils/bootstrapInit";

/**
 * Displays an alert modal with the given content and options.
 * @param {string} content - The content to display in the alert modal.
 * @param {Object} options - The options for the alert modal.
 * @param {string} options.title - The title of the alert modal.
 * @param {string} options.type - The type of the alert modal (e.g. "success", "warning", "danger").
 * @param {string} options.size - The size of the alert modal (e.g. "sm", "md", "lg").
 * @param {string} options.id - The ID of the alert modal.
 * @param {string} options.btnOkText - The text to display on the OK button.
 * @param {string} options.icon - The name of the icon to display in the alert modal.
 * @param {string} options.iconClass - The CSS class for the icon.
 * @param {string} options.iconStyle - The CSS style for the icon.
 * @param {function} options.onOk - The function to call when the OK button is clicked.
 * @param {number} options.timeout - The time in milliseconds before the alert modal automatically closes.
 * @returns {Object} - An object containing the alert modal element, content, and options.
 */
export function alert(content = "", options = {}) {
  const defaultOptions = {
    title: "",
    type: "success",
    size: "md",
    id: "",
    btnOkText: "",
    icon: null,
    iconClass: "",
    iconStyle: "",
    onOk: null,
    timeout: 0
  };

  options = { ...defaultOptions, ...options };

  // Get or create modal element
  const modalElement = options.id && document.getElementById(options.id)
    ? document.getElementById(options.id)
    : (() => {
      const el = setModalWrapper();
      el.setAttribute("id", options.id || genDialogId());
      return el;
    })();

  // Set up event observers
  observeElement(modalElement, {
    created: () => {
      triggerEvent(modalElement, "bs5:dialog:alert:created", { options, el: modalElement });
    },
    rendered: () => {
      triggerEvent(modalElement, "bs5:dialog:alert:rendered", { options, el: modalElement });
      const modalInstance = bs5Modal.getOrCreateInstance(modalElement);
      initializeBootstrapComponents(modalElement);

      // Handle OK button click
      const okBtn = modalElement.querySelector(".modal-footer .btn-ok");
      if (okBtn) {
        okBtn.addEventListener("click", () => {
          replayLock(okBtn);
          triggerEvent(modalElement, "bs5:dialog:alert:ok", { options });
          options.onOk?.();
          modalInstance.hide();
        });
      }

      // Handle Cancel button click if present
      const cancelBtn = modalElement.querySelector(".modal-footer .btn-cancel");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          replayLock(cancelBtn);
          triggerEvent(modalElement, "bs5:dialog:alert:cancel", { options });
          options.onCancel?.();
          modalInstance.hide();
        });
      }
    },
    hidden: () => {
      triggerEvent(modalElement, "bs5:dialog:alert:hidden", { options, el: modalElement });
    },
    remove: () => {
      triggerEvent(modalElement, "bs5:dialog:alert:remove", { options, el: modalElement });
    }
  });

  // Build modal HTML
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
                <button type="button" class="w-100 text-truncate btn btn-default btn-ok btn-${options.type}">
                  ${options.btnOkText || i18n.getConfig("ok")}
                </button>
              </div>
              <div class="col"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Set up icon
  if (options.type && options.icon == null) {
    options.icon = `bs5-alert-${options.type}`;
  }
  const iconElement = makeIcon(options.icon, options.iconClass, options.iconStyle);
  modalElement.querySelector(".modal-icon").appendChild(iconElement);

  // Show modal
  document.body.appendChild(modalElement);
  const modalInstance = bs5Modal.getOrCreateInstance(modalElement);
  modalInstance.show();

  // Clean up on hide
  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });

  // Handle auto-close timeout
  if (options.timeout > 0) {
    setTimeout(() => {
      modalInstance.hide();
    }, options.timeout);
  }

  return {
    el: modalElement,
    content,
    options
  };
}
