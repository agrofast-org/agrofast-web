import web from "../../messages/pt-BR/web.json";
import portfolio from "../../messages/pt-BR/portfolio.json";
import legal from "../../messages/pt-BR/legal.json";
import base from "../../messages/pt-BR/default.json";
import type { useTranslations } from "next-intl";

type Messages = typeof web & typeof portfolio & typeof legal & typeof base;

declare global {
  // Use type safe message keys with `next-intl`
  export type IntlMessages = Messages;
}

export type TranslationKey = Parameters<ReturnType<typeof useTranslations>>[0];
