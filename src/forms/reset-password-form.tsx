import Input from "@/components/input";
import { numberInputMask } from "@/lib/utils";
import {
  Button,
  Code,
  Form,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
} from "@heroui/react";
import { InformationCircleIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import Link from "@/components/link";
import { useState } from "react";

const ResetPasswordForm: React.FC = () => {
  const t = useTranslations();

  const [number, setNumber] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handleSubmit");
  };

  return (
    <>
      <Form
        className="flex flex-col flex-1 gap-4"
        validationBehavior="native"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col flex-1 md:flex-auto w-full">
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
            name="text"
            placeholder={t("UI.placeholders.write_number")}
            value={number}
            onChange={(e) => setNumber(numberInputMask(e.target.value))}
            type="text"
            variant="bordered"
          />
        </div>
        <Spacer y={8} />
        <div className="flex flex-col gap-4 w-full">
          <p className="text-gray-700 dark:text-gray-200 text-small text-start">
            {t("Legal.agreements.login_terms")}
          </p>
          <Button className="w-full" color="primary" type="submit">
            {t("UI.buttons.enter")}
          </Button>
          <div className="flex justify-between text-small text-center">
            <Link
              href="/sign-up"
              className="hover:opacity-80 font-medium text-primary text-sm hover:underline transition-all"
            >
              {t("UI.redirects.create_account")}
            </Link>
            <Link
              href="/login"
              className="hover:opacity-80 font-medium text-primary text-sm hover:underline transition-all"
            >
              {t("UI.redirects.enter_existing_account")}
            </Link>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ResetPasswordForm;
