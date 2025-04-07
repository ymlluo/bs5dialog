import { setModalWrapper, replayLock, triggerEvent, genDialogId, observeElement } from "../utils.js";
import { makeIcon } from "../resource/icons.js";
import * as i18n from "../i18n.js";
import { initializeBootstrapComponents, checkBootstrapAvailability } from "../utils/bootstrapInit.js";

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
 * @param {string} options.iconClass - The class of the icon to display in the modal.
 * @param {string} options.iconStyle - The style of the icon to display in the modal.
 * @param {function} options.onConfirm - The function to call when the OK button is clicked.
 * @param {function} options.onCancel - The function to call when the Cancel button is clicked.
 * @returns {Object} - An object containing the modal element, content, and options.
 */
export function confirm(content = "", options = {}) {
  // Check if bootstrap is available
  if (!checkBootstrapAvailability()) {
    return { el: null, content, options };
  }

  const defaultOptions = {
    title: i18n.getConfig("sure"),
    type: "danger",
    id: "",
    size: "md",
    btnOkText: "",
    btnCancelText: "",
    icon: null,
    iconClass: "",
    iconStyle: "",
    onConfirm: null,
    onCancel: null
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

  modalElement.classList.add("bs5dialog-modal-confirm");

  // Set up event observers
  observeElement(modalElement, {
    created: () => {
      triggerEvent(modalElement, "bs5:dialog:confirm:created", { options, el: modalElement });
    },
    rendered: () => {
      triggerEvent(modalElement, "bs5:dialog:confirm:rendered", { options, el: modalElement });
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
      initializeBootstrapComponents(modalElement);

      // Handle button clicks
      const okBtn = modalElement.querySelector(".modal-footer .btn-ok");
      const cancelBtn = modalElement.querySelector(".modal-footer .btn-cancel");

      if (okBtn) {
        okBtn.addEventListener("click", () => {
          replayLock(okBtn);
          triggerEvent(modalElement, "bs5:dialog:confirm:ok", { options });
          options.onConfirm?.();
          modalInstance.hide();
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          replayLock(cancelBtn);
          triggerEvent(modalElement, "bs5:dialog:confirm:cancel", { options });
          options.onCancel?.();
          modalInstance.hide();
        });
      }
    },
    hidden: () => {
      triggerEvent(modalElement, "bs5:dialog:confirm:hidden", { options, el: modalElement });
    },
    remove: () => {
      triggerEvent(modalElement, "bs5:dialog:confirm:remove", { options, el: modalElement });
    }
  });

  // Build modal HTML
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
                <button type="button" class="w-100 btn btn-default btn-cancel text-truncate mb-2" data-bs-dismiss="modal">
                  ${options.btnCancelText || i18n.getConfig("cancel")}
                </button>
              </div>
              <div class="col">
                <button type="button" class="w-100 btn btn-default btn-${options.type} btn-ok text-truncate mb-2">
                  ${options.btnOkText || i18n.getConfig("confirm")}
                </button>
              </div>
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
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
  modalInstance.show();

  // Clean up on hide
  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });

  return {
    el: modalElement,
    content,
    options
  };
}
