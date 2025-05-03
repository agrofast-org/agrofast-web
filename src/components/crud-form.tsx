import { FormErrors, FormValues } from "@/types/form";
import Form from "./form";
import { useEffect, useState } from "react";
import api from "@/service/api";
import { useTranslations } from "next-intl";
import { useToast } from "@/service/toast";
import { cn } from "@/lib/utils";
import { Spinner } from "@heroui/react";

export interface CrudFormProps {
  uuid?: string;
  update?: boolean;
  getUrl?: string | ((uuid: string) => string);
  postUrl?: string;
  putUrl?: string | ((uuid: string) => string);
  children?: React.ReactNode;
  className?: string;
}

const CrudForm: React.FC<CrudFormProps> = ({
  uuid,
  update,
  getUrl: GetUrl,
  postUrl,
  putUrl: PutUrl,
  children,
  className,
}) => {
  const t = useTranslations();
  const toast = useToast();

  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<FormValues>();
  const [formErrors, setFormErrors] = useState<FormErrors>();

  const getUrl = () => {
    if (typeof GetUrl === "function") {
      return GetUrl(uuid ?? "");
    }
    return GetUrl;
  };

  const putUrl = () => {
    if (uuid && typeof PutUrl === "function") {
      return PutUrl(uuid);
    }
    if (uuid && typeof PutUrl === "string") {
      return PutUrl;
    }
  };

  const makeRequest = (url: string, data: FormValues) => {
    if (update) {
      return api.put(url, data);
    }
    return api.post(url, data);
  };

  const handleSubmit = (data: FormValues) => {
    setFormLoading(true);
    const url = update ? putUrl() : postUrl;
    makeRequest(url ?? "", data)
      .then(({ data }) => {
        if (update) {
          toast.success({
            description: t("Messages.success.user_updated_successfully"),
          });
        } else {
          toast.success({
            description: t("Messages.success.user_created_successfully"),
          });
        }
      })
      .catch(({ response: { data: errors } }) => {
        setFormErrors(errors.errors);
        toast.error({
          description: t("Messages.errors.default"),
        });
      })
      .finally(() => {
        setFormLoading(false);
      });
  };

  useEffect(() => {
    if (update) {
      const url = getUrl();
      if (url) {
        api
          .get(url)
          .then(({ data }) => {
            setInitialData(data);
          })
          .catch(() => {
            toast.error({
              description: t("Messages.errors.default"),
            });
          });
      }
    }
  }, []);

  return (
    <Form
      initialData={initialData}
      validationErrors={formErrors}
      onSubmit={handleSubmit}
      className={className}
    >
      {children}
      <div
        className={cn(
          "transition-all duration-100",
          formLoading
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        )}
      >
        <Spinner className="top-0 left-0 absolute -translate-x-1/2 -translate-y-1/2" />
      </div>
    </Form>
  );
};

export default CrudForm;
