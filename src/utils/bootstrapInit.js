/**
 * Check if the global bootstrap object is available, shows error message if not available
 * @returns {boolean} - Whether bootstrap is available
 */
export function checkBootstrapAvailability() {
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap global object is not available. Please make sure Bootstrap 5 is properly loaded before using bs5dialog.');
        return false;
    }

    // Check if required components are available
    const requiredComponents = ['Modal', 'Dropdown', 'Tooltip', 'Popover', 'Collapse'];
    const missingComponents = requiredComponents.filter(component => !bootstrap[component]);

    if (missingComponents.length > 0) {
        console.error(`Missing required Bootstrap components: ${missingComponents.join(', ')}. Please ensure the complete Bootstrap 5 library is loaded.`);
        return false;
    }

    return true;
}

/**
 * Initializes Bootstrap 5.3 components within a given element.
 * @param {HTMLElement} element - The element to search for Bootstrap components.
 */
export function initializeBootstrapComponents(element) {
    // Check if bootstrap is available
    if (!checkBootstrapAvailability()) {
        return;
    }

    // Initialize Dropdowns
    const dropdowns = element.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdowns.forEach(dropdown => {
        if (!bootstrap.Dropdown.getInstance(dropdown)) {
            new bootstrap.Dropdown(dropdown);
        }
    });

    // Initialize Tooltips
    const tooltips = element.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        if (!bootstrap.Tooltip.getInstance(tooltip)) {
            new bootstrap.Tooltip(tooltip);
        }
    });

    // Initialize Popovers
    const popovers = element.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach(popover => {
        if (!bootstrap.Popover.getInstance(popover)) {
            new bootstrap.Popover(popover);
        }
    });

    // Initialize Collapses
    const collapses = element.querySelectorAll('[data-bs-toggle="collapse"]');
    collapses.forEach(collapse => {
        if (!bootstrap.Collapse.getInstance(collapse)) {
            new bootstrap.Collapse(collapse, {
                toggle: false
            });
        }
    });

    // Initialize Alerts
    const alerts = element.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (!bootstrap.Alert.getInstance(alert)) {
            new bootstrap.Alert(alert);
        }
    });

    // Initialize Toasts
    const toasts = element.querySelectorAll('.toast');
    toasts.forEach(toast => {
        if (!bootstrap.Toast.getInstance(toast)) {
            new bootstrap.Toast(toast);
        }
    });

    // Initialize Carousels
    const carousels = element.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        if (!bootstrap.Carousel.getInstance(carousel)) {
            new bootstrap.Carousel(carousel);
        }
    });

    // Initialize Offcanvas
    const offcanvases = element.querySelectorAll('.offcanvas');
    offcanvases.forEach(offcanvas => {
        if (!bootstrap.Offcanvas.getInstance(offcanvas)) {
            new bootstrap.Offcanvas(offcanvas);
        }
    });

    // Initialize ScrollSpy
    const scrollspies = element.querySelectorAll('[data-bs-spy="scroll"]');
    scrollspies.forEach(scrollspy => {
        if (!bootstrap.ScrollSpy.getInstance(scrollspy)) {
            new bootstrap.ScrollSpy(document.body, {
                target: scrollspy
            });
        }
    });

    // Initialize Tabs
    const tabs = element.querySelectorAll('[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
        if (!bootstrap.Tab.getInstance(tab)) {
            new bootstrap.Tab(tab);
        }
    });

    // Initialize Modals
    const modals = element.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (!bootstrap.Modal.getInstance(modal)) {
            new bootstrap.Modal(modal);
        }
    });

    // Initialize Buttons
    const buttons = element.querySelectorAll('[data-bs-toggle="button"]');
    buttons.forEach(button => {
        if (!bootstrap.Button.getInstance(button)) {
            new bootstrap.Button(button);
        }
    });
}