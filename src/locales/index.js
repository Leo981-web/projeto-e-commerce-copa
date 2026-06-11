import { I18n} from "i18n-js";
import pt from "./pt.json";
import en from "./en.json";
import es from "./es.json";
import * as Localization from "expo-localization";

const translations = {
  PT: pt,
  EN: en,
  ES: es,
};
  
const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = "EN"; 

const deviceLocales = Localization.getLocales?.();
const deviceLanguage = deviceLocales && deviceLocales.length > 0 
  ? deviceLocales[0].languageCode 
  : "EN";

if (translations[deviceLanguage]) {
  i18n.locale = deviceLanguage;
} else {
  i18n.locale = "EN";
}

export default i18n;