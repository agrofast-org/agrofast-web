import common from "../../messages/pt-BR.json";
import type { useTranslations } from "next-intl";

type Messages = typeof common;

declare global {
  // Use type safe message keys with `next-intl`
  export type IntlMessages = Messages;
}

export type TranslationKey = Parameters<ReturnType<typeof useTranslations>>[0];
