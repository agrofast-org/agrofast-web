import { useState } from "react";
import { Button } from "@/components/button";
import { NumberInput } from "@/components/input/number-input";
import { Textarea } from "@/components/input/textarea";
import { Form, FormProps } from "@/components/form/form";
import { useQuery } from "@tanstack/react-query";
import { Request } from "@/types/transport";
import { getRequest } from "@/http/request/get-request";
import { ModalBody, ModalFooter, ModalHeader } from "@/components/modal";
import { ItemWithLabel } from "@/components/ux/transport/request-card";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/router";
import { makeOffer } from "@/http/offer/make-offer";
import { CarrierAutocomplete } from "@/components/ux/transport/carrier-autocomplete";

export interface OfferFormProps {
  uuid: string;
  open?: boolean;
  onClose?: () => void;
}

export const OfferForm: React.FC<OfferFormProps> = ({
  uuid,
  open,
  onClose,
}) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] =
    useState<FormProps["validationErrors"]>(undefined);
  const { data: request, isFetched: requestFetched } = useQuery<Request>({
    queryKey: ["request", uuid],
    queryFn: async () => getRequest(uuid as string).then(({ data }) => data),
    enabled: !!uuid && open,
  });

  if (!requestFetched) {
    return null;
  }

  return (
    <Form
      onSubmit={(formData) => {
        makeOffer(formData)
          .then(({ data }) => {
            if ("chat_uuid" in data && data.chat_uuid) {
              router.push(`/web/chat/${data.chat_uuid}`);
              return;
            }
            if ("uuid" in data && data.uuid) {
              router.push("/web/offer");
              // router.push(`/web/offer/${data.uuid}`);
              return;
            }
          })
          .catch(({ response }) => {
            setValidationErrors(response.data.errors);
          })
          .finally(() => {
            onClose?.();
          });
      }}
      initialData={{
        price: Number(request?.estimated_cost) || 0,
      }}
      validationErrors={validationErrors}
    >
      <ModalHeader>Fazer Oferta</ModalHeader>
      <ModalBody className="w-full">
        <ItemWithLabel className="text-sm" label="Oferta mínima">
          {formatCurrency(request?.estimated_cost)}
        </ItemWithLabel>
        <input type="hidden" name="request_uuid" value={uuid} />
        <NumberInput
          name="price"
          startContent="R$"
          label="Valor da Oferta"
          placeholder={request?.estimated_cost}
          minValue={Number(request?.estimated_cost) || 0}
          step={0.01}
          isRequired
        />
        <CarrierAutocomplete isRequired />
        <Textarea
          name="message"
          label="Mensagem automática"
          placeholder="Envie uma mensagem para o solicitante"
          defaultValue={`Olá, gostaria de oferecer meus serviços para o transporte da sua carga. Estou à disposição para quaisquer dúvidas ou informações adicionais.`}
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
            actionConfirmText: [
              "Ao enviar esta oferta, você concorda com os termos de uso e políticas da plataforma.",
              "Se sua oferta tiver o valor mínimo, ela será automaticamente aceita pelo sistema.",
              "Caso sua oferta seja aceita, as outras ofertas serão automaticamente canceladas.",
            ],
            actionConfirmButton: "Enviar",
          }}
        >
          Enviar oferta
        </Button>
      </ModalFooter>
    </Form>
  );
};
