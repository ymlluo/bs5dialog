/**
 * An object containing default spinner HTML strings.
 * @type {Object}
 */
export const BS5_DIALOG_DEFAULT_SPINNERS = {
  border: `<div class="spinner-border" role="status"></div>`,
  grow: `<div class="spinner-grow" role="status"></div>`
};

/**
 * Creates a spinner element based on the given animation name.
 * If no animation name is provided or the animation name is not found in BS5_DIALOG_DEFAULT_SPINNERS,
 * a default spinner element is created.
 * @param {string} spinnerName - The name of the animation to use for the spinner.
 * @param {string} spinnerClass - The class to add to the spinner element.
 * @param {string} spinnerStyle - The custom styles to add to the spinner element.
 * @returns {HTMLElement} - The spinner element.
 */
export function makeSpinner(spinnerName = "", spinnerClass = "", spinnerStyle = "") {
  spinnerName = spinnerName.trim();
  spinnerClass = spinnerClass.trim();
  spinnerStyle = spinnerStyle.trim();

  const htmlString = BS5_DIALOG_DEFAULT_SPINNERS[spinnerName] || spinnerName;
  const div = document.createElement("div");
  if (!spinnerName) {
    return div;
  }
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes.
  let spinnerElement;
  if (div.firstChild && div.firstChild instanceof Element) {
    spinnerElement = div.firstChild;
  } else {
    spinnerElement = div;
  }

  // add spinnerClass to the spinner element
  if (spinnerClass.trim()) {
    spinnerElement.classList.add(...spinnerClass.split(" "));
  }

  // add custom styles to the spinner element
  if (spinnerStyle.trim()) {
    const styles = spinnerStyle.split(";");
    styles.forEach(style => {
      const [property, value] = style.split(":");
      if (property && value) {
        spinnerElement.style[property.trim()] = value.trim();
      }
    });
  }

  return spinnerElement;
}
