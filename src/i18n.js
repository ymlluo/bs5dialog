// i18n.js

// 默认语言为英语
export let bs5LangCurrentLang = "en";

export const bs5LangConfigs = {
  en: {
    ok: "OK",
    confirm: "Confirm",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    prompt: "Prompt",
    sure: "Are you sure?"
  },
  zh: {
    ok: "确定",
    confirm: "确认",
    cancel: "取消",
    save: "保存",
    close: "关闭",
    prompt: "提示",
    sure: "确定吗？"
  },
  jp: {
    ok: "もちろん",
    confirm: "確認",
    cancel: "キャンセル",
    save: "保存",
    close: "閉じる",
    prompt: "促す",
    sure: "もちろん"
  },
  fr: {
    ok: "D'accord",
    confirm: "Confirmer",
    cancel: "Annuler",
    save: "Enregistrer",
    close: "Fermer",
    prompt: "Invite",
    sure: "Êtes-vous sûr?"
  },
  es: {
    ok: "Aceptar",
    confirm: "Confirmar",
    cancel: "Cancelar",
    save: "Guardar",
    close: "Cerrar",
    prompt: "Indicación",
    sure: "¿Estás seguro?"
  },
  de: {
    ok: "OK",
    confirm: "Bestätigen",
    cancel: "Abbrechen",
    save: "Speichern",
    close: "Schließen",
    prompt: "Aufforderung",
    sure: "Bist du sicher?"
  }
};

// 获取当前语言
export const getCurrentLang = () => bs5LangCurrentLang;

// 设置当前语言
export const setCurrentLang = lang => {
  if (bs5LangConfigs[lang]) {
    bs5LangCurrentLang = lang;
  }
};

// 获取指定键名的语言字符串
export const getConfig = key => bs5LangConfigs[bs5LangCurrentLang][key] || "";

// 获取所有语言配置
export const getConfigs = () => bs5LangConfigs;

// 导出默认模块
export default {
  getCurrentLang,
  setCurrentLang,
  getConfig,
  getConfigs
};
