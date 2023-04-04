/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */
import "./bs5dialog.css";
import bootstrap from "bootstrap";
import Draggabilly from "draggabilly";
import axios from "axios";
import { getTargetElement, getUrl, isUrlOrPath, postUrl } from "./libs.js";
import * as i18n from "./i18n.js";

var modal;
var modalId;

function setModalId() {
  modalId = "modal-" + Math.floor(Math.random() * 1000000);
  return modalId;
}

function setModalWrapper() {
  modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.setAttribute("data-bs-backdrop", "static");
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("data-bs-keyboard", "false");
  modal.setAttribute("id", setModalId());
  return modal;
}

/**
 *  show a dialog by a remote page
 * @param {string} content 
 * @param {Object} options
 * @property {string}[options.title] title
 */
async function open(content,options = {}) {
  const defaultOptions = {
    title: "",
    type: "secondary",
    size: "md",
    title:"",
    size:'lg',
    backdrop: "false",
    drag: true,
    onStart: function () {},
    onShown: function () {},
    onSubmit: function () {},
    onSubmitSuccess: function () {},
    onSubmitError: function () {},
    onSubmitDone: function () {}
  };
  options = { ...defaultOptions, ...options };
  options.onStart();
  const modal = setModalWrapper();
  if (isUrlOrPath(content)) {
    let apiUrl = content;
    content =await getUrl(apiUrl)
     console.log('cur content',content);
  }

  modal.innerHTML = `
  <div class="modal-dialog modal-${options.size} modal-dialog-centered">
  <div class="modal-content">
  <div class="modal-header">
  <h5 class="modal-title">${options.title || icon('pinned')}</h5>
  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
    <div class="modal-status bg-${options.type}"></div>
    <div class="modal-body">
      <h5 class="modal-title mb-1">${options.title}</h5>
      <div class="text-muted">${content}</div>
    </div>
    <div class="modal-footer">
    <div class="w-100">
      <div class="row">
        <div class="col">
          <button type="button" class="w-100 btn btn-default" data-bs-dismiss="modal">${i18n.getConfig("cancel")}</button>
        </div>
        <div class="col">
          <button type="button" class="w-100 btn btn-default btn-${options.type} btn-ok">${i18n.getConfig("confirm")}</button>
        </div>
      </div>
    </div>
    </div>
  </div>
</div>

`;

  document.body.appendChild(modal);
  const modalEl = new bootstrap.Modal(modal);
  modalEl.show();
  //hide form submit button and replace to btn-ok
  modal.addEventListener("shown.bs.modal", () => {
    options.onShown(modal);
  });

  const form = modal.querySelector('form');
  if(form.length){
    const submitBtn = form.querySelector('button[type="submit"]');
    const okBtn = modal.querySelector('.modal-footer .btn-ok');
    submitBtn.style.display = 'none';
    okBtn.textContent = submitBtn.textContent;
    okBtn.setAttribute('type', 'submit');
    okBtn.addEventListener('click', function() {
      replayLock(okBtn);
      options.onSubmit(modal);
      form.submit();
    });
    form.addEventListener('submit', function(event) {
     
      event.preventDefault();
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
      })
      .then(response => {
        if (response.ok) {
          options.onSubmitSuccess(response.data, modal);
          modalEl.hide();
          form.reset();
        } else {
          options.onSubmitError(error, modal);
          // Display error message
          const errorDiv = document.createElement('div');
          errorDiv.classList.add('alert', 'alert-danger');
          errorDiv.textContent = 'There was an error submitting the form. Please try again.';
          form.prepend(errorDiv);
        }
      }).then(()=>{
        options.onSubmitDone(modal);
      });
    });
     // Hide any error messages when the modal is hidden

     modal.addEventListener('hide.bs.modal', function() {
    const errorDiv = form.querySelector('.alert-danger');
    if (errorDiv) {
      errorDiv.remove();
    }
  });

  }

  return { modal };



 
}

/**
 *
 * @param {string} message
 * @param {string} apiUrl
 * @param {string} method
 * @param {Function} onOk
 */
function confirmRequest(message, apiUrl, method = "DELETE", onOk = () => {}) {
  const modal = setModalWrapper();
  modal.innerHTML = `
    <div class="modal-dialog modal-sm modal-dialog-centered">
      <div class="modal-content">
        <div id="modal-header" class="modal-header">
          <h5 class="modal-title">${i18n.getConfig("confirm")}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ${message}
        </div>
        <div class="modal-footer">
<!--          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>-->
          <button type="button" class="btn btn-default btn-primary" id="ok-btn">${i18n.getConfig("ok")}</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  const modalEl = new bootstrap.Modal(modal);
  modalEl.show();
  const modalHeader = modal.querySelector("#modal-header");
  new Draggabilly(modal, { handle: modalHeader });
  const okBtn = modal.querySelector("#ok-btn");
  okBtn.addEventListener("click", async () => {
    replayLock(okBtn);
    if (!apiUrl) {
      if (typeof onOk === "function") {
        onOk(modal);
      }
      modalEl.hide();
    } else {
      try {
        let data = {};
        switch (method.toUpperCase()) {
          case "PUT":
          case "PATCH":
          case "DELETE":
            data = { _method: method.toUpperCase() };
            break;
        }
        if (method.toUpperCase() === "DELETE") {
          data = { _method: "DELETE" };
        }
        const response = await axios({
          method: method || "post",
          url: apiUrl,
          data
        });
        if (typeof onOk === "function") {
          onOk(response, modal);
        }
        modalEl.hide();
      } catch (error) {
        console.error(error);
        // Handle errors if the POST request failed
      }
    }
    modal.remove();
  });
}

/**
 *
 * @param {string} title
 * @param {string} content
 * @param {Object} options
 * @param {string} [options.title=''] - title
 * @property {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark'|'link')} [options.type=''] - type
 * @property {('sm'|'md')} [options.size] modal size,default "sm"
 * @property {('success'|'ok'|'fail'|'error'|'info'|'help'|'alert'|'warn')} [options.icon='ok'] - Icon
 * @param {string} [options.btnText = 'ok'] - btn text
 * @param {function} [options.onOk] - callback function
 */
function alert(content, options = {}) {
  const defaultOptions = {
    title: "",
    type: "secondary",
    size: "sm",
    btnText: "",
    icon: "ok",
    icon_color: "",
    icon_custom: "",
    onOk: null,
    timeout: 0
  };
  options = { ...defaultOptions, ...options };
  const modal = setModalWrapper();
  modal.innerHTML = `
  <div class="modal-dialog modal-${options.size || "sm"} modal-dialog-centered">
  <div class="modal-content">
    <div class="modal-status bg-${options.type}"></div>
    <div class="modal-body text-center py-4">
    ${options.icon_custom || icon(options.icon, options.icon_color || options.type) || ""}
      <h5 class="modal-title mb-1">${options.title}</h5>
      <div class="text-muted">${content}</div>
    </div>
    <div class="modal-footer">
      <div class="w-100">
        <div class="row">
          <div class="col">
            <button type="button" class=" w-100 btn btn-default btn-ok btn-${options.type}">${
    options.btnText || i18n.getConfig("ok")
  }</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    `;
  document.body.appendChild(modal);
  const modalEl = new bootstrap.Modal(modal);
  modalEl.show();
  const okBtnEl = modal.querySelector(".modal-footer .btn-ok");
  okBtnEl.addEventListener("click", () => {
    replayLock(okBtnEl);
    if (typeof options.onOk === "function") {
      options.onOk();
    }
    modalEl.hide();
  });
  if (options.timeout) {
    modal.querySelector(".modal-footer").style.display = "none";
    setTimeout(() => {
      modalEl.hide();
    }, options.timeout);
  }
}

/**
 * confirm dialog
 * @param {*} message
 * @param {*} onConfirm
 * @param {*} title
 * @param {*} type
 */
function confirm(content = "", options = {}) {
  const defaultOptions = {
    title: i18n.getConfig("sure"),
    type: "secondary",
    size: "sm",
    btnText: "",
    icon: "alert",
    icon_color: "",
    icon_custom: "",
    onConfirm: null
  };
  options = { ...defaultOptions, ...options };

  const modal = setModalWrapper();
  modal.innerHTML = `
  <div class="modal-dialog modal-${options.size} modal-dialog-centered">
  <div class="modal-content">
    <div class="modal-status bg-${options.type}"></div>
    <div class="modal-body text-center py-4">
    ${options.icon_custom || icon(options.icon, options.icon_color || options.type) || ""}
    <h5 class="modal-title mb-1">${options.title}</h5>
      <div class="text-muted">${content}</div>
    </div>
    <div class="modal-footer">
      <div class="w-100">
        <div class="row">
          <div class="col">
            <button type="button" class="w-100 btn btn-default" data-bs-dismiss="modal">${i18n.getConfig("cancel")}</button>
          </div>
          <div class="col">
            <button type="button" class="w-100 btn btn-default btn-${options.type} btn-ok">${i18n.getConfig("confirm")}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
  document.body.appendChild(modal);
  const modalEl = new bootstrap.Modal(modal);
  modalEl.show();
  const okBtnEl = modal.querySelector(".modal-footer .btn-ok");
  okBtnEl.addEventListener("click", () => {
    replayLock(okBtnEl);
    if (typeof options.onConfirm === "function") {
      options.onConfirm();
    }
    modalEl.hide();
  });
}

/**
 * show promt dialog
 * @param {*} options
 */
function prompt(content, options = {}) {
  const defaultOptions = {
    title: "",
    type: "secondary",
    size: "md",
    btnText: "",
    icon: "code",
    icon_color: "",
    icon_custom: "",
    secret: false,
    onConfirm: null
  };
  options = { ...defaultOptions, ...options };
  const modal = setModalWrapper();
  modal.innerHTML = `
  <div class="modal-dialog modal-${options.size} modal-dialog-centered">
  <div class="modal-content">
    <div class="modal-status bg-${options.type}"></div>
    <div class="modal-body text-center py-4">
      ${options.icon_custom || icon(options.icon, options.icon_color || options.type) || ""}
      <h5 class="modal-title mb-2">${options.title}</h5>
      <div class="text-muted mb-2">${content}</div>
      <input class="form-control" type="${options.secret === true ? "password" : "text"}" placeholder="">
    </div>
    <div class="modal-footer">
      <div class="w-100">
        <div class="row">
          <div class="col">
            <button type="button" class="w-100 btn btn-default" data-bs-dismiss="modal">${i18n.getConfig("cancel")}</button>
          </div>
          <div class="col">
            <button type="button" class="w-100 btn btn-default btn-${options.type} btn-ok">${i18n.getConfig("ok")}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `;

  document.body.appendChild(modal);
  const modalEl = new bootstrap.Modal(modal);
  modalEl.show();
  const okBtnEl = modal.querySelector(".modal-footer .btn-ok");
  const inputEl = modal.querySelector(".modal-body input");
  okBtnEl.addEventListener("click", () => {
    console.log(inputEl.value);
    replayLock(okBtnEl);
    if (typeof options.onConfirm === "function") {
      options.onConfirm(inputEl.value);
    }
    modalEl.hide();
  });
}

/**
 * show a message
 * @param {*} message
 * @param {*} options
 */
function msg(message, options = {}) {
  const DEFAULT_OPTIONS = {
    position: "center",
    duration: 1500,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    textColor: "white",
    fontsize: "0.75rem"
  };

  const { position, duration, backgroundColor, textColor, fontsize } = {
    ...DEFAULT_OPTIONS,
    ...options
  };
  const messageBox = document.createElement("div");
  messageBox.classList.add("bs5-dialog-msg");
  messageBox.style.backgroundColor = backgroundColor;
  messageBox.style.color = textColor;
  messageBox.style.fontSize = fontsize;
  messageBox.textContent = message;

  // Add class based on position option
  const positionClass = `bs5-dialog-msg-${position}`;
  messageBox.classList.add(positionClass);

  document.body.appendChild(messageBox);
  setTimeout(() => {
    messageBox.classList.add("bs5-dialog-msg-hide");
    setTimeout(() => {
      messageBox.remove();
    }, 500);
  }, duration);
}

/**
 * show tabs dialog
 * @param {*} tabs
 * @param {*} width
 */
function tabs(tabs, width = "500px") {
  const modal = `
    <div class="modal fade" id="tabsModal" tabindex="-1" aria-labelledby="tabs-modal" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" style="max-width: ${width}">
        <div class="modal-content">
          <div class="modal-header bg-header" style="padding: 0;">
            <nav class="nav nav-tabs bg-header" style="height: 100%;border-bottom: none;">
              ${tabs
                .map(
                  (tab, index) => `
              <button class="nav-link ${
                index === 0 ? "active" : ""
              }" id="tab${index}-tab" data-bs-toggle="tab" data-bs-target="#tab${index}" type="button" role="tab" aria-controls="tab${index}" aria-selected="${
                    index === 0 ? "true" : "false"
                  }" style="height: 3.5rem;border-bottom-color:transparent;border-radius: ${index === 0 ? "0.25rem 0.25rem 0 0" : "none"};">
                ${tab.title}
              </button>`
                )
                .join("")}
            </nav>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body tab-content">
            ${tabs
              .map(
                (tab, index) => `
              <div class="tab-pane fade ${
                index === 0 ? "show active" : ""
              }" id="tab${index}" role="tabpanel" aria-labelledby="tab${index}-tab">
                ${tab.content}
              </div>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modal);
  const modalEl = document.getElementById("tabsModal");
  const modalInstance = new bootstrap.Modal(modalEl);
  modalInstance.show();
}

/**
 *create spinner
 * @param {*} animationName
 * @returns
 */
function createSpinner(animationName) {
  const spinnerTypes = {
    plane: `<div class="sk-plane"></div>`,
    chase: `<div class="sk-chase">
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
</div>`,
    bounce: `<div class="sk-bounce">
  <div class="sk-bounce-dot"></div>
  <div class="sk-bounce-dot"></div>
</div>`,
    wave: `<div class="sk-wave">
  <div class="sk-wave-rect"></div>
  <div class="sk-wave-rect"></div>
  <div class="sk-wave-rect"></div>
  <div class="sk-wave-rect"></div>
  <div class="sk-wave-rect"></div>
</div>`,
    pulse: `<div class="sk-pulse"></div>`,
    flow: `<div class="sk-flow">
  <div class="sk-flow-dot"></div>
  <div class="sk-flow-dot"></div>
  <div class="sk-flow-dot"></div>
</div>`,
    swing: `<div class="sk-swing">
  <div class="sk-swing-dot"></div>
  <div class="sk-swing-dot"></div>
</div>`,
    circle: `<div class="sk-circle">
  <div class="sk-circle-dot"></div>
  <div class="sk-circle-dot"></div>
  <div class="sk-circle-dot"></div>
  <div class="sk-circle-dot"></div>
  <div class="sk-circle-dot"></div>
  <div class="sk-circle-dot"></div>
  <div class="sk-circle-dot"></div>
  <div class="sk-circle-dot"></div>
  <div class="sk-circle-dot"></div>
  <div class="sk-circle-dot"></div>
  <div class="sk-circle-dot"></div>
  <div class="sk-circle-dot"></div>
</div>`,
    circle_fade: `<div class="sk-circle-fade">
  <div class="sk-circle-fade-dot"></div>
  <div class="sk-circle-fade-dot"></div>
  <div class="sk-circle-fade-dot"></div>
  <div class="sk-circle-fade-dot"></div>
  <div class="sk-circle-fade-dot"></div>
  <div class="sk-circle-fade-dot"></div>
  <div class="sk-circle-fade-dot"></div>
  <div class="sk-circle-fade-dot"></div>
  <div class="sk-circle-fade-dot"></div>
  <div class="sk-circle-fade-dot"></div>
  <div class="sk-circle-fade-dot"></div>
  <div class="sk-circle-fade-dot"></div>
</div>`,
    grid: `<div class="sk-grid">
  <div class="sk-grid-cube"></div>
  <div class="sk-grid-cube"></div>
  <div class="sk-grid-cube"></div>
  <div class="sk-grid-cube"></div>
  <div class="sk-grid-cube"></div>
  <div class="sk-grid-cube"></div>
  <div class="sk-grid-cube"></div>
  <div class="sk-grid-cube"></div>
  <div class="sk-grid-cube"></div>
</div>`,
    fold: `<div class="sk-fold">
  <div class="sk-fold-cube"></div>
  <div class="sk-fold-cube"></div>
  <div class="sk-fold-cube"></div>
  <div class="sk-fold-cube"></div>
</div>`,
    wander: `<div class="sk-wander">
  <div class="sk-wander-cube"></div>
  <div class="sk-wander-cube"></div>
  <div class="sk-wander-cube"></div>
</div>`
    // 添加其他类型的 spinner
    // ...
  };

  return spinnerTypes[animationName] || '<div class="bs5-modal-spinner"></div>';
}

function icon(iconName, type) {
  switch (iconName) {
    case "success":
    case "ok":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="text-${type} mb-2 icon icon-tabler icon-tabler-circle-check" width="3.5rem" height="3.5rem" viewBox="0 0 24 24" stroke-width="0.75" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
      <path d="M9 12l2 2l4 -4"></path>
   </svg>
   </svg>`;
      break;
    case "fail":
    case "error":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="text-${type} mb-2 icon icon-tabler icon-tabler-circle-x" width="3.5rem" height="3.5rem" viewBox="0 0 24 24" stroke-width="0.75" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M10 10l4 4m0 -4l-4 4"></path>
     </svg>`;
    case "info":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="text-${type} mb-2 icon icon-tabler icon-tabler-info-circle" width="3.5rem" height="3.5rem" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
      <path d="M12 9h.01"></path>
      <path d="M11 12h1v4h1"></path>
   </svg>`;
      break;
    case "alert":
    case "warn":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="text-${type} mb-2 icon icon-tabler icon-tabler-alert-triangle" width="3.5rem" height="3.5rem" viewBox="0 0 24 24" stroke-width="0.75" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M10.24 3.957l-8.422 14.06a1.989 1.989 0 0 0 1.7 2.983h16.845a1.989 1.989 0 0 0 1.7 -2.983l-8.423 -14.06a1.989 1.989 0 0 0 -3.4 0z"></path>
      <path d="M12 9v4"></path>
      <path d="M12 17h.01"></path>
   </svg>`;
      break;
    case "help":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="text-${type} mb-2 icon icon-tabler icon-tabler-help" width="3.5rem" height="3.5rem" viewBox="0 0 24 24" stroke-width="0.75" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M12 17l0 .01"></path>
        <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4"></path>
     </svg>`;
    case "edit":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="text-${type} mb-2 icon icon-tabler icon-tabler-edit" width="3.5rem" height="3.5rem" viewBox="0 0 24 24" stroke-width="0.75" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
      <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
      <path d="M16 5l3 3"></path>
   </svg>`;
    case "code":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="text-${type} mb-2 icon icon-tabler icon-tabler-code" width="3.5rem" height="3.5rem" viewBox="0 0 24 24" stroke-width="0.75" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M7 8l-4 4l4 4"></path>
    <path d="M17 8l4 4l-4 4"></path>
    <path d="M14 4l-4 16"></path>
 </svg>`;
      break;
      case 'drag':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-drag-drop" width="24" height="24" viewBox="0 0 24 24" stroke-width="0.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M19 11v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
        <path d="M13 13l9 3l-4 2l-2 4l-3 -9"></path>
        <path d="M3 3l0 .01"></path>
        <path d="M7 3l0 .01"></path>
        <path d="M11 3l0 .01"></path>
        <path d="M15 3l0 .01"></path>
        <path d="M3 7l0 .01"></path>
        <path d="M3 11l0 .01"></path>
        <path d="M3 15l0 .01"></path>
     </svg>`
        break;
        case 'pinned':
          return `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pinned" width="24" height="24" viewBox="0 0 24 24" stroke-width="0.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M9 4v6l-2 4v2h10v-2l-2 -4v-6"></path>
          <path d="M12 16l0 5"></path>
          <path d="M8 4l8 0"></path>
       </svg>`
       default:
        return `.`
  }
}

/**
 *show loading
 * @param {*} element
 * @param {*} options
 * @returns
 */
function showLoading(element = document.body, animationName, options = {}) {
  const { color = "#333", size = "40px", bg, timeout = 0 } = options;
  const targetElement = getTargetElement(element);
  if (!targetElement) {
    return;
  }
  // 如果已经存在 loading 动画，直接返回
  if (targetElement.querySelector(".bs5-modal-loading")) {
    return;
  }
  targetElement.style.position = "relative";
  var targetZIndex = targetElement.style.zIndex;
  const spinnerDiv = createSpinner(animationName);
  const rootStyles = `
  :root {
    --sk-color: ${options.color || "#333"};
    --sk-size: ${options.size || "40px"};
  }
`;
  document.head.insertAdjacentHTML("beforeend", `<style>${rootStyles}</style>`);
  const bgColor = options.bg ? `background-color: ${options.bg}` : "background-color: rgba(0,0,0,0.3);";
  const loadingDiv = `
  <div class="bs5-modal-loading" style="z-index: ${targetZIndex + 1}; position: absolute; top: 0; left: 0; right: 0; bottom: 0; ${bgColor}">
  ${spinnerDiv}
</div>
  `;

  targetElement.insertAdjacentHTML("afterbegin", loadingDiv);
  targetElement.style.cursor = "wait";
  if (timeout > 0) {
    setTimeout(() => {
      hideLoading(element);
    }, timeout);
  }
  return targetElement;
}

/**
 * hide loading
 * @param {*} element
 * @returns
 */
function hideLoading(element = document.body) {
  const targetElement = getTargetElement(element);
  if (!targetElement) {
    return;
  }
  const existingLoadingDiv = targetElement.querySelector(".bs5-modal-loading");
  if (existingLoadingDiv) {
    existingLoadingDiv.parentNode.style.cursor = "auto";
    existingLoadingDiv.remove();
  }
}

/**
 * add disabled class ，default lock 1s timeout
 * @param {*} element
 * @param {*} timeout
 */
function replayLock(element, timeout = 1000) {
  const targetElement = getTargetElement(element);
  targetElement.classList.add("disabled");
  targetElement.setAttribute("disabled", "disabled");
  setTimeout(() => {
    targetElement.classList.remove("disabled");
    targetElement.removeAttribute("disabled");
  }, timeout);
}

export { i18n, alert, confirm, msg, prompt, tabs, showLoading, hideLoading, open, confirmRequest, replayLock };
