import {
  makeRequest,
  isUrlOrPath,
  makeDraggable,
  makeResizable,
  genDialogId,
  setModalWrapper,
  replayLock,
  triggerEvent,
  observeElement
} from "../utils.js";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";
import { initializeBootstrapComponents } from "../utils/bootstrapInit.js";
import { makeIcon } from "../resource/icons.js";
import { message } from "./message.js";

/**
 * Loads content into a Bootstrap 5 modal dialog with customizable options.
 * @param {string} content - The content to be loaded into the modal dialog. Can be a URL or HTML content.
 * @param {Object} options - An object containing customizable options for the modal dialog.
 * @param {string} options.title - The title of the modal dialog.
 * @param {string} options.type - The type of the modal dialog, which determines the color of the status bar.
 * @param {string} options.size - The size of the modal dialog.
 * @param {string} options.id - The ID of the modal dialog.
 * @param {boolean} options.centered - Whether the modal dialog should be centered on the screen.
 * @param {boolean} options.scrollable - Whether the modal dialog should be scrollable.
 * @param {boolean} options.maximize - Whether the modal dialog should be maximize.
 * @param {boolean} options.backdrop - Whether the modal dialog should have a backdrop.
 * @param {boolean} options.focus - Whether the modal dialog should be focused.
 * @param {boolean} options.keyboard - Whether the keyboard should be enabled for the modal dialog.
 * @param {boolean} options.draggable - Whether the modal dialog should be draggable.
 * @param {boolean} options.resizable - Whether the modal dialog should be resizable.
 * @param {string} options.btnOkText - The text to display on the OK button.
 * @param {string} options.btnCancelText - The text to display on the Cancel button.
 * @param {function} options.onShow - A function to be called when the modal dialog is shown.
 * @param {function} options.onShown - A function to be called after the modal dialog is shown.
 * @param {function} options.onHide - A function to be called when the modal dialog is hidden.
 * @param {function} options.onHidden - A function to be called after the modal dialog is hidden.
 * @param {boolean} options.isForm - Whether the modal dialog should be a form.
 * @param {function} options.onSubmit - A function to be called when the modal dialog is submitted.
 * @param {function} options.onSubmitSuccess - A function to be called after the modal dialog is successfully submitted.
 * @param {function} options.onSubmitError - A function to be called if there is an error submitting the modal dialog.
 * @param {function} options.onSubmitDone - A function to be called after the modal dialog is submitted, regardless of success or failure.
 */
export async function load(content, options = {}) {
  const defaultOptions = {
    title: "",
    type: "danger",
    size: "lg",
    id: "",
    centered: true,
    scrollable: true,
    maximize: false,
    backdrop: false,
    focus: true,
    keyboard: true,
    draggable: true,
    resizable: true,
    btnOkText: "",
    btnCancelText: "",
    onShow: null,
    onShown: null,
    onHidden: null,
    isForm: true,
    onSubmit: null,
    onSubmitSuccess: () => { },
    onSubmitError: () => { },
    onSubmitDone: () => { }
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
  const handleFormSubmit = async (form, okBtn, modalInstance) => {
    try {

      okBtn.disabled = true;
      const formData = new FormData(form);
      const eventData = {
        options,
        formEl: form,
        formAction: form.action,
        formMethod: form.method,
        formData
      };

      triggerEvent(modalElement, "bs5:dialog:form:submit", eventData);
      options.onSubmit?.(modalElement);

      const submitResult = await makeRequest(form.action, form.method, {}, formData);
      eventData.submitResult = submitResult;

      triggerEvent(modalElement, "bs5:dialog:form:submit:complete", eventData);
      options.onSubmitDone?.(submitResult);

      if (submitResult.isSuccess) {
        triggerEvent(modalElement, "bs5:dialog:form:submit:success", eventData);
        options.onSubmitSuccess?.(submitResult);
        modalInstance.hide();
      } else {
        triggerEvent(modalElement, "bs5:dialog:form:submit:error", eventData);
        options.onSubmitError?.(submitResult);
        message(submitResult.content);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      message('An error occurred during form submission');
      options.onSubmitError?.({ isSuccess: false, content: error.message });
    } finally {
      okBtn.disabled = false;
    }
  };

  observeElement(modalElement, {
    created: () => {
      options.onShow?.(modalElement);
      triggerEvent(modalElement, "bs5:dialog:load:created", { options, el: modalElement });
    },
    rendered: () => {
      options.onShown?.(modalElement);
      initializeBootstrapComponents(modalElement);

      if (options.backdrop === false) {
        document.querySelector(".modal-backdrop")?.remove();
        modalElement.style.pointerEvents = "none";
      }

      triggerEvent(modalElement, "bs5:dialog:load:rendered", { options, el: modalElement });
      const modalInstance = bs5Modal.getOrCreateInstance(modalElement);

      // Handle cancel button
      const cancelBtn = modalElement.querySelector(".modal-footer .btn-cancel");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          replayLock(cancelBtn);
          triggerEvent(modalElement, "bs5:dialog:load:cancel", { options });
          options.onCancel?.();
          modalInstance.hide();
        });
      }

      // Handle form if present
      const form = modalElement.querySelector("form");
      if (options.isForm && form) {
        const modalFooter = modalElement.querySelector(".modal-footer");
        modalFooter.classList.remove("d-none");

        const submitBtn = form.querySelector('button[type="submit"]');
        const okBtn = modalElement.querySelector(".modal-footer .btn-ok");

        if (submitBtn) {
          submitBtn.style.display = "none";
          okBtn.textContent = submitBtn.textContent;
        }
        okBtn.setAttribute("type", "submit");

        form.addEventListener("submit", e => e.preventDefault());
        okBtn.addEventListener("click", async event => {
          event.preventDefault();
          replayLock(okBtn);
          await handleFormSubmit(form, okBtn, modalInstance);
        });

        // 添加回车提交支持
        form.addEventListener("keypress", event => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            okBtn.click();
          }
        });
      }
    },
    hidden: () => {
      options.onHidden?.(modalElement);
      triggerEvent(modalElement, "bs5:dialog:load:hidden", { options, el: modalElement });
    },
    remove: () => {
      triggerEvent(modalElement, "bs5:dialog:load:remove", { options, el: modalElement });
    },
    resize: () => {
      triggerEvent(modalElement, "bs5:dialog:load:resize", { options, el: modalElement });
    },
    dragged: () => {
      triggerEvent(modalElement, "bs5:dialog:load:dragged", { options, el: modalElement });
    }
  });

  // Handle URL content
  if (isUrlOrPath(content)) {
    const apiUrl = content;
    const res = await makeRequest(apiUrl, "GET");
    content = res.content;

    if (content.includes("<!DOCTYPE html>") || content.includes("<html")) {
      content = `<iframe src="${apiUrl}" width='100%' height='100%'></iframe>`;
      options.scrollable = false;
    }
  }

  // Build modal HTML
  modalElement.innerHTML = `
    <div class="modal-dialog ${options.maximize ? "modal-fullscreen" : `modal-${options.size}`} 
         ${options.centered ? "modal-dialog-centered" : ""} 
         ${options.scrollable ? "modal-dialog-scrollable" : ""}" role="document">
      <div class="modal-content shadow">
        <div class="modal-status bg-${options.type}"></div>
        <div class="modal-header">
          <h5 class="modal-title">${options.title}</h5>
          <div class='modal-maximize-toggle'></div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" ${options.scrollable ? "style='height:60vh'" : ""}>
          ${content}
        </div>
        <div class="modal-footer d-none">
          <button type="button" class="btn me-auto btn-cancel" data-bs-dismiss="modal">
            ${options.btnCancelText || i18n.getConfig("cancel")}
          </button>
          <button type="button" class="btn btn-ok btn-${options.type}">
            ${options.btnOkText || i18n.getConfig("save")}
          </button>
        </div>
      </div>
    </div>
  `;

  // Set up draggable/resizable
  if (options.draggable) {
    makeDraggable(modalElement, modalElement.querySelector(".modal-header"));
  }
  if (options.resizable) {
    makeResizable(modalElement.querySelector(".modal-content"));
  }

  // Set up maximize/minimize buttons
  const maximizeToggle = modalElement.querySelector(".modal-maximize-toggle");
  const iconMinimizeElement = makeIcon(
    "bs5-minimize",
    `btn-minimize btn-maximize-toggle ${options.maximize ? "" : "d-none"}`,
    "width:1.438rem;height:1.438rem;cursor:pointer;"
  );
  const iconMaximizeElement = makeIcon(
    "bs5-maximize",
    `btn-maximize btn-maximize-toggle ${options.maximize ? "d-none" : ""}`,
    "width:1.438rem;height:1.438rem;cursor:pointer;"
  );
  maximizeToggle.append(iconMinimizeElement, iconMaximizeElement);

  document.body.appendChild(modalElement);

  // Initialize and show modal
  const modalInstance = bs5Modal.getOrCreateInstance(modalElement, {
    keyboard: options.keyboard,
    focus: options.focus,
    backdrop: options.backdrop
  });
  modalInstance.show();

  // Handle maximize/minimize
  const modalDialog = modalElement.querySelector(".modal-dialog");
  modalElement.querySelectorAll(".btn-maximize-toggle").forEach(el => {
    el.addEventListener("click", function () {
      if (this.classList.contains("btn-maximize")) {
        triggerEvent(modalElement, "bs5:dialog:load:maximize", { options });
        modalDialog.parentElement.style.top = 0;
        modalDialog.parentElement.style.left = 0;

        const modalContent = modalDialog.querySelector(".modal-content");
        modalContent.style.width = null;
        modalContent.style.height = null;

        modalDialog.classList.add("modal-fullscreen");
        modalDialog.classList.remove(`modal-${options.size}`);
        this.classList.add("d-none");
        modalElement.querySelector(".btn-minimize").classList.remove("d-none");
      } else if (this.classList.contains("btn-minimize")) {
        triggerEvent(modalElement, "bs5:dialog:load:minimize", { options });
        modalDialog.classList.remove("modal-fullscreen");
        modalDialog.classList.add(`modal-${options.size}`);
        this.classList.add("d-none");
        modalElement.querySelector(".btn-maximize").classList.remove("d-none");
      }
    });
  });

  return {
    el: modalElement,
    content,
    options
  };
}
