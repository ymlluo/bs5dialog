import "./bs5dialog.css";
import * as utils from "./utils.js";
import * as i18n from "./i18n.js";
import { setSystemLang } from "./i18n.js";
import { load } from "./components/load.js";
import { offcanvas } from "./components/offcanvas.js";
import { alert } from "./components/alert.js";
import { confirm } from "./components/confirm.js";
import { prompt } from "./components/prompt.js";
import { message, msg } from "./components/message.js";
import { toast } from "./components/toast.js";
import { loading, showLoading, loadingClean, hideLoading } from "./components/loading.js";
import { startup } from "./startup.js";
import { checkBootstrapAvailability } from "./utils/bootstrapInit.js";

// Check if Bootstrap is available on initialization
const isBootstrapAvailable = checkBootstrapAvailability();

export {
  alert,
  confirm,
  prompt,
  message,
  msg,
  toast,
  loading,
  showLoading,
  loadingClean,
  hideLoading,
  load,
  offcanvas,
  utils,
  i18n,
  setSystemLang,
  startup,
  checkBootstrapAvailability,
  isBootstrapAvailable
};

const bs5dialog = {
  alert,
  confirm,
  prompt,
  message,
  msg,
  toast,
  loading,
  showLoading,
  loadingClean,
  hideLoading,
  load,
  offcanvas,
  utils,
  i18n,
  setSystemLang,
  startup,
  checkBootstrapAvailability,
  isBootstrapAvailable
}

export default bs5dialog;
