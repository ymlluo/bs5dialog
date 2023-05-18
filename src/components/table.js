import {
  makeRequest,
  btnGetContent,
  submitForm,
  makeDraggable,
  makeResizable,
  genDialogId,
  setModalWrapper,
  replayLock,
  triggerEvent,
  observeElement,
  isUrlOrPath,
} from "../utils";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";
import { makeIcon } from "../resource/icons";

export async function table(content, options = {}) {
  const defaultOptions = {
    title: "",
    type: "danger",
    size: "xl",
    id: "",
    btnOkText: "",
    btnCancelText: "",
    onOk: null,
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
      triggerEvent(modalElement, "bs5:dialog:load:created", {
        options: options,
        el: modalElement,
      });
    },
    rendered: () => {
      triggerEvent(modalElement, "bs5:dialog:load:rendered", {
        options: options,
        el: modalElement,
      });
      modalElement.style.pointerEvents = "none";
      const modalInstance = bs5Modal.getOrCreateInstance(modalElement);

    },
    hidden: () => {
      triggerEvent(modalElement, "bs5:dialog:load:hidden", {
        options: options,
        el: modalElement,
      });
    },
  });
  content = await dataTable(content)
  modalElement.innerHTML = `<div class="modal-dialog  ${
    "modal-" + options.size
  } modal-dialog-centered" role="document">
      <div class="modal-content shadow">
      <div class="modal-status bg-${options.type}"></div>
         <div class="modal-header">
            <h5 class="modal-title">${options.title}</h5>
            <div class='modal-maximize-toggle'></div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div class="modal-body">
            ${content}
         </div>
         <div class="modal-footer">
            <button type="button" class="btn me-auto" data-bs-dismiss="modal">${
              options.btnCancelText || i18n.getConfig("cancel")
            }</button>
            <button type="button" class="btn btn-ok btn-${options.type}">${
    options.btnOkText || i18n.getConfig("ok")
  }</button>
         </div>
      </div>
    </div>`;
  makeDraggable(modalElement, modalElement.querySelector(".modal-header"));
  const modalInstance = bs5Modal.getOrCreateInstance(modalElement, {
    keyboard: false,
    focus: true,
    backdrop: 'static',
  });
  modalInstance.show();
  let selectedData = {};

  modalElement.addEventListener("click", (e) => {
    if (
        e.target.tagName === "A" &&
        e.target.classList.contains("page-link")
    ) {
      e.preventDefault();
      triggerEvent(modalElement, "bs5:dialog:table:update", {options: options,el:e.target.querySelector('.modal-body')});

      btnGetContent(e.target).then(async (data) => {
        if (data.isSuccess) {
          modalElement.querySelector(".modal-body").innerHTML = await dataTable(data.content);
        }
        triggerEvent(modalElement, "bs5:dialog:table:updated", {options: options,el:e.target.querySelector('.modal-body')});

      });
    }

    if (e.target.tagName === "TD") {
      let tr = e.target.closest("tr");
      tr.parentElement.querySelectorAll("tr").forEach((r) => r.classList.remove("selected", "table-success"));
      tr.classList.add("selected", "table-success");
      tr.querySelectorAll("td").forEach((cell, index) => {
        selectedData[`column${index}`] = cell.innerText.toString();
      });
    }
    if (e.target.tagName === "BUTTON" && e.target.classList.contains("btn-ok")) {
      e.preventDefault();
      options.onOk?.(selectedData);
      triggerEvent(modalElement, "bs5:dialog:table:selected", {options: options, data: selectedData,});
      modalElement.querySelectorAll("tr").forEach((r) => r.classList.remove("selected", "table-success"));
      modalInstance.hide();
    }
  });
  modalElement.addEventListener("submit", (e) => {
    e.preventDefault();
    triggerEvent(modalElement, "bs5:dialog:table:update", {options: options,el:e.target.querySelector('.modal-body')});
    submitForm(e.target).then(async (data) => {
      if (data.isSuccess) {
        modalElement.querySelector(".modal-body").innerHTML =await dataTable(data.content);
      }
      triggerEvent(modalElement, "bs5:dialog:table:updated", {options: options,el:e.target.querySelector('.modal-body')});

    });
  });

}




async function dataTable(content) {
  if (isUrlOrPath(content)) {
    let apiUrl = content;
    const res = await makeRequest(apiUrl, "GET");
    content = res.content;
  }
  if (typeof content === "string" && content.includes("<table")) {
    return content;
  }
  if (
    typeof content === "string" &&
    content.startsWith("[") &&
    content.endsWith("]")
  ) {
    content = JSON.parse(content);
  }
  if (Array.isArray(content)) {
    let tableHtml =
      '<table class="table table-hover table-bordered"><thead><tr>';
    let keys = Object.keys(content[0]);
    keys.forEach((key) => {
      tableHtml += `<th>${key}</th>`;
    });
    tableHtml += "</tr></thead><tbody>";
    content.forEach((row) => {
      if (typeof row === "object") {
        tableHtml += "<tr>";
        keys.forEach((key) => {
          tableHtml += `<td>${row[key]}</td>`;
        });
        tableHtml += "</tr>";
      }
    });
    tableHtml += "</tbody></table>";
    content = tableHtml;
  }
  return content;
}


