import Checkbox from "@/components/checkbox";
import Input from "@/components/input";
import { useUser } from "@/contexts/auth-provider";
import { useLanguage } from "@/contexts/language-provider";
import { useOverlay } from "@/contexts/overlay-provider";
import { numberInputMask } from "@/lib/utils";
import api from "@/service/api";
import {
  Button,
  Code,
  Form,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { InformationCircleIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import Link from "@/components/link";
import { useRouter } from "next/router";
import { useState } from "react";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const { setIsLoading } = useOverlay();
  const { translateResponse } = useLanguage();
  const { setUser, setToken } = useUser();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    setIsLoading(true);
    api
      .post("/user/login", data)
      .then(({ data }) => {
        api.interceptors.request.use((config) => {
          config.headers.Authorization = `Bearer ${data.token}`;
          return config;
        });
        setToken(data.token);
        setUser(data.user);
        router.push(`/auth-code`);
      })
      .catch(({ response: { data: error } }) => {
        const fields = translateResponse(error.errors);
        setErrors(fields);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Form
        className="flex flex-col flex-1 gap-4"
        validationBehavior="native"
        validationErrors={errors}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col flex-1 md:flex-auto gap-4 w-full">
          <Input
            isRequired
            className="text-gray-700 dark:text-gray-200"
            endContent={
              <Popover placement="top-end" radius="sm" offset={8}>
                <PopoverTrigger>
                  <Button
                    type="button"
                    size="sm"
                    variant="flat"
                    className="-right-[9px]"
                    isIconOnly
                  >
                    <InformationCircleIcon
                      type="rounded"
                      variant="stroke"
                      className="text-default-700 text-xl pointer-events-none"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col gap-1 px-1 py-2 max-w-xs text-gray-700 dark:text-gray-200">
                    <div className="font-bold text-small">
                      {t("UI.tooltips.write_number.title")}
                    </div>
                    <div className="text-tiny">
                      {t("UI.tooltips.write_number.info")}
                    </div>
                    <div className="text-tiny">
                      {t("UI.tooltips.write_number.example")}
                      <Code className="p-0.5 px-1 text-tiny">
                        +55 99 99999-9999
                      </Code>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            }
            label={t("UI.labels.number")}
            labelPlacement="outside"
            name="number"
            placeholder={t("UI.placeholders.write_number")}
            format={numberInputMask}
            type="text"
            variant="bordered"
          />
          <Input
            isRequired
            taggableVisibility
            className="text-gray-700 dark:text-gray-200"
            label={t("UI.labels.password")}
            labelPlacement="outside"
            name="password"
            placeholder={t("UI.placeholders.write_password")}
            type="password"
            variant="bordered"
          />
          <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-2 px-1 py-2 w-full">
            <Checkbox defaultSelected name="remember" value="true" size="sm">
              {t("UI.checkboxes.remember_me")}
            </Checkbox>
            <Link
              href="/reset-password"
              className="hover:opacity-80 min-w-max font-medium text-primary text-sm hover:underline transition-all"
            >
              {t("UI.redirects.forgot_password")}
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Button className="w-full" color="primary" type="submit">
            {t("UI.buttons.enter")}
          </Button>
          <p className="text-small text-center">
            <Link
              href="/sign-up"
              className="hover:opacity-80 font-medium text-primary text-sm hover:underline transition-all"
            >
              {t("UI.redirects.create_account")}
            </Link>
          </p>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
