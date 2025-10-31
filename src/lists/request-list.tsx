import List, {
  IdentifierColumn,
  ListAction,
  ListColumn,
  ListOperations,
} from "@/components/list";
import { RateRender } from "@/components/ux/rate-render";
import { RequestStateChip } from "@/components/ux/request-state-chip";
import { useAlert } from "@/contexts/alert-provider";
import { cancelRequest } from "@/http/request/cancel-request";
import { formatCurrency, formatDistance, formatDuration } from "@/lib/utils";
import { api } from "@/service/api";
import { Request } from "@/types/transport";
import {
  MagniferZoomIn,
  NotificationUnreadLines,
  PointOnMap,
  TrashBinTrash,
} from "@solar-icons/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export const RequestList: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const { addAlert } = useAlert();

  return (
    <List getUrl="/request">
      <IdentifierColumn label="Id" name="uuid" />
      <ListColumn label="Origem" name="origin_place_name" />
      <ListColumn label="Destino" name="destination_place_name" />
      <ListColumn
        label="Data desejada"
        name="desired_date"
        formatter={(date) =>
          date ? new Date(date).toLocaleDateString() : "Sem data desejada"
        }
      />
      <ListColumn
        label="Distancia"
        name="distance"
        formatter={formatDistance}
      />
      <ListColumn
        label="Tempo Estimado"
        name="estimated_time"
        formatter={formatDuration}
      />
      <ListColumn
        label="Custo Estimado"
        name="estimated_cost"
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
          name="edit"
          label={t("UI.buttons.view")}
          icon={<MagniferZoomIn size={22} />}
          onAction={(uuid) => router.push(`/web/request/${uuid}`)}
        />
        <ListAction
          name="complete-transport"
          label="Finalizar Transporte"
          icon={<PointOnMap size={22} />}
          onAction={(id, request: Request) => {
            if (request?.state !== "in_progress") {
              addAlert("complete-transport", {
                type: "info",
                title: "Finalizar Transporte",
                message:
                  "Só é possível finalizar um chamado de transporte que esteja em andamento.",
              });
              return;
            }
            addAlert("complete-transport", {
              type: "warning",
              title: "Finalizar Transporte",
              message: [
                "Voce tem certeza que deseja finalizar o transporte desta oferta?",
                ...(request?.state === "in_progress"
                  ? [
                      "Este chamado está em andamento e finalizar o transporte pode impactar o andamento do chamado.",
                    ]
                  : []),
              ],
              actions: {
                confirm: {
                  label: "Concluir",
                  buttonProps: { color: "default" },
                  callback: (onClose) => {
                    api
                      .put(`/request/${id}/complete`)
                      .then(() => {
                        onClose();
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
          name="view-offers"
          label="Ver Ofertas"
          icon={<NotificationUnreadLines size={22} />}
          onAction={(uuid) => {
            router.push(`/web/request/${uuid}/offers`);
          }}
        />
        <ListAction
          name="delete"
          label={t("UI.buttons.delete")}
          icon={<TrashBinTrash size={22} className="text-danger" />}
          tooltipProps={{ color: "danger" }}
          onAction={(uuid, item) => {
            addAlert("test-alert", {
              title: "Atenção",
              type: item?.active ? "warning" : "info",
              message: item?.active
                ? "Tem certeza que deseja cancelar esta solicitação ativa? Esta ação não pode ser desfeita."
                : "A solicitação já está inativa.",
              actions: {
                confirm: {
                  label: item?.active ? "Sim, cancelar" : "Ok",
                  callback: (onClose) => {
                    if (item?.active) {
                      cancelRequest(uuid).then(() => {
                        router.replace(router.asPath);
                      });
                    }
                    onClose();
                  },
                  buttonProps: { color: item?.active ? "primary" : "default" },
                },
              },
            });
          }}
        />
      </ListOperations>
    </List>
  );
};
