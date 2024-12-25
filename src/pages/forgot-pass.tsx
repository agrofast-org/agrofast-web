import Layout from "@/components/layout";
import { InformationCircleIcon } from "@hugeicons/react";
import {
  Button,
  Code,
  Form,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
} from "@nextui-org/react";
import { useState } from "react";
import Agrofast from "@/components/ui/agrofast";
import { numberInputMask } from "@/lib/utils";
import Input from "@/components/input";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/getStaticProps";

export default function ForgotPass() {
  const t = useTranslations();

  const [number, setNumber] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handleSubmit");
  };

  return (
    <Layout className="flex flex-row" hideHeader>
      <div className="flex flex-1 md:items-center justify-center max-h-svh overflow-hidden overflow-y-auto">
        <div className="flex w-full max-w-md min-h-max flex-col gap-4 px-8 py-6">
          <div>
            <div className="flex flex-col items-center gap-2">
              <Agrofast.Logo className="w-40 h-10" />
            </div>
            <p className="pb-2 text-left text-2xl text-gray-700 dark:text-gray-200 font-semibold">
              {t("Base.inform_your_number")}
            </p>
            <Form
              className="flex flex-col gap-4"
              validationBehavior="native"
              onSubmit={handleSubmit}
            >
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
                          className="pointer-events-none text-xl text-default-700"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex flex-col gap-1 max-w-xs px-1 py-2 text-gray-700 dark:text-gray-200">
                        <div className="text-small font-bold">
                          {t("Base.write_number")}
                        </div>
                        <div className="text-tiny">
                          {t("Base.write_your_number_info")}
                        </div>
                        <div className="text-tiny">
                          {t("Base.write_your_number_info2")}
                          <Code className="p-0.5 px-1 text-tiny">
                            +55 99 99999-9999
                          </Code>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                }
                label={t("Base.number")}
                labelPlacement="outside"
                name="text"
                placeholder={t("Base.write_number")}
                value={number}
                onChange={(e) => setNumber(numberInputMask(e.target.value))}
                type="text"
                variant="bordered"
              />
              <Spacer y={4} />
              <p className="text-start text-small text-gray-700 dark:text-gray-200">
                {t("Base.sign_in_terms_agreement")}
              </p>
              <Button className="w-full" color="primary" type="submit">
                {t("Base.enter")}
              </Button>
            </Form>
          </div>
          <div className="flex justify-between text-center text-small">
            <Link href="/sign-in" size="sm">
              {t("Base.create_account")}
            </Link>
            <Link href="/sign-in" size="sm">
              {t("Base.enter_existing_account")}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
