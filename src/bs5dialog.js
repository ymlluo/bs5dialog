import "./bs5dialog.css";
import {replayLock } from "./libs";
import * as i18n from "./i18n.js";
import { load } from './components/load'
import { offcanvas } from './components/offcanvas'
import { alert } from './components/alert'
import { confirm } from './components/confirm'
import { prompt } from './components/prompt'
import { message } from './components/message'
import { toast } from './components/toast'
import { tabs } from './components/tabs'
import { spinner,spinnerClean} from './components/spinner'


export {
  i18n,
  alert,
  toast,
  message,
  confirm,
  prompt,
  tabs,
  spinner,
  spinnerClean,
  load,
  replayLock,
  offcanvas,
};
