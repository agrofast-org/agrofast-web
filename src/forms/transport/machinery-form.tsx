import Button from "@/components/button";
import CrudForm from "@/components/crud-form";
import DatePicker from "@/components/input/date-picker";
import Input from "@/components/input/input";
import NumberInput from "@/components/input/number-input";
import { useTranslations } from "next-intl";

const MachineryForm: React.FC<{ uuid?: string }> = ({ uuid }) => {
  const t = useTranslations();

  return (
    <CrudForm className="flex flex-col flex-1 items-center gap-4">
      <div className="flex flex-col gap-4 w-full max-w-96">
        <p className="self-start pr-8 pb-2 font-semibold text-gray-700 dark:text-gray-200 text-2xl text-left">
          Inserir ou editar maquinário
        </p>
        <Input name="name" label="Nome do equipamento" />
        <Input name="type" label="Categoria/Tipo" />
        <Input name="manufacturer" label="Fabricante" />
        <Input name="model" label="Modelo" />
        <DatePicker
          name="manufacturer_date"
          label="Data de fabricação"
          required
        />
        <NumberInput min={0} name="weight" label="Peso bruto" endContent="kg" />

        <Button
          className="justify-self-end"
          color="primary"
          type="submit"
          confirmAction
          confirmActionInfo={{
            actionConfirmButtonColor: "primary",
            actionConfirmTitle: t("Form.update_user.title"),
            actionConfirmText: t("Form.update_user.description"),
            actionConfirmButton: t("Form.update_user.confirm"),
            actionCancelButton: t("Form.update_user.cancel"),
          }}
        >
          {t("UI.buttons.continue")}
        </Button>
      </div>
    </CrudForm>
  );
};

export default MachineryForm;
