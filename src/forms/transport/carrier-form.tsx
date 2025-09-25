import React from "react";
import { Button } from "@/components/button";
import CrudForm from "@/components/form/crud-form";
import FormHeader from "@/components/form/form-header";
import FormGroup from "@/components/form/form-group";
import FormFooter from "@/components/form/form-footer";
import { Input } from "@/components/input/input";
import { NumberInput } from "@/components/input/number-input";
import { Select, SelectItem } from "@/components/input/select";
import { FileUpload } from "@/components/input/file-upload";
import { Textarea } from "@/components/input/textarea";
import { useTranslations } from "next-intl";
import { DatePicker } from "@/components/input/date-picker";

const CarrierForm: React.FC<{ uuid?: string }> = ({ uuid }) => {
  const t = useTranslations();

  return (
    <CrudForm
      id={`carrier-${!uuid ? "insert" : "update"}-form`}
      uuid={uuid}
      update={!!uuid}
      getUrl={(id) => `/carrier/${id}`}
      postUrl="/carrier"
      putUrl={(id) => `/carrier/${id}`}
    >
      <FormHeader>
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="font-semibold text-gray-700 dark:text-gray-200 text-2xl">
            {uuid
              ? t("UI.titles.edit", { item: t("UI.labels.carrier") })
              : t("UI.titles.add", { item: t("UI.labels.carrier") })}
          </h1>
        </div>
      </FormHeader>

      <FormGroup label={t("UI.groups.vehicle_identification")}>
        <Input
          name="name"
          label={t("UI.labels.carrier_name")}
          placeholder={t("UI.placeholders.write_carrier_name")}
        />
        <Input
          name="plate"
          label={t("UI.labels.carrier_plate")}
          placeholder={t("UI.placeholders.write_carrier_plate")}
          required
        />
        <Input
          name="renavam"
          label={t("UI.labels.carrier_renavam")}
          placeholder={t("UI.placeholders.write_carrier_renavam")}
          required
        />
        <Input
          name="chassi"
          label={t("UI.labels.carrier_chassi")}
          placeholder={t("UI.placeholders.write_carrier_chassi")}
          required
        />
        <Input
          name="manufacturer"
          label={t("UI.labels.carrier_manufacturer")}
          placeholder={t("UI.placeholders.write_carrier_manufacturer")}
          required
        />
        <Input
          name="model"
          label={t("UI.labels.carrier_model")}
          placeholder={t("UI.placeholders.write_carrier_model")}
          required
        />
        <DatePicker
          name="manufacturer_date"
          label={t("UI.labels.carrier_manufacturer_date")}
          isRequired
        />
        <Select
          name="licensing_uf"
          label={t("UI.labels.carrier_licensing_uf")}
          placeholder={t("UI.placeholders.write_select_licensing_uf")}
          required
        >
          {[
            "AC",
            "AL",
            "AP",
            "AM",
            "BA",
            "CE",
            "DF",
            "ES",
            "GO",
            "MA",
            "MT",
            "MS",
            "MG",
            "PA",
            "PB",
            "PR",
            "PE",
            "PI",
            "RJ",
            "RN",
            "RS",
            "RO",
            "RR",
            "SC",
            "SP",
            "SE",
            "TO",
          ].map((uf) => (
            <SelectItem key={uf}>{uf}</SelectItem>
          ))}
        </Select>
      </FormGroup>

      <FormGroup label={t("UI.groups.type_and_body")}>
        <Input
          name="vehicle_type"
          label={t("UI.labels.carrier_vehicle_type")}
          placeholder={t("UI.placeholders.write_carrier_vehicle_type")}
          required
        />
        <Input
          name="body_type"
          label={t("UI.labels.carrier_body_type")}
          placeholder={t("UI.placeholders.write_carrier_body_type")}
          required
        />
      </FormGroup>

      <FormGroup label={t("UI.groups.dimensions_and_capacities")}>
        <NumberInput
          name="plank_length"
          label={t("UI.labels.carrier_plank_length")}
          placeholder={t("UI.placeholders.write_carrier_plank_length")}
          step={0.01}
          min={0}
          required
        />
        <NumberInput
          name="tare"
          label={t("UI.labels.carrier_tare")}
          placeholder={t("UI.placeholders.write_carrier_tare")}
          step={0.01}
          min={0}
          required
        />
        <NumberInput
          name="pbtc"
          label={t("UI.labels.carrier_pbtc")}
          placeholder={t("UI.placeholders.write_carrier_pbtc")}
          step={0.01}
          min={0}
          required
        />
      </FormGroup>

      <FormGroup label={t("UI.groups.axles_and_traction")}>
        <NumberInput
          name="axles"
          label={t("UI.labels.carrier_axles")}
          placeholder={t("UI.placeholders.write_carrier_axles")}
          min={1}
          step={1}
          required
        />
        <NumberInput
          name="tires_per_axle"
          label={t("UI.labels.carrier_tires_per_axle")}
          placeholder={t("UI.placeholders.write_carrier_tires_per_axle")}
          min={1}
          step={1}
          required
        />
        <Select
          name="traction"
          label={t("UI.labels.carrier_traction")}
          placeholder={t("UI.placeholders.select_carrier_traction")}
          required
        >
          {["4x2", "6x2", "6x4", "8x2"].map((opt) => (
            <SelectItem key={opt}>{opt}</SelectItem>
          ))}
        </Select>
      </FormGroup>

      <FormGroup label={t("UI.groups.records_and_documents")}>
        <Input
          name="rntrc"
          label={t("UI.labels.carrier_rntrc")}
          placeholder={t("UI.placeholders.write_carrier_rntrc")}
          required
        />
        <Input
          name="owner_document"
          label={t("UI.labels.carrier_owner_document")}
          placeholder={t("UI.placeholders.write_carrier_owner_document")}
          required
        />
        <FileUpload
          name="documents"
          label={t("UI.labels.documents")}
          placeholder={t("UI.placeholders.attach_carrier_documents")}
          accept={["application/pdf", "image/jpeg", "image/png"]}
          multiple
        />
        <FileUpload
          name="pictures"
          label={t("UI.labels.carrier_pictures")}
          placeholder={t("UI.placeholders.attach_carrier_pictures")}
          accept={["image/jpeg", "image/png", "image/webp"]}
          multiple
        />
      </FormGroup>

      <FormGroup label={t("UI.groups.additional_notes")}>
        <Textarea
          name="obs"
          label={t("UI.labels.carrier_obs")}
          placeholder={t("UI.placeholders.write_carrier_obs")}
        />
      </FormGroup>

      <FormFooter>
        <Button
          className="justify-self-end px-16"
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

export default CarrierForm;
