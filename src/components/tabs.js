import { setModalWrapper, replayLock } from "../libs";
import { getIconHtml } from "../templates.js";
import * as i18n from "../i18n.js";
import { Modal as bs5Modal } from "bootstrap";


export function tabs(tabs, width = "500px") {
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
    const modalInstance = new bs5Modal(modalEl);
    modalInstance.show();
  }