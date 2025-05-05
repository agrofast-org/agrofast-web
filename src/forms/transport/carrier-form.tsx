import React from "react";
import Button from "@/components/button";
import CrudForm from "@/components/form/crud-form";
import FormHeader from "@/components/form/form-header";
import FormGroup from "@/components/form/form-group";
import FormFooter from "@/components/form/form-footer";
import Input from "@/components/input/input";
import NumberInput from "@/components/input/number-input";
import Select, { SelectItem } from "@/components/input/select";
import FileUpload from "@/components/input/file-upload";
import Textarea from "@/components/input/textarea";
import { useTranslations } from "next-intl";

const CarrierForm: React.FC<{ uuid?: string }> = ({ uuid }) => {
  const t = useTranslations();

  const currentYear = new Date().getFullYear();

  return (
    <CrudForm
      uuid={uuid}
      update={!!uuid}
      getUrl={(id) => `/carrier/${id}`}
      postUrl="/carrier"
      putUrl={(id) => `/carrier/${id}`}
    >
      <FormHeader className="self-start pr-8 pb-2 font-semibold text-gray-700 dark:text-gray-200 text-2xl text-left">
        {uuid ? t("UI.titles.editVehicle") : t("UI.titles.addVehicle")}
      </FormHeader>

      {/* Identificação */}
      <FormGroup label="Identificação do veículo">
        <Input
          name="plate"
          label="Placa"
          placeholder="ABC1D23"
          // required
        />
        <Input
          name="renavam"
          label="RENAVAM"
          placeholder="Número do RENAVAM"
          // required
        />
        <Input
          name="chassi"
          label="Chassi"
          placeholder="Número do chassi"
          // required
        />
        <Input
          name="manufacturer"
          label="Marca"
          placeholder="Fabricante do veículo"
          // required
        />
        <Input
          name="model"
          label="Modelo"
          placeholder="Modelo do veículo"
          // required
        />
        <NumberInput
          name="manufacture_year"
          label="Ano de fabricação"
          placeholder="YYYY"
          min={1900}
          max={currentYear}
          // required
        />
        <Select
          name="licensing_uf"
          label="UF de licenciamento"
          placeholder="Selecione a UF"
          // required
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

      {/* Descrição e carroceria */}
      <FormGroup label="Tipo e carroceria">
        <Input
          name="vehicle_type"
          label="Tipo de veículo / Descrição"
          placeholder="Ex.: Caminhão-prancha"
          // required
        />
        <Input
          name="body_type"
          label="Carroceria"
          placeholder="Ex.: Prancha simples"
          // required
        />
      </FormGroup>

      {/* Dimensões e pesos */}
      <FormGroup label="Dimensões e capacidades">
        <NumberInput
          name="plank_length"
          label="Comprimento da prancha (m)"
          placeholder="0.00"
          step={0.01}
          min={0}
          // required
        />
        <NumberInput
          name="tare"
          label="Tara (t)"
          placeholder="0.00"
          step={0.01}
          min={0}
          // required
        />
        <NumberInput
          name="pbtc"
          label="PBTC (t)"
          placeholder="0.00"
          step={0.01}
          min={0}
          // required
        />
      </FormGroup>

      {/* Eixos, pneus e tração */}
      <FormGroup label="Eixos e tração">
        <NumberInput
          name="axles"
          label="Quantidade de eixos"
          placeholder="Ex.: 2"
          min={1}
          step={1}
          // required
        />
        <NumberInput
          name="tires_per_axle"
          label="Pneus por eixo"
          placeholder="Ex.: 2"
          min={1}
          step={1}
          // required
        />
        <Select
          name="traction"
          label="Tração"
          placeholder="Selecione a tração"
          // required
        >
          {["4x2", "6x2", "6x4", "8x2"].map((opt) => (
            <SelectItem key={opt}>{opt}</SelectItem>
          ))}
        </Select>
      </FormGroup>

      {/* Registros e documentos */}
      <FormGroup label="Registros e documentos">
        <Input
          name="rntrc"
          label="RNTRC"
          placeholder="Número do RNTRC"
          // required
        />
        <Input
          name="owner_document"
          label="Proprietário (CPF/CNPJ)"
          placeholder="CPF ou CNPJ"
          // required
        />
        <FileUpload
          name="documents"
          label="Documentos (CRLV, comprovante)"
          placeholder="Anexe arquivos (PDF, JPG, PNG)"
          accept={["application/pdf", "image/jpeg", "image/png"]}
          multiple
        />
        <FileUpload
          name="vehicle_photos"
          label="Fotos do veículo"
          placeholder="Selecione imagens"
          accept={["image/jpeg", "image/png", "image/webp"]}
          multiple
        />
      </FormGroup>

      {/* Observações */}
      <FormGroup label="Observações adicionais">
        <Textarea
          name="obs"
          label="Observações adicionais"
          placeholder="Ex.: rampas, suportes laterais, etc."
        />
      </FormGroup>

      <FormFooter>
        <Button
          className="justify-self-end px-16"
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

export default CarrierForm;
