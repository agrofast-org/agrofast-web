import Body from "@/components/body";
import { useState } from "react";
import { formatDocument, numberInputMask } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { getWebStaticPropsWithMessages } from "@/lib/getStaticProps";
import Head from "next/head";
import api from "@/service/api";
import { useOverlay } from "@/contexts/overlay-provider";
import { useAuth } from "@/contexts/auth-provider";

import userPicture from "@public/img/user-default.png";
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
import { FormValues } from "@/types/form";
import DatePicker from "@/components/input/date-picker";
import Select from "@/components/input/select";
import { SelectItem } from "@heroui/react";
import InputGroupIdentity from "@/components/input/group/input-group-identity";
import { uploadMachineryPicture } from "@/http/mashinery/upload-machinery-picture";

export default function Profile() {
  const t = useTranslations();
  const pt = useTranslations("Pages.SignUp");
  const toast = useToast();

  const { user, setUser } = useAuth();
  const { setIsLoading } = useOverlay();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (data: FormValues) => {
    setIsLoading(true);
    api
      .put("/user", data)
      .then(({ data }) => {
        setUser(data.user);
        toast.success({
          description: t("Messages.success.user_updated_successfully"),
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
    uploadMachineryPicture(file)
      .then(({ user }) => {
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

export const getStaticProps = getWebStaticPropsWithMessages;
