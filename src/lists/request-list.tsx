import List, { IdentifierColumn, ListAction, ListColumn, ListOperations } from "@/components/list";
import RequestStateChip from "@/components/ux/request-state-chip";
import { formatCurrency, formatDistance, formatDuration } from "@/lib/utils";
import { MagniferZoomIn } from "@solar-icons/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

const RequestList: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();

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
      </ListOperations>
    </List>
  );
};

export default RequestList;
