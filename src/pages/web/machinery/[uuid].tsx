import Body from "@/components/body";
import { useState } from "react";
import { formatDocument, numberInputMask } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
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
import MachineryForm from "@/forms/transport/machinery-form";

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

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Body className="flex flex-row justify-center">
        <div className="flex flex-col flex-1 container">
          <div className="flex flex-row justify-center gap-4 px-4 py-6 pb-4 w-full min-h-max">
            <MachineryForm />
          </div>
        </div>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
