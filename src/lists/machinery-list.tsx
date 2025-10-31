import List, {
  IdentifierColumn,
  ListAction,
  ListColumn,
  ListOperations,
} from "@/components/list";
import { Pen } from "@solar-icons/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export const MachineryList: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <List getUrl="/machinery">
      <IdentifierColumn label="Id" name="uuid" />
      <ListColumn label={t("UI.labels.machinery_name")} name="name" />
      <ListColumn
        label={t("UI.labels.machinery_manufacturer")}
        name="manufacturer"
      />
      <ListColumn label={t("UI.labels.machinery_type")} name="type" />
      <ListColumn label={t("UI.labels.machinery_model")} name="model" />
      <ListColumn
        label={t("UI.labels.machinery_manufacturer_date")}
        name="manufacturer_date"
        date
      />
      <ListOperations label="Operações">
        {/* <ListAction
      name="view"
      label={t("UI.buttons.view")}
      icon={<Eye size={22} />}
      onAction={() => {})}
    /> */}
        <ListAction
          name="edit"
          label={t("UI.buttons.edit")}
          icon={<Pen size={22} />}
          onAction={(id) => router.push(`/web/machinery/${id}`)}
        />
        {/* <ListAction
      name="delete"
      label={t("UI.buttons.delete")}
      icon={<TrashBinTrash size={22} className="text-danger" />}
      tooltipProps={{ color: "danger" }}
      onAction={() => {}}
    /> */}
      </ListOperations>
    </List>
  );
};
