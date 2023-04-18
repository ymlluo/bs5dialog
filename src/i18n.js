// Default language is English
export let bs5LangCurrentLang = "en";
// Language configurations
// Language configurations sorted by number of speakers in descending order
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
  es: {
    ok: "Aceptar",
    confirm: "Confirmar",
    cancel: "Cancelar",
    save: "Guardar",
    close: "Cerrar",
    prompt: "Indicación",
    sure: "¿Estás seguro?"
  },
  pt: {
    ok: "OK",
    confirm: "Confirmar",
    cancel: "Cancelar",
    save: "Salvar",
    close: "Fechar",
    prompt: "Prompt",
    sure: "Tem certeza?"
  },
  ru: {
    ok: "OK",
    confirm: "Подтвердить",
    cancel: "Отмена",
    save: "Сохранить",
    close: "Закрыть",
    prompt: "Подсказка",
    sure: "Вы уверены?"
  },
  ja: {
    ok: "もちろん",
    confirm: "確認",
    cancel: "キャンセル",
    save: "保存",
    close: "閉じる",
    prompt: "促す",
    sure: "もちろん"
  },
  de: {
    ok: "OK",
    confirm: "Bestätigen",
    cancel: "Abbrechen",
    save: "Speichern",
    close: "Schließen",
    prompt: "Aufforderung",
    sure: "Bist du sicher?"
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
  ko: {
    ok: "확인",
    confirm: "확인",
    cancel: "취소",
    save: "저장",
    close: "닫기",
    prompt: "프롬프트",
    sure: "확실합니까?"
  }
};

// Get current language
export const getCurrentLang = () => bs5LangCurrentLang;

// Set current language
export const setCurrentLang = lang => {
  if (bs5LangConfigs[lang] || bs5LangConfigs[lang.replace(/-.*$/, "")]) {
    bs5LangCurrentLang = lang;
  }
};

// Get language string for specified key
export const getConfig = key => bs5LangConfigs[bs5LangCurrentLang][key] || "";

// Get all language configurations
export const getConfigs = () => bs5LangConfigs;

// Add a function to set language based on system language
export const setSystemLang = () => {
  const systemLang = navigator.language || navigator.userLanguage;
  const lang = systemLang.replace(/-.*$/, "");
  if (bs5LangConfigs[systemLang]) {
    bs5LangCurrentLang = systemLang;
  } else if (bs5LangConfigs[lang]) {
    bs5LangCurrentLang = lang;
  }

  console.log(bs5LangCurrentLang, navigator.language, navigator.userLanguage);
};

// Export default module
export default {
  getCurrentLang,
  setCurrentLang,
  getConfig,
  getConfigs,
  setSystemLang
};
