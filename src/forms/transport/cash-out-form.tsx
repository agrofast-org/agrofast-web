import { Button } from "@/components/button";
import { NumberInput } from "@/components/input/number-input";
import { Textarea } from "@/components/input/textarea";
import { useQuery } from "@tanstack/react-query";
import { ModalBody, ModalFooter, ModalHeader } from "@/components/modal";
import { useRouter } from "next/router";
import { RequestForm } from "@/components/request-form";
import { api } from "@/service/api";
import { useAuth } from "@/contexts/auth-provider";
import { formatCurrency } from "@/lib/utils";

export interface OfferFormProps {
  open?: boolean;
  onClose?: () => void;
}

export const CashOutForm: React.FC<OfferFormProps> = ({ open, onClose }) => {
  const router = useRouter();

  const { user } = useAuth();

  const { data: funds, isFetched: isFundsFetched } = useQuery({
    queryKey: ["user-funds"],
    queryFn: async () =>
      api.get<number>("/cash-out/funds").then(({ data }) => data),
    enabled: !!open && !!user,
  });

  return (
    <RequestForm
      onSubmit={(data) => api.post("/cash-out", data)}
      onSuccess={() => {
        router.reload();
      }}
      className="-z-10"
    >
      <ModalHeader>Fazer Oferta</ModalHeader>
      <ModalBody className="w-full">
        <p>
          {isFundsFetched ? `${formatCurrency(funds || 0)} disponíveis para saque.` : "Carregando fundos disponíveis..."}
        </p>
        <NumberInput
          name="amount"
          startContent="R$"
          label="Valor para saque"
          minValue={1}
          step={0.01}
          isRequired
        />
        <Textarea
          name="obs"
          label="Observações"
          placeholder="Insira aqui quaisquer observações adicionais..."
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
              "Você está prestes a solicitar um saque. Por favor, confirme se todas as informações estão corretas antes de prosseguir.",
            ],
            actionConfirmButton: "Enviar",
          }}
          isDisabled={!isFundsFetched || (funds || 0) < 1}
        >
          Enviar solicitação
        </Button>
      </ModalFooter>
    </RequestForm>
  );
};
