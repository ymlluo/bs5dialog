import { makeRequest, isUrlOrPath, makeDraggable, makeResizable, genDialogId, setModalWrapper, replayLock } from "../libs";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";
import { getIconHtml } from "../templates";
import axios from "axios";

/**
 * Opens a modal dialog with the given content and options.
 * @async
 * @param {string} content - The content to display in the modal dialog.might a url
 * @param {Object} options - The options for the modal dialog.
 * @param {string} options.title - The title of the modal dialog.
 * @param {string} options.type - The type of the modal dialog.
 * @param {string} options.size - The size of the modal dialog.
 * @param {string} options.id - The id of the modal dialog.
 * @param {boolean} options.fullscreen - Whether the modal dialog should be fullscreen.
 * @param {boolean} options.backdrop - Whether the modal dialog should have a backdrop.
 * @param {boolean} options.keyboard - Whether the modal dialog should be closable with the keyboard.
 * @param {boolean} options.draggable - Whether the modal dialog should be draggable.
 * @param {boolean} options.resizable - Whether the modal dialog should be resizable.
 * @param {string} options.btnOkText - The text to display on the OK button.
 * @param {string} options.btnCancelText - The text to display on the Cancel button.
 * @param {Function} options.onStart - The function to call when the modal dialog starts.
 * @param {Function} options.onShown - The function to call when the modal dialog is shown.
 * @param {Function} options.onSubmit - The function to call when the modal dialog is submitted.
 * @param {Function} options.onSubmitSuccess - The function to call when the modal dialog submission is successful.
 * @param {Function} options.onSubmitError - The function to call when the modal dialog submission encounters an error.
 * @param {Function} options.onSubmitDone - The function to call when the modal dialog submission is done.
 * @returns {Promise<void>}
 */
export async function open(content, options = {}) {
  const defaultOptions = {
    title: "",
    type: "danger",
    size: "lg",
    id: "",
    centered:true,
    scrollable:true,
    fullscreen:false,
    backdrop: false,
    keyboard: true,
    draggable: true,
    resizable: true,
    btnOkText: "",
    btnCancelText: "",
    onStart: function () {},
    onShown: function () {},
    onSubmit: function () {},
    onSubmitSuccess: function () {},
    onSubmitError: function () {},
    onSubmitDone: function () {}
  };
  options = { ...defaultOptions, ...options };
  options.onStart();

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
    console.log(res)
    content = res.content;
    if (content.includes('<!DOCTYPE html>') || content.includes('<html')){
        //frame 
        content = "<iframe src=\""+apiUrl+"\" width='100%' height='100%'></iframe>"
        options.scrollable=false;
    }
  }


  modalElement.innerHTML = `<div class="modal-dialog  ${options.fullscreen?"modal-fullscreen":"modal-"+options.size} ${options.centered?"modal-dialog-centered":""} ${options.scrollable?"modal-dialog-scrollable":""}" role="document">
    <div class="modal-content shadow">
    <div class="modal-status bg-${options.type}"></div>
       <div class="modal-header">
          <h5 class="modal-title">${options.title}</h5>
          ${getIconHtml('fullscreen-exit','btn-fullscreen-exit btn-fullscreen-toggle '+ (options.fullscreen?"":"d-none"),'1rem')}
          ${getIconHtml('fullscreen','btn-fullscreen btn-fullscreen-toggle '+(options.fullscreen?"d-none":""),'1rem')}
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body" style="height:60vh;">
          ${content}
       </div>
       <div class="modal-footer d-none">
          <button type="button" class="btn me-auto" data-bs-dismiss="modal">${options.btnOkText || i18n.getConfig("cancel")}</button>
          <button type="button" class="btn btn-ok btn-${options.type}" data-bs-dismiss="modal">${
    options.btnOkText || i18n.getConfig("save")
  }</button>
       </div>
    </div>
  </div>`;

  document.body.appendChild(modalElement);
  const modalInstance = bs5Modal.getOrCreateInstance(modalElement);
  modalInstance.show();

  //hide form submit button and replace to btn-ok
  modalElement.addEventListener("shown.bs.modal", () => {
    if (options.backdrop === false) {
      if (document.querySelector(".modal-backdrop")) {
        document.querySelector(".modal-backdrop").remove();
      }
      modalElement.style.pointerEvents = "none";
    }
    if (options.keyboard) {
      modalElement.setAttribute("data-bs-keyboard", options.keyboard);
    }
    if (options.draggable) {
      makeDraggable(modalElement, modalElement.querySelector(".modal-header"));
    }
    if (options.resizable) {
      makeResizable(modalElement.querySelector(".modal-content"));
    }

    options.onShown(modalElement);
  });

  var modalDialog = modalElement.querySelector('.modal-dialog')
  modalElement.querySelectorAll('.btn-fullscreen-toggle').forEach(function(el){
    el.addEventListener('click',function(){
        console.log(this);
        if(this.classList.contains('btn-fullscreen')){
            //fix drag
            modalDialog.parentElement.style.top = 0;
            modalDialog.parentElement.style.left = 0;
            //fix resize
            modalDialog.querySelector('.modal-content').style.width=null
            modalDialog.querySelector('.modal-content').style.height=null
            modalDialog.classList.add('modal-fullscreen');
            modalDialog.classList.remove("modal-"+options.size);
            this.classList.add('d-none')
            modalElement.querySelector('.btn-fullscreen-exit').classList.remove('d-none')
        }
    
        if(this.classList.contains('btn-fullscreen-exit')){
            modalDialog.parentElement.classList.remove('modal-fullscreen');
            modalDialog.classList.remove('modal-fullscreen');
            modalDialog.classList.add("modal-"+options.size);
            this.classList.add('d-none')
            modalElement.querySelector('.btn-fullscreen').classList.remove('d-none')
        }
      })
  })


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
      options.onSubmit(modalElement);
      form.submit();
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      fetch(form.action, {
        method: "POST",
        body: new FormData(form)
      })
        .then(response => {
          if (response.ok) {
            options.onSubmitSuccess(response.data, modalElement);
            modalInstance.hide();
            form.reset();
          } else {
            options.onSubmitError(error, modalElement);
            // Display error message
            const errorDiv = document.createElement("div");
            errorDiv.classList.add("alert", "alert-danger");
            errorDiv.textContent = "There was an error submitting the form. Please try again.";
            form.prepend(errorDiv);
          }
        })
        .then(() => {
          options.onSubmitDone(modalElement);
        });
    });
    // Hide any error messages when the modal is hidden

    modalElement.addEventListener("hide.bs.modal", function () {
      modalElement.classList.add("hide");
      setTimeout(function () {
        modalElement.classList.remove("show", "hide");
      }, 300);
    });
  }

  return { modalElement };
}
