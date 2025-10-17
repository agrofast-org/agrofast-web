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
import { MagniferZoomIn, TrashBinTrash } from "@solar-icons/react";
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
          name="delete"
          label={t("UI.buttons.delete")}
          icon={<TrashBinTrash size={22} className="text-danger" />}
          tooltipProps={{ color: "danger" }}
          onAction={(uuid) => {
            addAlert("test-alert",{
              title: "Atenção",
              type: "warning",
              message:
                "Tem certeza que deseja cancelar esta solicitação? Esta ação não pode ser desfeita.",
              actions: {
                confirm: {
                  label: "Sim, cancelar",
                  callback: (onClose) => {
                    cancelRequest(uuid);
                    onClose();
                  },
                  buttonProps: { color: "primary" },
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
