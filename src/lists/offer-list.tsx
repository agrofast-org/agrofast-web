import List, {
  IdentifierColumn,
  ListAction,
  ListColumn,
  ListOperations,
} from "@/components/list";
import { PlaybackSpeed, PointOnMap, TrashBinTrash } from "@solar-icons/react";
import { RequestStateChip } from "@/components/ux/request-state-chip";
import { formatCurrency } from "@/lib/utils";
import { Offer, Request } from "@/types/transport";
import { useAlert } from "@/contexts/alert-provider";
import { Carrier } from "@/types/user";
import { api } from "@/service/api";
import { RateRender } from "@/components/ux/rate-render";
import { useRouter } from "next/router";

export const OfferList: React.FC = () => {
  const router = useRouter();
  const { addAlert } = useAlert();

  return (
    <List getUrl="/offer">
      <IdentifierColumn label="Id" name="uuid" />
      <ListColumn
        name="request"
        formatter={(request: Request) =>
          `${request.origin_place_name} -> ${request.destination_place_name}`
        }
        label="Origem -> Destino"
      />
      <ListColumn
        name="carrier"
        formatter={(carrier: Carrier) => carrier.name}
        label="Transportador"
      />
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
      <ListColumn
        name="rate"
        label="Avaliação"
        formatter={(rate?: number) => <RateRender rate={rate} />}
      />
      <ListOperations label="Operações">
        <ListAction
          name="start-transport"
          label="Iniciar Transporte"
          icon={<PlaybackSpeed size={22} />}
          onAction={(id, offer: Offer) => {
            if (offer?.state !== "approved") {
              addAlert("start-transport", {
                type: "info",
                title: "Iniciar Transporte",
                message: "Não é possível iniciar o transporte.",
              });
              return;
            }
            addAlert("start-transport", {
              type: "warning",
              title: "Iniciar Transporte",
              message: [
                "Voce tem certeza que deseja iniciar o transporte desta oferta?",
                ...(offer && offer.state === "approved"
                  ? [
                      "Avisamos que uma punição pode ser aplicada ao transportador responsável por esta oferta.",
                    ]
                  : []),
              ],
              actions: {
                confirm: {
                  label: "Iniciar",
                  buttonProps: { color: "default" },
                  callback: (onClose) => {
                    api
                      .put(`/offer/${id}/start`)
                      .then(() => {
                        onClose();
                        router.reload();
                      })
                      .catch(({ response }) => {
                        addAlert("start-transport-error", {
                          type: "info",
                          title: "Erro ao iniciar transporte",
                          message:
                            response?.data?.message ||
                            "Erro desconhecido ao iniciar o transporte.",
                        });
                        onClose();
                      });
                  },
                },
              },
            });
          }}
        />
        <ListAction
          name="complete-transport"
          label="Finalizar Transporte"
          icon={<PointOnMap size={22} />}
          onAction={(id, offer: Offer) => {
            if (offer?.state !== "in_progress") {
              addAlert("complete-transport", {
                type: "info",
                title: "Finalizar Transporte",
                message:
                  "Só é possível finalizar o transporte de uma oferta que esteja em andamento.",
              });
              return;
            }
            addAlert("complete-transport", {
              type: "warning",
              title: "Finalizar Transporte",
              message: [
                "Voce tem certeza que deseja finalizar o transporte desta oferta?",
                ...(offer?.state === "in_progress"
                  ? [
                      "Esta oferta está em andamento e finalizar o transporte pode impactar o andamento do chamado.",
                      "Avisamos que uma punição pode ser aplicada ao transportador responsável por esta oferta.",
                    ]
                  : []),
              ],
              actions: {
                confirm: {
                  label: "Concluir",
                  buttonProps: { color: "default" },
                  callback: (onClose) => {
                    api
                      .put(`/offer/${id}/complete`)
                      .then(() => {
                        onClose();
                        router.reload();
                      })
                      .catch(({ response }) => {
                        addAlert("complete-transport-error", {
                          type: "warning",
                          title: "Erro ao finalizar transporte",
                          message:
                            response?.data?.message ||
                            "Erro desconhecido ao finalizar o transporte.",
                        });
                        onClose();
                      });
                  },
                },
              },
            });
          }}
        />
        <ListAction
          name="delete-offer"
          label="Excluir Oferta"
          icon={<TrashBinTrash size={22} />}
          tooltipProps={{ color: "danger" }}
          onAction={(id, offer: Offer) => {
            if (offer && offer.state === "completed") {
              addAlert("delete-offer", {
                type: "info",
                title: "Excluir Oferta",
                message:
                  "Não é possível excluir uma oferta que já foi concluída.",
              });
              return;
            }
            addAlert("delete-offer", {
              type: "warning",
              title: "Excluir Oferta",
              message: [
                "Voce tem certeza que deseja excluir esta oferta?",
                ...(offer &&
                (offer.state === "approved" || offer.state === "in_progress")
                  ? [
                      "Esta oferta foi aprovada e excluir pode impactar o andamento do chamado.",
                      "Avisamos que uma punição pode ser aplicada ao transportador responsável por esta oferta.",
                    ]
                  : []),
              ],
              actions: {
                confirm: {
                  label: "Excluir",
                  buttonProps: { color: "default" },
                  callback: (onClose) => {
                    api
                      .delete(`/offer/${id}`)
                      .then(() => {
                        onClose();
                        router.reload();
                      })
                      .catch(({ response }) => {
                        addAlert("delete-transport-error", {
                          type: "info",
                          title: "Erro ao excluir transporte",
                          message:
                            response?.data?.message ||
                            "Erro desconhecido ao excluir o transporte.",
                        });
                        onClose();
                      });
                  },
                },
              },
            });
          }}
        />
      </ListOperations>
    </List>
  );
};
