import { Dropdown, Tooltip, Popover, Collapse, Alert, Toast, Carousel, Offcanvas, ScrollSpy, Tab, Button, Modal } from "bootstrap";

/**
 * Initializes Bootstrap 5.3 components within a given element.
 * @param {HTMLElement} element - The element to search for Bootstrap components.
 */
export function initializeBootstrapComponents(element) {
    // Initialize Dropdowns
        // const dropdowns = element.querySelectorAll('[data-bs-toggle="dropdown"]');
        const dropdownElementList = document.querySelectorAll('.dropdown-toggle,[data-bs-toggle="dropdown"]')
        const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new Dropdown(dropdownToggleEl))

    // Initialize Tooltips
    const tooltips = element.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        if (!Tooltip.getInstance(tooltip)) {
            new Tooltip(tooltip);
        }
    });

    // Initialize Popovers
    const popovers = element.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach(popover => {
        if (!Popover.getInstance(popover)) {
            new Popover(popover);
        }
    });

    // Initialize Collapses
    const collapses = element.querySelectorAll('[data-bs-toggle="collapse"]');
    collapses.forEach(collapse => {
        if (!Collapse.getInstance(collapse)) {
            new Collapse(collapse, {
                toggle: false
            });
        }
    });

    // Initialize Alerts
    const alerts = element.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (!Alert.getInstance(alert)) {
            new Alert(alert);
        }
    });

    // Initialize Toasts
    const toasts = element.querySelectorAll('.toast');
    toasts.forEach(toast => {
        if (!Toast.getInstance(toast)) {
            new Toast(toast);
        }
    });

    // Initialize Carousels
    const carousels = element.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        if (!Carousel.getInstance(carousel)) {
            new Carousel(carousel);
        }
    });

    // Initialize Offcanvas
    const offcanvases = element.querySelectorAll('.offcanvas');
    offcanvases.forEach(offcanvas => {
        if (!Offcanvas.getInstance(offcanvas)) {
            new Offcanvas(offcanvas);
        }
    });

    // Initialize ScrollSpy
    const scrollspies = element.querySelectorAll('[data-bs-spy="scroll"]');
    scrollspies.forEach(scrollspy => {
        if (!ScrollSpy.getInstance(scrollspy)) {
            new ScrollSpy(document.body, {
                target: scrollspy
            });
        }
    });

    // Initialize Tabs
    const tabs = element.querySelectorAll('[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
        if (!Tab.getInstance(tab)) {
            new Tab(tab);
        }
    });

    // Initialize Modals
    const modals = element.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (!Modal.getInstance(modal)) {
            new Modal(modal);
        }
    });

    // Initialize Buttons
    const buttons = element.querySelectorAll('[data-bs-toggle="button"]');
    buttons.forEach(button => {
        if (!Button.getInstance(button)) {
            new Button(button);
        }
    });
}