import { makeRequest, isUrlOrPath, makeDraggable, makeResizable, genDialogId, setModalWrapper, replayLock, triggerEvent } from "../utils";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";
import { makeIcon } from "../resource/icons";
import { message } from "./message";

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
    onHide: null,
    onHidden: null,
    isForm: true,
    onSubmit: null,
    onSubmitSuccess: submitResult => {},
    onSubmitError: submitResult => {},
    onSubmitDone: submitResult => {}
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

  if (isUrlOrPath(content)) {
    let apiUrl = content;
    const res = await makeRequest(apiUrl,'GET',);
    console.log(res);
    content = res.content;
    if (content.includes("<!DOCTYPE html>") || content.includes("<html")) {
      //frame
      content = `<iframe src="${apiUrl}" width='100%' height='100%'></iframe>`;
      options.scrollable = false;
    }
  }

  modalElement.innerHTML = `<div class="modal-dialog  ${options.maximize ? "modal-fullscreen" : "modal-" + options.size} ${
    options.centered ? "modal-dialog-centered" : ""
  } ${options.scrollable ? "modal-dialog-scrollable" : ""}" role="document">
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
          <button type="button" class="btn me-auto" data-bs-dismiss="modal">${options.btnCancelText || i18n.getConfig("cancel")}</button>
          <button type="button" class="btn btn-ok btn-${options.type}">${options.btnOkText || i18n.getConfig("save")}</button>
       </div>
    </div>
  </div>`;

  document.body.appendChild(modalElement);

  const modalInstance = bs5Modal.getOrCreateInstance(modalElement, {
    keyboard: options.keyboard,
    focus: options.focus,
    backdrop: options.backdrop
  });
  modalInstance.show();

  modalElement.addEventListener("show.bs.modal", function () {
    triggerEvent(modalElement, "bs5:dialog:show", { options: options });
    if (typeof options.onShow === "function") {
      options.onShow();
    }
  });
  modalElement.addEventListener("shown.bs.modal", function () {
    triggerEvent(modalElement, "bs5:dialog:shown", { options: options });

    if (options.backdrop === false) {
      if (document.querySelector(".modal-backdrop")) {
        document.querySelector(".modal-backdrop").remove();
      }
      modalElement.style.pointerEvents = "none";
    }

    if (options.draggable) {
      makeDraggable(modalElement, modalElement.querySelector(".modal-header"));
    }
    if (options.resizable) {
      makeResizable(modalElement.querySelector(".modal-content"));
    }
    if (typeof options.onShown === "function") {
      options.onShown(modalElement);
    }
  });
  modalElement.addEventListener("hide.bs.modal", function () {
    triggerEvent(modalElement, "bs5:dialog:hide", { options: options });
    if (typeof options.onHide === "function") {
      options.onHide();
    }
  });

  modalElement.addEventListener("hidden.bs.modal", function () {
    triggerEvent(modalElement, "bs5:dialog:hidden", { options: options });
    if (typeof options.onHidden === "function") {
      options.onHidden();
    }
  });


  const iconMinimizeElement = makeIcon(
    "bs5-minimize",
    "btn-minimize btn-maximize-toggle " + (options.maximize ? "" : "d-none"),
    "width:1.438rem;height:1.438rem;cursor:pointer;"
  );
  const iconMaximizeElement = makeIcon(
    "bs5-maximize",
    "btn-maximize btn-maximize-toggle " + (options.maximize ? "d-none" : ""),
    "width:1.438rem;height:1.438rem;cursor:pointer;"
  );
  const maximizeToggle = modalElement.querySelector(".modal-maximize-toggle");
  maximizeToggle.appendChild(iconMinimizeElement);
  maximizeToggle.appendChild(iconMaximizeElement);
  const modalDialog = modalElement.querySelector(".modal-dialog");
  modalElement.querySelectorAll(".btn-maximize-toggle").forEach(function (el) {
    el.addEventListener("click", function () {
      if (this.classList.contains("btn-maximize")) {
        triggerEvent(modalElement, "bs5:dialog:maximize", { options: options });
        //fix drag
        modalDialog.parentElement.style.top = 0;
        modalDialog.parentElement.style.left = 0;
        //fix resize
        const modalContent = modalDialog.querySelector(".modal-content");
        modalContent.style.width = null;
        modalContent.style.height = null;
        modalDialog.classList.add("modal-fullscreen");
        modalDialog.classList.remove("modal-" + options.size);
        this.classList.add("d-none");
        modalElement.querySelector(".btn-minimize").classList.remove("d-none");
      } else if (this.classList.contains("btn-minimize")) {
        triggerEvent(modalElement, "bs5:dialog:minimize", { options: options });
        modalDialog.classList.remove("modal-fullscreen");
        modalDialog.classList.add("modal-" + options.size);
        this.classList.add("d-none");
        modalElement.querySelector(".btn-maximize").classList.remove("d-none");
      }
    });
  });


  const form = modalElement.querySelector("form");
  if (options.isForm && form) {
    const modalFooter = modalElement.querySelector(".modal-footer");
    modalFooter.classList.remove("d-none");
    const submitBtn = form.querySelector('button[type="submit"]');
    const okBtn = modalElement.querySelector(".modal-footer .btn-ok");
    submitBtn.style.display = "none";
    okBtn.textContent = submitBtn.textContent;
    okBtn.setAttribute("type", "submit");
    okBtn.addEventListener("click", async function (event) {
      event.preventDefault();
      replayLock(okBtn);
      triggerEvent(modalElement, "bs5:dialog:form:submit", {
        options: options,
        formEl: form,
        formAction: form.action,
        formMethod: form.method,
        formData: new FormData(form)
      });
      if (typeof options.onSubmit === "function") {
        options.onSubmit(modalElement);
      }

      try {
        const submitResult = await makeRequest(form.action, form.method, {}, new FormData(form));
        triggerEvent(modalElement, "bs5:dialog:form:submit:complete", {
          options: options,
          formEl: form,
          formAction: form.action,
          formMethod: form.method,
          formData: new FormData(form),
          submitResult: submitResult
        });
        if (typeof options.onSubmitDone === "function") {
          options.onSubmitDone(submitResult);
        }
        if (submitResult.isSuccess && typeof options.onSubmitSuccess === "function") {
          triggerEvent(modalElement, "bs5:dialog:form:submit:success", {
            options: options,
            formEl: form,
            formAction: form.action,
            formMethod: form.method,
            formData: new FormData(form),
            submitResult: submitResult
          });
          if (typeof options.onSubmitSuccess === "function") {
            options.onSubmitSuccess(submitResult);
          }

          modalInstance.hide();
        } else if (!submitResult.isSuccess && typeof options.onSubmitError === "function") {
          triggerEvent(modalElement, "bs5:dialog:form:submit:error", {
            options: options,
            formEl: form,
            formAction: form.action,
            formMethod: form.method,
            formData: new FormData(form),
            submitResult: submitResult
          });
          if (typeof options.onSubmitError === "function") {
            options.onSubmitError(submitResult);
          }
          message(submitResult.content);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }



    return {
    el: modalElement,
    content: content,
    options: options
  };
}
