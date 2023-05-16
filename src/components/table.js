import {
    makeRequest,
    btnGetContent,
    btnSubmitForm,
    makeDraggable,
    makeResizable,
    genDialogId,
    setModalWrapper,
    replayLock,
    triggerEvent,
    observeElement,
    isUrlOrPath
} from "../utils";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";
import { makeIcon } from "../resource/icons";

export async function table(content, options = {}) {
  const defaultOptions = {
    title: "",
    type: "danger",
    size: "lg",
    id: "",
    btnOkText: "",
    btnCancelText: "",
    onOk: null
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
  observeElement(modalElement, {
    created: () => {
      options.onShow?.(modalElement);
      triggerEvent(modalElement, "bs5:dialog:load:created", { options: options, el: modalElement });
    },
    rendered: () => {
      triggerEvent(modalElement, "bs5:dialog:load:rendered", { options: options, el: modalElement });
      const modalInstance = bs5Modal.getOrCreateInstance(modalElement);

      let selectedData = {};

      modalElement.addEventListener('click',e=>{
        if (e.target.tagName==='A' && e.target.classList.contains('page-link')){
          e.preventDefault();
          btnGetContent(e.target).then(data => {
            if (data.isSuccess) {
              modalElement.querySelector(".modal-body").innerHTML=data.content;
            }
          });
        }

        if (e.target.tagName==='TD'){
          let tr = e.target.closest('tr');
          console.log(tr.nextElementSibling )
          tr.parentElement.querySelectorAll('tr').forEach(r => r.classList.remove("selected","table-success"))
          tr.classList.add('selected','table-success');
          tr.querySelectorAll("td").forEach((cell, index) => {
            selectedData[`column${index}`] = cell.innerText;
          });
        }
        if (e.target.tagName==='BUTTON' && e.target.classList.contains('btn-ok')){
          e.preventDefault();
          console.log(selectedData);
          options.onOk?.(selectedData);
          triggerEvent(modalElement, "bs5:dialog:table:selected", { options: options, data: selectedData });
          modalInstance.hide();
        }

      })

      const submitBtns = modalElement.querySelectorAll("[type=submit]");
      if (submitBtns) {
        submitBtns.forEach(submitBtn => {
          submitBtn.addEventListener("click", e => {
            e.preventDefault();
            btnSubmitForm(e.target).then(data => {
              if (data.isSuccess) {
                modalElement.querySelector(".modal-body").innerHTML=data.content;
              }
            });
          });
        });
      }

    },
    hidden: () => {
      triggerEvent(modalElement, "bs5:dialog:load:hidden", { options: options, el: modalElement });
    }
  });

    if (isUrlOrPath(content)) {
        let apiUrl = content;
        const res = await makeRequest(apiUrl, "GET");
        content = res.content;
    }

  modalElement.innerHTML = `<div class="modal-dialog  ${
    "modal-" + options.size
  } modal-dialog-centered modal-dialog-scrollable" role="document">
      <div class="modal-content shadow">
      <div class="modal-status bg-${options.type}"></div>
         <div class="modal-header">
            <h5 class="modal-title">${options.title}</h5>
            <div class='modal-maximize-toggle'></div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div class="modal-body" style="height:auto">
            ${content}
         </div>
         <div class="modal-footer">
            <button type="button" class="btn me-auto" data-bs-dismiss="modal">${options.btnCancelText || i18n.getConfig("cancel")}</button>
            <button type="button" class="btn btn-ok btn-${options.type}">${
    options.btnOkText || i18n.getConfig("save")
  }</button>
         </div>
      </div>
    </div>`;
  makeDraggable(modalElement, modalElement.querySelector(".modal-header"));
  makeResizable(modalElement.querySelector(".modal-content"));
  const modalInstance = bs5Modal.getOrCreateInstance(modalElement, {
    keyboard: false,
    focus: true,
    backdrop: false
  });
  modalInstance.show();
}
