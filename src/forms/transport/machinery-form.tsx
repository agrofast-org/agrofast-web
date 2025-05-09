import Button from "@/components/button";
import CrudForm from "@/components/form/crud-form";
import FormFooter from "@/components/form/form-footer";
import FormGroup from "@/components/form/form-group";
import FormHeader from "@/components/form/form-header";
import DatePicker from "@/components/input/date-picker";
import FileUpload from "@/components/input/file-upload";
import Input from "@/components/input/input";
import NumberInput from "@/components/input/number-input";
import Select, { SelectItem } from "@/components/input/select";
import Textarea from "@/components/input/textarea";
import { Suspension } from "@solar-icons/react";
import { useTranslations } from "next-intl";

const MachineryForm: React.FC<{ uuid?: string }> = ({ uuid }) => {
  const t = useTranslations();

  return (
    <CrudForm
      uuid={uuid}
      update={!!uuid}
      getUrl={(id) => `/machinery/${id}`}
      postUrl="/machinery"
      putUrl={(id) => `/machinery/${id}`}
    >
      <FormHeader className="self-start pr-8 pb-2 font-semibold text-gray-700 dark:text-gray-200 text-2xl text-left">
        {uuid ? t("UI.titles.edit_machinery") : t("UI.titles.add_machinery")}
      </FormHeader>
      <FormGroup label="Identificação">
        <Input
          name="name"
          label="Nome do equipamento"
          placeholder="Nome do equipamento"
        />
        <Input
          name="type"
          label="Categoria/Tipo"
          placeholder="Categoria ou tipo do equipamento"
        />
        <Input
          name="manufacturer"
          label="Fabricante"
          placeholder="Fabricante do equipamento"
        />
        <Input
          name="model"
          label="Modelo"
          placeholder="Modelo do equipamento"
        />
        <DatePicker
          name="manufacturer_date"
          label="Data de fabricação"
          required
        />
      </FormGroup>
      <FormGroup label="Dimensões e peso">
        <NumberInput
          step={0.01}
          name="weight"
          label="Peso bruto (kg)"
          placeholder="Peso em quilos"
        />
        <NumberInput
          step={0.01}
          name="lenght"
          label="Comprimento (m)"
          placeholder="Coprimento em metros"
          endContent={
            <Suspension
              weight="LineDuotone"
              className="border-default-400 border-r-2"
            />
          }
        />
        <NumberInput
          step={0.01}
          name="width"
          label="Largura (m)"
          placeholder="Largura em metros"
          endContent={
            <Suspension
              weight="LineDuotone"
              className="border-default-400 border-b-2"
            />
          }
        />
        <NumberInput
          step={0.01}
          name="height"
          label="Altura (m)"
          placeholder="Altura em Metros"
        />
      </FormGroup>
      <FormGroup label="Dados do veículo">
        <NumberInput
          name="axles"
          label="Quantidade de eixos"
          placeholder="Quantidade de eixos"
        />

        <Select
          name="tire_config"
          label="Configuração de pneus"
          placeholder="Selecione a configuração dos pneus"
        >
          <SelectItem>Padrão (1 pneu por lado)</SelectItem>
          <SelectItem>Flipada (2 pneus por lado)</SelectItem>
        </Select>
        <FileUpload
          name="pictures"
          label="Imagens do veículo"
          placeholder="Selecione as imagens do veículo"
          accept={["image/jpeg", "image/png", "image/webp"]}
          multiple
        />
        <Textarea
          name="obs"
          label="Observações adicionais"
          placeholder="Escreva aqui as observações adicionais"
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

export default MachineryForm;
