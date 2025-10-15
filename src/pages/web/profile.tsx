import Body from "@/components/body";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import { useOverlay } from "@/contexts/overlay-provider";
import { useUser } from "@/contexts/auth-provider";

import userPicture from "@public/img/user-default.png";
import { PictureInput } from "@/components/input/picture-input";
import { useToast } from "@/service/toast";
import { uploadPicture } from "@/http/user/upload-picture";
import { Input } from "@/components/input/input";
import { Button } from "@/components/button";
import { Form } from "@/components/form/form";
import { FormValues } from "@/types/form";
import Link from "next/link";
import { updateUser } from "@/http/user/update-user";
import { useApp } from "@/contexts/app-context";
import { LinkIcon } from "@heroui/react";

export default function Profile() {
  const t = useTranslations();
  const pt = useTranslations("Pages.SignUp");
  const toast = useToast();

  const { user, setUser } = useUser();
  const { setIsLoading } = useOverlay();
  const { mounted } = useApp();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (data: FormValues) => {
    setIsLoading(true);
    updateUser(data)
      .then(({ data }) => {
        setUser(data.user);
        toast.success({
          description: t("Messages.success.updated_successfully"),
        });
      })
      .catch(({ response: { data: errors } }) => {
        setErrors(errors.errors);
        toast.error({
          description: t("Messages.errors.default"),
        });
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
                  required
                />
                <Input
                  name="surname"
                  label={t("UI.labels.surname")}
                  placeholder={t("UI.placeholders.write_surname")}
                  className="text-gray-700 dark:text-gray-200"
                  autoCapitalize="words"
                  type="name"
                  required
                />
                {mounted && (
                  <Link
                    className="flex justify-start items-center text-foreground text-sm"
                    href={`/web/${
                      user?.profile_type === "requester"
                        ? "machinery"
                        : "carrier"
                    }`}
                  >
                    Meus{" "}
                    {user?.profile_type === "requester"
                      ? "maquinários"
                      : "veículos"}
                    <LinkIcon />
                  </Link>
                )}
                {/* <Input
                  name="number"
                  label={t("UI.labels.number")}
                  placeholder={t("UI.placeholders.write_number")}
                  format={numberInputMask}
                  endContent={<PhoneNumberHelper />}
                  disabled
                /> */}
                <Input
                  name="email"
                  label={t("UI.labels.email")}
                  placeholder={t("UI.placeholders.write_email")}
                  className="text-gray-700 dark:text-gray-200"
                  type="email"
                  disabled
                />
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
            </Form>
          </div>
        </div>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
