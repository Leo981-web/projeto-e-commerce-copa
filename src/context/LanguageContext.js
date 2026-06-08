import React, { createContext, useState, useContext } from "react";
import i18n from "../locales"; 

const LanguageContext = createContext({});

export function LanguageProvider({ children }) {
  
  const [locale, setLocale] = useState(i18n.locale);

  
  function changeLanguage(langCode) {
    i18n.locale = langCode; 
    setLocale(langCode);    
  }

  return (
    <LanguageContext.Provider 
    value={{ 
      locale, 
      changeLanguage, 
      t: (key) => i18n.t(key)
    }}
  >
    {children}
  </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}