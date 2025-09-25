import { FormErrors, FormValues } from "@/types/form";
import { Form } from "./form";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/service/api";
import { useTranslations } from "next-intl";
import { useToast } from "@/service/toast";
import { cn } from "@/lib/utils";
import { Spinner } from "@heroui/react";
import NotFound from "../error/not-found";
import { useRouter } from "next/router";

export interface CrudFormProps {
  id?: string;
  uuid?: string;
  update?: boolean;
  listUrl?: string;
  getUrl?: string | ((uuid: string) => string);
  postUrl?: string;
  putUrl?: string | ((uuid: string) => string);
  setFetchedData?: (data: FormValues) => void;
  children?: React.ReactNode;
  className?: string;
}

const CrudForm: React.FC<CrudFormProps> = ({
  id,
  uuid,
  update,
  listUrl,
  getUrl: GetUrl,
  postUrl,
  putUrl: PutUrl,
  setFetchedData,
  children,
  className,
}) => {
  const t = useTranslations();
  const toast = useToast();
  const router = useRouter();

  const [notFound, setNotFound] = useState<boolean>(false);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<FormValues>();
  const [formErrors, setFormErrors] = useState<FormErrors>();

  const getUrl = useCallback(() => {
    if (typeof GetUrl === "function") {
      return GetUrl(uuid ?? "");
    }
    return GetUrl;
  }, [GetUrl, uuid]);

  const putUrl = useCallback(() => {
    if (uuid && typeof PutUrl === "function") {
      return PutUrl(uuid);
    }
    if (uuid && typeof PutUrl === "string") {
      return PutUrl;
    }
  }, [PutUrl, uuid]);

  const makeRequest = useCallback(
    (url: string, data: FormValues) => {
      if (update) {
        return api.put(url, data);
      }
      return api.post(url, data);
    },
    [update]
  );

  const handleSubmit = useCallback(
    (data: FormValues) => {
      setFormLoading(true);
      const url = update ? putUrl() : postUrl;
      makeRequest(url ?? "", data)
        .then(() => {
          if (update) {
            toast.success({
              description: t("Messages.success.updated_successfully"),
            });
          } else {
            toast.success({
              description: t("Messages.success.created_successfully"),
            });
          }
          if (listUrl) {
            router.push(listUrl);
          } else {
            router.push("/");
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
    },
    [update, listUrl, postUrl, t, toast, router, makeRequest, putUrl]
  );

  useEffect(() => {
    if (update && !dataFetched) {
      const url = getUrl();
      if (url) {
        api
          .get(url)
          .then(({ data }) => {
            setInitialData(data.data);
            setFetchedData?.(data.data);
          })
          .catch(() => {
            setNotFound(true);
            toast.error({
              description: t("Messages.errors.default"),
            });
          })
          .finally(() => {
            setDataFetched(true);
          });
      }
    }
  }, [update, t, toast, dataFetched, getUrl, setFetchedData]);

  if (notFound) {
    return <NotFound />;
  }

  return (
    <Form
      id={id}
      initialData={initialData}
      validationErrors={formErrors}
      onSubmit={handleSubmit}
      className={cn(
        "relative",
        formLoading ? "pointer-events-none" : "pointer-events-auto",
        className
      )}
    >
      {children}
      <div
        className={cn(
          "z-50 absolute size-[105%] transition-all duration-100",
          formLoading
            ? "opacity-100 pointer-events-auto backdrop-blur-[2px]"
            : "opacity-0 pointer-events-none"
        )}
      >
        <Spinner className="top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2" />
      </div>
    </Form>
  );
};

export default CrudForm;
