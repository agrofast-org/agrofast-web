import { Button } from "@/components/button";
import { Textarea } from "@/components/input/textarea";
import { RequestForm } from "@/components/request-form";
import { ModalBody, ModalFooter, ModalHeader } from "@/components/modal";
import { useRouter } from "next/router";
import { makeSupportRequest } from "@/http/support/make-request";

export interface OfferFormProps {
  onClose?: () => void;
}

export const SupportRequestForm: React.FC<OfferFormProps> = ({
  onClose,
}) => {
  const router = useRouter();

  return (
    <RequestForm
      onSubmit={makeSupportRequest}
      onSuccess={({ data }) => {
        router.push(`/web/chat/${data.chat_uuid}`);
      }}
      className="-z-10"
    >
      <ModalHeader>Mandar mensagem para suporte</ModalHeader>
      <ModalBody className="w-full">
        <Textarea
          name="message"
          label="Mensagem"
          placeholder="Envie uma mensagem para o solicitante"
          defaultValue="Olá, gostaria de entrar em contato com o suporte."
          maxLength={1000}
          isClearable
        />
      </ModalBody>
      <ModalFooter className="justify-between w-full">
        <Button onPress={onClose}>Cancelar</Button>
        <Button
          className="flex-1 md:flex-none justify-self-end"
          color="primary"
          type="submit"
          confirmAction
          confirmActionInfo={{
            actionConfirmButtonColor: "primary",
            actionConfirmTitle: "Importante",
            actionConfirmText: ["Abrir o chat de suporte agora?"],
            actionConfirmButton: "Enviar",
          }}
        >
          Entrar em contato com o suporte
        </Button>
      </ModalFooter>
    </RequestForm>
  );
};
