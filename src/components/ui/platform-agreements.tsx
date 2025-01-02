import { ModalBody, ModalHeader } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import ScrollShadow from "../scroll-shadow";

export const TermsOfUse = () => {
  const t = useTranslations();

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        {t("Legal.agreements.terms_of_use")}
      </ModalHeader>
      <ModalBody className="p-0 overflow-y-auto">
        <ScrollShadow className="mr-2 px-6 py-2 pr-4">
        </ScrollShadow>
      </ModalBody>
    </>
  );
};

export const PrivacyPolicy = () => {
  const t = useTranslations();

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        {t("Legal.agreements.privacy_policy")}
      </ModalHeader>
      <ModalBody className="p-0 overflow-y-auto">
        <ScrollShadow className="mr-2 px-6 py-2 pr-4"></ScrollShadow>
      </ModalBody>
    </>
  );
};
