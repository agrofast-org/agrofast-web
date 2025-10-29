import React from "react";
import { Button } from "@/components/button";
import CrudForm from "@/components/form/crud-form";
import FormHeader from "@/components/form/form-header";
import FormGroup from "@/components/form/form-group";
import FormFooter from "@/components/form/form-footer";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/auth-provider";
import { Select } from "@/components/input/select";
import { Input } from "@/components/input/input";
import { DatePicker } from "@/components/input/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import { formatDocumentInput } from "@/lib/utils";

export const DocumentForm: React.FC<{ uuid?: string }> = ({ uuid }) => {
  const t = useTranslations();

  const { refetchTransportData } = useAuth();

  return (
    <CrudForm
      id={`document-${!uuid ? "insert" : "update"}-form`}
      uuid={uuid}
      update={!!uuid}
      getUrl={(id) => `/user/document/${id}`}
      postUrl="/user/document"
      putUrl={(id) => `/user/document/${id}`}
      onSuccess={refetchTransportData}
      listUrl="/web/document"
    >
      <FormHeader>
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="font-semibold text-gray-700 dark:text-gray-200 text-2xl">
            {uuid ? "Editar documento" : "Adicionar documento"}
          </h1>
        </div>
      </FormHeader>

      <FormGroup label="Detalhes do documento">
        <Input
          name="number"
          label="Numero"
          placeholder="Numero do documento..."
          format={formatDocumentInput}
        />
        <Select
          name="type"
          label="Tipo"
          placeholder="Selecione o tipo de documento..."
          options={[
            { label: "CPF", value: "cpf" },
            { label: "CNPJ", value: "cnpj" },
          ]}
        />
        <DatePicker
          name="emission_date"
          label="Data de emissão"
          maxValue={today(getLocalTimeZone())}
        />
      </FormGroup>

      <FormFooter>
        <Button
          className="flex-1 md:flex-none justify-self-end px-16"
          color="primary"
          type="submit"
          confirmAction
          confirmActionInfo={{ actionConfirmButtonColor: "primary" }}
        >
          {t("UI.buttons.continue")}
        </Button>
      </FormFooter>
    </CrudForm>
  );
};
