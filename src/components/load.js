import { makeRequest, isUrlOrPath, makeDraggable, makeResizable, genDialogId, setModalWrapper, replayLock } from "../libs";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";
import { getIconHtml } from "../templates";
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
 * @param {boolean} options.fullscreen - Whether the modal dialog should be fullscreen.
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
    fullscreen: false,
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
    onSubmit: null,
    onSubmitSuccess: submitResult => {},
    onSubmitError: submitResult => {},
    onSubmitDone: submitResult => {}
  };
  options = { ...defaultOptions, ...options };
  let modalElement;
  if (document.getElementById(options.id)) {
    modalElement = document.getElementById(options.id);
  } else {
    modalElement = setModalWrapper();
    modalElement.setAttribute("id", options.id || genDialogId());
  }

  if (isUrlOrPath(content)) {
    let apiUrl = content;
    const res = await makeRequest(apiUrl);
    console.log(res);
    content = res.content;
    if (content.includes("<!DOCTYPE html>") || content.includes("<html")) {
      //frame
      content = `<iframe src="${apiUrl}" width='100%' height='100%'></iframe>`;
      options.scrollable = false;
    }
  }

  modalElement.innerHTML = `<div class="modal-dialog  ${options.fullscreen ? "modal-fullscreen" : "modal-" + options.size} ${
    options.centered ? "modal-dialog-centered" : ""
  } ${options.scrollable ? "modal-dialog-scrollable" : ""}" role="document">
    <div class="modal-content shadow">
    <div class="modal-status bg-${options.type}"></div>
       <div class="modal-header">
          <h5 class="modal-title">${options.title}</h5>
          ${getIconHtml("fullscreen-exit", "btn-fullscreen-exit btn-fullscreen-toggle " + (options.fullscreen ? "" : "d-none"), "1rem")}
          ${getIconHtml("fullscreen", "btn-fullscreen btn-fullscreen-toggle " + (options.fullscreen ? "d-none" : ""), "1rem")}
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body" ${options.scrollable?"style='min-height:30vh'":""}>
          ${content}
       </div>
       <div class="modal-footer d-none">
          <button type="button" class="btn me-auto" data-bs-dismiss="modal">${options.btnOkText || i18n.getConfig("cancel")}</button>
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

  modalElement.addEventListener("show.bs.modal", () => {
    if (typeof options.onShow === "function") {
      options.onShow();
    }
  });
  //hide form submit button and replace to btn-ok
  modalElement.addEventListener("shown.bs.modal", () => {
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
    modalElement.classList.add("hide");
    setTimeout(function () {
      modalElement.classList.remove("show", "hide");
    }, 300);
    if (typeof options.onHide === "function") {
      options.onHide();
    }
  });

  modalElement.addEventListener("hidden.bs.modal", function () {
    if (typeof options.onHidden === "function") {
      options.onHidden();
    }
  });

  var modalDialog = modalElement.querySelector(".modal-dialog");
  modalElement.querySelectorAll(".btn-fullscreen-toggle").forEach(function (el) {
    el.addEventListener("click", function () {
      console.log(this);
      if (this.classList.contains("btn-fullscreen")) {
        //fix drag
        modalDialog.parentElement.style.top = 0;
        modalDialog.parentElement.style.left = 0;
        //fix resize
        modalDialog.querySelector(".modal-content").style.width = null;
        modalDialog.querySelector(".modal-content").style.height = null;
        modalDialog.classList.add("modal-fullscreen");
        modalDialog.classList.remove("modal-" + options.size);
        this.classList.add("d-none");
        modalElement.querySelector(".btn-fullscreen-exit").classList.remove("d-none");
      }

      if (this.classList.contains("btn-fullscreen-exit")) {
        modalDialog.parentElement.classList.remove("modal-fullscreen");
        modalDialog.classList.remove("modal-fullscreen");
        modalDialog.classList.add("modal-" + options.size);
        this.classList.add("d-none");
        modalElement.querySelector(".btn-fullscreen").classList.remove("d-none");
      }
    });
  });

  const form = modalElement.querySelector("form");
  if (form) {
    modalElement.querySelector(".modal-footer").classList.remove("d-none");
    const submitBtn = form.querySelector('button[type="submit"]');
    const okBtn = modalElement.querySelector(".modal-footer .btn-ok");
    submitBtn.style.display = "none";
    okBtn.textContent = submitBtn.textContent;
    okBtn.setAttribute("type", "submit");
    okBtn.addEventListener("click", function (event) {
      event.preventDefault();
      replayLock(okBtn);
      if (typeof options.onSubmit === "function") {
        options.onSubmit(modalElement);
      }

      makeRequest(form.action, form.method, {}, new FormData(form))
        .then(submitResult => {
          if (submitResult.isSuccess && typeof options.onSubmitSuccess === "function") {
            options.onSubmitSuccess(submitResult);
            modalInstance.hide();
          } else if (!submitResult.isSuccess && typeof options.onSubmitError === "function") {
            options.onSubmitError(submitResult);
            message(submitResult.content);
          }
          if (typeof options.onSubmitError === "function") {
            options.onSubmitDone(submitResult);
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }
}
