import List, {
  IdentifierColumn,
  ListAction,
  ListColumn,
  ListOperations,
} from "@/components/list";
import { CheckCircle } from "@solar-icons/react";
import { RequestStateChip } from "@/components/ux/request-state-chip";
import { formatCurrency } from "@/lib/utils";
import { Offer } from "@/types/transport";
import { useAlert } from "@/contexts/alert-provider";
import { acceptOffer } from "@/http/request/accept-offer";
import { useRouter } from "next/router";

export const RequestOffersList: React.FC = () => {
  const router = useRouter();
  const { addAlert } = useAlert();

  return (
    <List getUrl={`/request/${router.query.uuid}/offers`}>
      <IdentifierColumn label="Id" name="uuid" />
      <ListColumn name="user_name" label="Transportador" />
      <ListColumn
        label="Valor proposto"
        name="price"
        formatter={formatCurrency}
      />
      <ListColumn
        label="Status"
        name="state"
        formatter={(state) => <RequestStateChip state={state} />}
      />
      <ListColumn name="created_at" label="Feita em" date />
      <ListOperations label="Operações">
        <ListAction
          name="accept-offer"
          label="Aceitar Oferta"
          icon={<CheckCircle size={22} />}
          onAction={(id, offer: Offer) => {
            if (offer && offer.state === "pending") {
              acceptOffer(id).then(() => {
                addAlert("accept-offer", {
                  type: "success",
                  title: "Oferta aceita",
                  message: "A oferta foi aceita com sucesso.",
                });
                router.reload();
              });
              addAlert("accept-offer", {
                type: "info",
                title: "Aceitar Oferta",
                message:
                  "Funcionalidade de aceitar oferta ainda não implementada.",
              });
              return;
            }
            addAlert("accept-offer", {
              type: "info",
              title: "Erro ao aceitar oferta",
              message: `Não é possível aceitar uma oferta ${
                offer?.state === "in_progress" ? "em progresso" : "aprovada"
              }.`,
            });
          }}
        />
      </ListOperations>
    </List>
  );
};
