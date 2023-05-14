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
            triggerEvent(modalElement, "bs5:dialog:load:created", { options: options, el: modalElement });
        },
    });

    if (isUrlOrPath(content)) {
        let apiUrl = content
        const res = await makeRequest(apiUrl, "GET");
        content = res.content;
    }

    modalElement.innerHTML = `<div class="modal-dialog  ${options.maximize ? "modal-fullscreen" : "modal-" + options.size} ${options.centered ? "modal-dialog-centered" : ""
    } ${options.scrollable ? "modal-dialog-scrollable" : ""}" role="document">
      <div class="modal-content shadow">
      <div class="modal-status bg-${options.type}"></div>
         <div class="modal-header">
            <h5 class="modal-title">${options.title}</h5>
            <div class='modal-maximize-toggle'></div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div class="modal-body" ${options.scrollable ? "style='height:auto'" : ""}>
            ${content}
         </div>
         <div class="modal-footer">
            <button type="button" class="btn me-auto" data-bs-dismiss="modal">${options.btnCancelText || i18n.getConfig("cancel")}</button>
            <button type="button" class="btn btn-ok btn-${options.type}" onclick="checkTable()">${options.btnOkText || i18n.getConfig("save")}</button>
         </div>
      </div>
    </div>`;
    makeDraggable(modalElement, modalElement.querySelector(".modal-header"));
    makeResizable(modalElement.querySelector(".modal-content"));
    const modalInstance = bs5Modal.getOrCreateInstance(modalElement, {
        keyboard: options.keyboard,
        focus: options.focus,
        backdrop: options.backdrop
    });
    modalInstance.show();

    function checkTable() {
        const table = modalElement.querySelector('table');
        if (!table) {
            console.error('Table not found');
            return;
        }
        const selectedRows = table.querySelectorAll('tr.selected');
        if (selectedRows.length === 0) {
            alert('Please select a row');
            return;
        }
        const selectedData = [];
        selectedRows.forEach(row => {
            const rowData = {};
            row.querySelectorAll('td').forEach((cell, index) => {
                rowData[`column${index}`] = cell.innerText;
            });
            selectedData.push(rowData);
        });
        options.onOk?.(selectedData);
        modalInstance.hide();
    }
    const rows = modalElement.querySelectorAll('tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            rows.forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
        });
    });
    const pageLinks = modalElement.querySelectorAll('a.page-link');
    if (pageLinks) {
        pageLinks.forEach(pageLink => {
            pageLink.addEventListener('click', async () => {
                const url = pageLink.getAttribute('href');
                const res = await makeRequest(url, 'GET');
                const table = modalElement.querySelector('table');
                table.innerHTML = res.content;
            });
        });
    }


}



