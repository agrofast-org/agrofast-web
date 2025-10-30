import List, {
  IdentifierColumn,
  ListAction,
  ListColumn,
  ListOperations,
} from "@/components/list";
import { Pen } from "@solar-icons/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export const CashOutList: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <List getUrl="/cash-out">
      <IdentifierColumn label="Id" name="uuid" />
      <ListColumn label="Valor" name="amount" />
      <ListColumn label="Status" name="status" />
      <ListOperations label={"Operações"}>
        <ListAction
          name="edit"
          label={t("UI.buttons.edit")}
          icon={<Pen size={22} />}
          onAction={(id) => router.push(`/web/cash-out/${id}`)}
        />
      </ListOperations>
    </List>
  );
};
