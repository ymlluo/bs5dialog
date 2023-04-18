import "./bs5dialog.css";
import * as utils from "./utils";
import * as i18n from "./i18n.js";
import { setSystemLang } from "./i18n.js";
import { load } from "./components/load";
import { offcanvas } from "./components/offcanvas";
import { alert } from "./components/alert";
import { confirm } from "./components/confirm";
import { prompt } from "./components/prompt";
import { message, msg } from "./components/message";
import { toast } from "./components/toast";
import { loading, showLoading, loadingClean, hideLoading } from "./components/loading";
import { startup } from "./startup";

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
  startup
};

