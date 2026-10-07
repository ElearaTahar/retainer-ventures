import { Language } from "../types/i18n";

export function toLanguage(language: string): Language {
  if (language.startsWith("fr")) return "fr";
  return "en";
}
