import React from "react";
import { Button } from "@/components/button";
import CrudForm from "@/components/form/crud-form";
import FormFooter from "@/components/form/form-footer";
import FormGroup from "@/components/form/form-group";
import FormHeader from "@/components/form/form-header";
import { DatePicker } from "@/components/input/date-picker";
import { Input } from "@/components/input/input";
import { NumberInput } from "@/components/input/number-input";
import { Select, SelectItem } from "@/components/input/select";
import { Textarea } from "@/components/input/textarea";
import { Suspension } from "@solar-icons/react";
import { useTranslations } from "next-intl";
import { FileUploadModal } from "@/components/input/file-upload-modal";
import { useAuth } from "@/contexts/auth-provider";

const MachineryForm: React.FC<{ uuid?: string }> = ({ uuid }) => {
  const t = useTranslations();

  const { refetchTransportData } = useAuth();

  return (
    <CrudForm
      id={`machinery-${!uuid ? "insert" : "update"}-form`}
      uuid={uuid}
      update={!!uuid}
      getUrl={(id) => `/machinery/${id}`}
      postUrl="/machinery"
      putUrl={(id) => `/machinery/${id}`}
      listUrl="/web/machinery"
      onSuccess={refetchTransportData}
    >
      <FormHeader>
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="font-semibold text-gray-700 dark:text-gray-200 text-2xl">
            {uuid
              ? t("UI.titles.edit", { item: t("UI.labels.machinery") })
              : t("UI.titles.add", { item: t("UI.labels.machinery") })}
          </h1>
        </div>
      </FormHeader>

      <FormGroup label={t("UI.groups.identification")}>
        <Input
          name="name"
          label={t("UI.labels.machinery_name")}
          placeholder={t("UI.placeholders.write_machinery_name")}
        />
        <Input
          name="type"
          label={t("UI.labels.machinery_type")}
          placeholder={t("UI.placeholders.write_machinery_type")}
        />
        <Input
          name="plate"
          label={t("UI.labels.machinery_plate")}
          placeholder={t("UI.placeholders.write_machinery_plate")}
        />
        <Input
          name="manufacturer"
          label={t("UI.labels.machinery_manufacturer")}
          placeholder={t("UI.placeholders.write_machinery_manufacturer")}
        />
        <Input
          name="model"
          label={t("UI.labels.machinery_model")}
          placeholder={t("UI.placeholders.write_machinery_model")}
        />
        <DatePicker
          name="manufacturer_date"
          label={t("UI.labels.machinery_manufacturer_date")}
          isRequired
        />
      </FormGroup>

      <FormGroup label={t("UI.groups.dimensions_and_weight")}>
        <NumberInput
          name="weight"
          label={t("UI.labels.machinery_weight")}
          placeholder={t("UI.placeholders.write_machinery_weight")}
          step={0.01}
        />
        <NumberInput
          name="length"
          label={t("UI.labels.machinery_length")}
          placeholder={t("UI.placeholders.write_machinery_length")}
          step={0.01}
          endContent={
            <Suspension
              weight="LineDuotone"
              className="border-default-400 border-r-2"
            />
          }
        />
        <NumberInput
          name="width"
          label={t("UI.labels.machinery_width")}
          placeholder={t("UI.placeholders.write_machinery_width")}
          step={0.01}
          endContent={
            <Suspension
              weight="LineDuotone"
              className="border-default-400 border-b-2"
            />
          }
        />
        <NumberInput
          name="height"
          label={t("UI.labels.machinery_height")}
          placeholder={t("UI.placeholders.write_machinery_height")}
          step={0.01}
        />
      </FormGroup>

      <FormGroup label={t("UI.groups.vehicle_data")}>
        <NumberInput
          name="axles"
          label={t("UI.labels.machinery_axles")}
          placeholder={t("UI.placeholders.write_machinery_axles")}
        />
        <Select
          name="tire_config"
          label={t("UI.labels.machinery_tire_config")}
          placeholder={t("UI.placeholders.select_machinery_tire_config")}
        >
          <SelectItem key="standard">Padrão (1 pneu por lado)</SelectItem>
          <SelectItem key="flipped">Flipada (2 pneus por lado)</SelectItem>
        </Select>
        <FileUploadModal
          name="pictures"
          label={t("UI.labels.machinery_pictures")}
          placeholder={t("UI.placeholders.write_machinery_pictures")}
          accept={"application/pdf,image/jpeg,image/jpg,image/png"}
          multiple
        />
        <Textarea
          name="obs"
          label={t("UI.labels.machinery_obs")}
          placeholder={t("UI.placeholders.write_machinery_obs")}
        />
      </FormGroup>

      <FormFooter>
        <Button
          className="flex-1 md:flex-none justify-self-end px-16"
          color="primary"
          type="submit"
          confirmAction
          confirmActionInfo={{
            actionConfirmButtonColor: "primary",
          }}
        >
          {t("UI.buttons.continue")}
        </Button>
      </FormFooter>
    </CrudForm>
  );
};

export default MachineryForm;
