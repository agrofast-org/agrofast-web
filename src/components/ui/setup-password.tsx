import { useTranslations } from "next-intl";
import { ModalBody, ModalHeader } from "../modal";
import { Button } from "../button";
import ConditionalModal from "../conditional-modal";
import { useAuth } from "@/contexts/auth-provider";
import { Input } from "../input/input";
import { Spacer } from "@heroui/react";
import { RequestForm } from "../request-form";
import { setPassword } from "@/http/user/set-password";

export const DefinePassword: React.FC = () => {
  const { user, setUser, hasPassword } = useAuth();
  const t = useTranslations();

  return (
    <ConditionalModal
      size="sm"
      isOpen={!!user && !hasPassword}
      isDismissable={false}
    >
      <ModalHeader>Definir senha</ModalHeader>
      <ModalBody className="pb-4">
        <RequestForm
          id="define-password"
          className="w-full"
          onSubmit={setPassword}
          onSuccess={() => {
            setUser();
          }}
        >
          <Input
            name="password"
            label={t("UI.labels.password")}
            placeholder={t("UI.placeholders.write_password")}
            type="password"
            autoComplete="off"
            taggableVisibility
            isRequired
          />
          <Input
            name="password_confirm"
            label={t("UI.labels.password_confirm")}
            placeholder={t("UI.placeholders.write_password_confirm")}
            type="password"
            autoComplete="off"
            taggableVisibility
            isRequired
          />
          <Spacer className="h-1" />
          <Button className="w-full" color="primary" type="submit">
            Definir senha
          </Button>
        </RequestForm>
      </ModalBody>
    </ConditionalModal>
  );
};
