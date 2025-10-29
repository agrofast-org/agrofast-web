import { Actions, Columns, List } from "@/components/list.v2";
import { useRouter } from "next/router";
import { api } from "@/service/api";
import { Document } from "@/types/user";

export const DocumentList: React.FC = () => {
  const router = useRouter();

  const fetchCarriers = () => {
    return api.get<Document[]>("/user/document");
  };

  const columns: Columns<Document> = {
    id: { label: "ID" },
    document_type: { label: "Tipo" },
    number: { label: "Numero" },
    emission_date: { label: "Emitido em", format: (value) => new Date(value as string).toLocaleDateString(router.locale) },
    active: {
      label: "Ativo",
      format: (value) => (value ? "Sim" : "Não"),
    },
    positions: [
      "document_type",
      "number",
      "emission_date",
      "active",
      // "actions",
    ],
  };

  const actions: Actions<Document> = {
    edit: {
      label: "Edit",
      action: (item) => router.push(`/carriers/${item.id}/edit`),
    },
  };

  return (
    <List
      id="carrier-list"
      get={fetchCarriers}
      columns={columns}
      actions={actions}
    />
  );
};
