import common from "../../messages/pt-BR.json";

type Messages = typeof common;

declare global {
  // Use type safe message keys with `next-intl`
  type IntlMessages = Messages;
}
