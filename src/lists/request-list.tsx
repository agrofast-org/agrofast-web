import List, {
  IdentifierColumn,
  ListAction,
  ListColumn,
  ListOperations,
} from "@/components/list";
import RequestStateChip from "@/components/ux/request-state-chip";
import { useAlert } from "@/contexts/alert-provider";
import { cancelRequest } from "@/http/request/cancel-request";
import { formatCurrency, formatDistance, formatDuration } from "@/lib/utils";
import {
  MagniferZoomIn,
  NotificationUnreadLines,
  TrashBinTrash,
} from "@solar-icons/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

const RequestList: React.FC = () => {
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
        formatter={(date) => (date ? new Date(date).toLocaleDateString() : "Sem data desejada")}
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
      <ListOperations label="Operações">
        <ListAction
          name="edit"
          label={t("UI.buttons.view")}
          icon={<MagniferZoomIn size={22} />}
          onAction={(uuid) => router.push(`/web/request/${uuid}`)}
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

export default RequestList;
