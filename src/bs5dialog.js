import "./bs5dialog.css";
import * as helper from "./libs";
import * as i18n from "./i18n.js";
import { load } from './components/load'
import { offcanvas } from './components/offcanvas'
import { alert } from './components/alert'
import { confirm } from './components/confirm'
import { prompt } from './components/prompt'
import { message,msg } from './components/message'
import { toast } from './components/toast'
import { tabs } from './components/tabs'
import { spinner,spinnerClean,showLoading,hideLoading} from './components/spinner'


export {
  alert,
  confirm,
  prompt,
  message,
  msg,
  toast,
  spinner,
  showLoading,
  spinnerClean,
  hideLoading,
  load,
  offcanvas,
  tabs,
  helper,
  i18n,
};
