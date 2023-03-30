// i18n.js

// 默认语言为英语
let currentLang = 'en';

const configs = {
  en: {
    ok:'OK',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save:'Save',
    close:'Close'
    
  },
  zh: {
    ok:'确定',
    confirm: '确认',
    cancel: '取消',
    save:'保存',
    close:'关闭'
  }
};

// 获取当前语言
export const getCurrentLang = () => currentLang;

// 设置当前语言
export const setCurrentLang = lang => {
  if (configs[lang]) {
    currentLang = lang;
  }
};

// 获取指定键名的语言字符串
export const getConfig = key => configs[currentLang][key] || '';

// 获取所有语言配置
export const getConfigs = () => configs;

// 导出默认模块
export default {
  getCurrentLang,
  setCurrentLang,
  getConfig,
  getConfigs
};
