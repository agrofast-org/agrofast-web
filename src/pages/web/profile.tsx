import Body from "@/components/body";
import { useState } from "react";
import { formatDocument, maskFormat, numberInputMask } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { getWebStaticPropsWithMessages } from "@/lib/getStaticProps";
import Head from "next/head";
import api from "@/service/api";
import { useOverlay } from "@/contexts/overlay-provider";
import { useAuth } from "@/contexts/auth-provider";

import userPicture from "@public/img/user-default.png";
import { useLanguage } from "@/contexts/language-provider";
import PhoneNumberHelper from "@/components/ux/phone-number-helper";
import PictureInput from "@/components/input/picture-input";
import { useToast } from "@/service/toast";
import { uploadPicture } from "@/http/user/upload-picture";
import Input from "@/components/input/input";
import InputGroup from "@/components/input/group/input-group";
import InputGroupDisplay, {
  InputGroupItem,
} from "@/components/input/group/input-group-display";
import InputGroupContent from "@/components/input/group/input-group-content";
import Button from "@/components/button";
import Form from "@/components/form";
import DatePicker from "@/components/input/date-picker";
import Select from "@/components/input/select";
import { SelectItem } from "@heroui/react";

export default function Profile() {
  const t = useTranslations();
  const pt = useTranslations("Pages.SignUp");
  const toast = useToast();

  const { translateResponse } = useLanguage();
  const { user, setUser } = useAuth();
  const { setIsLoading } = useOverlay();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    setIsLoading(true);
    api
      .put("/user", data)
      .then(({ data }) => {
        api.interceptors.request.use((config) => {
          config.headers.Authorization = `Bearer ${data.token}`;
          return config;
        });
      })
      .catch(({ response: { data: error } }) => {
        const fields = translateResponse(error.fields);
        setErrors(fields);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmitPicture = async (file: FormData) => {
    setIsLoading(true);
    uploadPicture(file)
      .then(({ data }) => {
        setUser(data.user);
        toast.success({
          description: t("Messages.success.image_uploaded_successfully"),
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Body className="flex flex-row justify-center">
        <div className="flex flex-col flex-1 container">
          <div className="flex flex-row justify-center gap-4 px-4 py-6 pb-4 w-full min-h-max">
            <Form
              className="flex flex-col flex-1 items-center gap-4"
              validationBehavior="native"
              initialData={user}
              validationErrors={errors}
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-4 w-full max-w-96">
                <p className="self-start pr-8 pb-2 font-semibold text-gray-700 dark:text-gray-200 text-2xl text-left">
                  {t("UI.titles.update_account")}
                </p>
                <PictureInput
                  name="profile_picture"
                  label="Foto de perfil"
                  fallbackSrc={userPicture.src}
                  onSubmit={handleSubmitPicture}
                  onSuccess={({ onClose }) => {
                    onClose();
                  }}
                  onError={() => {
                    toast.error({
                      description: t(
                        "Messages.errors.failed_to_upload_profile_picture"
                      ),
                    });
                  }}
                />
                <Input
                  name="name"
                  label={t("UI.labels.name")}
                  placeholder={t("UI.placeholders.write_name")}
                  autoCapitalize="words"
                  type="name"
                />
                <Input
                  name="surname"
                  label={t("UI.labels.surname")}
                  placeholder={t("UI.placeholders.write_surname")}
                  className="text-gray-700 dark:text-gray-200"
                  autoCapitalize="words"
                  type="name"
                />
                <InputGroup label="Documento" prefix="documents" list modal>
                  <InputGroupDisplay>
                    <InputGroupItem name="document_type" label="Tipo">
                      {(val: string) => val?.toUpperCase()}
                    </InputGroupItem>
                    <InputGroupItem name="document" label="Documento">
                      {(val: string, values) => {
                        return formatDocument(val, values?.["document_type"]);
                      }}
                    </InputGroupItem>
                  </InputGroupDisplay>
                  <InputGroupContent>
                    <DatePicker name="emission_date" label="Data de emissão" />
                    <Select
                      name="document_type"
                      className="text-gray-700 dark:text-gray-200"
                      label="Tipo de documento"
                      placeholder="Escolha um tipo de documento"
                    >
                      <SelectItem key={"cpf"}>CPF</SelectItem>
                      <SelectItem key={"cnpj"}>CNPJ</SelectItem>
                    </Select>
                    <Input
                      name="document"
                      className="text-gray-700 dark:text-gray-200"
                      label="Documento"
                      placeholder="CPF ou CNPJ"
                      type="text"
                      format={(val) => maskFormat(val, ["(##) ####-####","(##) # ####-####", "*## (##) # ####-####"])}
                      variant="bordered"
                    />
                  </InputGroupContent>
                </InputGroup>
                <Input
                  name="number"
                  label={t("UI.labels.number")}
                  placeholder={t("UI.placeholders.write_number")}
                  format={numberInputMask}
                  endContent={<PhoneNumberHelper />}
                  disabled
                />
                <Input
                  name="email"
                  label={t("UI.labels.email")}
                  placeholder={t("UI.placeholders.write_email")}
                  className="text-gray-700 dark:text-gray-200"
                  type="email"
                  disabled
                />
                {/* <Input
                  name="password"
                  label={t("UI.labels.password")}
                  placeholder={t("UI.placeholders.write_password")}
                  className="text-gray-700 dark:text-gray-200"
                  taggableVisibility
                  type="password"
                />
                <Input
                  name="password_confirm"
                  label={t("UI.labels.password_confirm")}
                  placeholder={t("UI.placeholders.write_password_confirm")}
                  className="text-gray-700 dark:text-gray-200"
                  taggableVisibility
                  type="password"
                /> */}
                <Button
                  className="justify-self-end"
                  color="primary"
                  type="submit"
                  confirmAction
                >
                  {t("UI.buttons.continue")}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Body>
    </>
  );
}

export const getStaticProps = getWebStaticPropsWithMessages;
