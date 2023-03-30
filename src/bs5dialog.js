/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */
import "./bs5dialog.css";
import bootstrap from "bootstrap";
import Draggabilly from "draggabilly";
import axios from "axios";
import * as i18n from "./i18n.js";

/**
 *  show a dialog by a remote page
 * @param {*} apiUrl
 * @param {*} modalTitle
 * @param {*} option
 */
function page(
  apiUrl,
  modalTitle,
  option = {
    backdrop: "false",
    drag: true,
    onStart: function () {},
    onShown: function () {},
    onSubmit: function () {},
    onSubmitSuccess: function () {},
    onSubmitError: function () {},
    onSubmitDone: function () {},
  }
) {
  option.onStart();
  if (!modalTitle) {
    modalTitle = "";
  }
  axios
    .get(apiUrl)
    .then(function (response) {
      const modal = document.createElement("div");
      modal.classList.add("modal", "fade");
      modal.setAttribute("data-bs-backdrop", option.backdrop);
      modal.setAttribute("data-bs-keyboard", "false");
      modal.innerHTML = `
        <div class="modal-dialog modal-lg  modal-dialog-centered">
          <div class="modal-content shadow">
            <div class="modal-header ${
              option.drag ? "cursor-move" : ""
            } "   id="modal-header">
              <h5 class="modal-title">${modalTitle}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" style="max-height: 80vh; overflow-y: auto;">
              ${response.data}
            </div>
            ${
              response.data.includes("form")
                ? `
            <div class="modal-footer">
                      <button type="button" class="btn btn-default me-auto" data-bs-dismiss="modal">${i18n.getConfig(
                        "cancel"
                      )}</button>
              <button type="button" class="btn btn-primary" id="submit-btn">${i18n.getConfig(
                "ok"
              )}</button>
            </div>
            `
                : ""
            }
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      const modalEl = new bootstrap.Modal(modal);
      modalEl.show();
      const firstFormEl = modal.querySelector("input, textarea, select");
      if (firstFormEl) {
        firstFormEl.focus();
      }
      const modalHeader = modal.querySelector("#modal-header");
      if (option.drag) {
        new Draggabilly(modal, { handle: modalHeader });
      }
      modal.addEventListener("shown.bs.modal", () => {
        option.onShown(modal);
      });
      const submitBtn = modal.querySelector("#submit-btn");
      if (submitBtn) {
        submitBtn.addEventListener("click", function () {
          replayLock(submitBtn);
          const form = modal.querySelector("form");
          const formData = new FormData(form);
          option.onSubmit(modal);
          submitBtn.innerHTML = i18n.getConfig("save") + "...";
          axios
            .post(form.action, formData, {
              validateStatus: function (status) {
                return (status >= 200 && status < 300) || status === 422;
              },
            })
            .then(function (response) {
              submitBtn.innerHTML = i18n.getConfig("save");
              if (response && response.status === 200) {
                console.log(response);
                modalEl.hide();
                modal.remove();
                console.log(modalEl);
                option.onSubmitSuccess(response.data, modal);
              }
            })
            .catch(function (error) {
              option.onSubmitError(error, modal);
            })
            .finally(function () {
              option.onSubmitDone(modal);
            });
        });
      }
      return { modal };
    })
    .catch(function (error) {
      console.error(error);
    });
}

/**
 *
 * @param {string} message
 * @param {string} apiUrl
 * @param {string} method
 * @param {Function} onOk
 */
function confirmRequest(message, apiUrl, method = "DELETE", onOk = () => {}) {
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.setAttribute("data-bs-backdrop", "static");
  modal.setAttribute("data-bs-keyboard", "false");
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
          <button type="button" class="btn btn-primary" id="ok-btn">${i18n.getConfig(
            "ok"
          )}</button>
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
          data,
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
 * alert dialog
 * @param {*} title
 * @param {*} content
 * @param {*} onSave
 * @param {*} type
 * @param {*} btnText
 */
function alert(content, onOk, title, type = "primary") {
  // Get the modal template and clone it
  const modalTemplate = document.createElement("template");
  modalTemplate.innerHTML = `
      <div class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
          <div class="modal-header bg-${type}">
            <h5 class="modal-title text-${
              [
                "success",
                "primary",
                "secondary",
                "danger",
                "dark",
                "black",
              ].includes(type)
                ? "white"
                : "dark"
            }">${title || "⚠️"}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
            <div class="modal-body">
              <span>${content}</span>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-ok btn-${type}">${i18n.getConfig(
    "ok"
  )}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  const modalEl = modalTemplate.content.querySelector(".modal");

  const okBtnEl = modalEl.querySelector(".modal-footer .btn-ok");
  okBtnEl.addEventListener("click", () => {
    replayLock(okBtnEl);
    onOk();
    modal.hide();
  });
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

/**
 * confirm dialog
 * @param {*} options
 */
function confirm(message, onConfirm = function () {}, title, type = "") {
  const modal = `
    <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-${type}">
            <h5 class="modal-title text-${
              [
                "success",
                "primary",
                "secondary",
                "danger",
                "dark",
                "black",
              ].includes(type)
                ? "white"
                : "dark"
            }">${title || "⚠️"}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${message}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-bs-dismiss="modal">${i18n.getConfig(
              "cancel"
            )}</button>
            <button type="button" class="btn btn-primary btn-ok">${i18n.getConfig(
              "confirm"
            )}</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modal);
  const modalEl = document.querySelector(".modal");
  const modalInstance = new bootstrap.Modal(modalEl);
  modalInstance.show();
  const okBtnEl = modalEl.querySelector(".modal-footer .btn-ok");
  okBtnEl.addEventListener("click", () => {
    replayLock(okBtnEl);
    onConfirm();
    modalInstance.hide();
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
    fontsize: "0.75rem",
  };

  const { position, duration, backgroundColor, textColor, fontsize } = {
    ...DEFAULT_OPTIONS,
    ...options,
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
 * show promt dialog
 * @param {*} options
 */
function prompt(message, onOk, type = "", title = "") {
  const modal = `
    <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-${type}">
            <h5 class="modal-title" id="modal-title">${title}</h5>
          </div>
          <div class="modal-body">
            <p>${message}</p>
            <input class="form-control" type="text" placeholder="Enter text here...">
          </div>
          <div class="modal-footer">
            <button class="btn"  data-bs-dismiss="modal">${i18n.getConfig(
              "cancel"
            )}</button>
            <button class="btn btn-ok">${i18n.getConfig("ok")}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const modalEl = document.createElement("div");
  modalEl.innerHTML = modal;
  document.body.appendChild(modalEl);
  new bootstrap.Modal(modalEl.querySelector(".modal")).show();

  const okBtnEl = modalEl.querySelector(".modal-footer .btn-ok");
  const inputEl = modalEl.querySelector(".modal-body input");

  okBtnEl.addEventListener("click", () => {
    replayLock(okBtnEl);
    onOk(inputEl.value);
    modalEl.remove();
  });
}

/**
 * show tabs dialog
 * @param {*} tabs
 * @param {*} width
 */
function tabs(tabs, width = "500px") {
  const modal = `
    <div class="modal fade" id="tabsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                  }" style="height: 3.5rem;border-bottom-color:transparent;border-radius: ${
                    index === 0 ? "0.25rem 0.25rem 0 0" : "none"
                  };">
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
</div>`,
    // 添加其他类型的 spinner
    // ...
  };

  return spinnerTypes[animationName] || '<div class="bs5-modal-spinner"></div>';
}

/**
 *
 * @param {*} element
 * @returns
 */
function getTargetElement(element) {
  if (element instanceof Element) {
    return element;
  } else if (element.startsWith("#")) {
    return document.getElementById(element.slice(1));
  } else if (element.startsWith(".")) {
    return document.querySelector(element);
  } else {
    console.error("Invalid element provided.");
    return null;
  }
}

/**
 * createLoadingDiv
 * @param {*} spinnerDiv
 * @param {*} options
 * @returns
 */
function createLoadingDiv(spinnerDiv, options) {
  const rootStyles = `
    :root {
      --sk-color: ${options.color || "#333"};
      --sk-size: ${options.size || "40px"};
    }
  `;

  document.head.insertAdjacentHTML("beforeend", `<style>${rootStyles}</style>`);

  const bgColor = options.bg
    ? `background-color: ${options.bg}`
    : "background-color: transparent;";

  return `
    <div class="bs5-modal-loading" style="z-index: 9999; position: absolute; top: 0; left: 0; right: 0; bottom: 0; ${bgColor}">
      ${spinnerDiv}
    </div>
  `;
}

/**
 *show loading
 * @param {*} element
 * @param {*} options
 * @returns
 */
function showLoading(element = document.body, options = {}) {
  const {
    animationName = "default",
    color = "#333",
    size = "40px",
    bg,
    timeout = 0,
  } = options;
  const targetElement = getTargetElement(element);
  if (!targetElement) {
    return;
  }
  // 如果已经存在 loading 动画，直接返回
  if (targetElement.querySelector(".bs5-modal-loading")) {
    return;
  }
  targetElement.style.position = "relative";
  const spinnerDiv = createSpinner(animationName);
  const loadingDiv = createLoadingDiv(spinnerDiv, { color, size, bg });
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

export {
  i18n,
  alert,
  confirm,
  msg,
  prompt,
  tabs,
  showLoading,
  hideLoading,
  page,
  confirmRequest,
  replayLock,
};
