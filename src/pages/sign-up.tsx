import Layout from "@/components/layout";
import { ArrowUpRight01Icon, InformationCircleIcon } from "@hugeicons/react";
import {
  Button,
  Checkbox,
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
import { getPortfolioUrl, numberInputMask } from "@/lib/utils";
import Input from "@/components/input";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/getStaticProps";
import { useRouter } from "next/router";
import Head from "next/head";

export default function SignIn() {
  const router = useRouter();
  const t = useTranslations();
  const [number, setNumber] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handleSubmit");
  };

  return (
    <>
      <Head>
        <title>{t("SignUp.meta_title")}</title>
        <meta name="description" content={t("SignUp.meta_description_1")} />
      </Head>
      <Layout className="flex flex-row" hideHeader>
        <div className="hidden lg:flex flex-[4] flex-col items-center justify-center">
          <section className="flex flex-col items-start p-4 gap-4">
            <h1 className="text-2xl font-light font-mono text-gray-700 dark:text-gray-200">
              {t("Advertizement.self_title1")}
            </h1>
            <h1 className="text-4xl max-w-md font-inter font-bold text-gray-700 dark:text-gray-200">
              {t("Advertizement.self_subtitle1")}
            </h1>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {t("Advertizement.self_description1")}
            </p>
            <Button
              color="success"
              className="gap-1 text-white"
              onPress={() => {
                router.push(`${getPortfolioUrl()}/${router.locale}/about`);
              }}
            >
              {t("Base.see_more")}
              <ArrowUpRight01Icon />
            </Button>
          </section>
        </div>
        <div className="flex flex-[5] md:items-center justify-center max-h-svh overflow-hidden overflow-y-auto">
          <div className="flex w-full max-w-md min-h-max flex-col gap-4 px-8 py-6">
            <div className="flex flex-col items-center gap-2">
              <Agrofast.Logo className="w-40 h-10" />
            </div>
            <p className="pb-2 text-left text-2xl text-gray-700 dark:text-gray-200 font-semibold">
              {t("Base.create_account")}
            </p>
            <Form
              className="flex flex-col gap-4"
              validationBehavior="native"
              onSubmit={handleSubmit}
            >
              <Input
                isRequired
                className="text-gray-700 dark:text-gray-200"
                label={t("Base.name")}
                labelPlacement="outside"
                name="name"
                placeholder={t("Base.write_name")}
                type="text"
                variant="bordered"
              />
              <Input
                isRequired
                className="text-gray-700 dark:text-gray-200"
                label={t("Base.surname")}
                labelPlacement="outside"
                name="surname"
                placeholder={t("Base.write_surname")}
                type="text"
                variant="bordered"
              />
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
                            +55 01 23456-7890
                          </Code>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                }
                label={t("Base.number")}
                labelPlacement="outside"
                name="number"
                placeholder="+55 99 99999-9999"
                value={number}
                onChange={(e) => setNumber(numberInputMask(e.target.value))}
                type="text"
                variant="bordered"
              />
              <Input
                isRequired
                taggableVisibility
                className="text-gray-700 dark:text-gray-200"
                label={t("Base.password")}
                labelPlacement="outside"
                name="password"
                placeholder={t("Base.write_password")}
                type="password"
                variant="bordered"
              />
              <Input
                isRequired
                taggableVisibility
                className="text-gray-700 dark:text-gray-200"
                label={t("Base.password_confirm")}
                labelPlacement="outside"
                name="password_confirm"
                placeholder={t("Base.write_password_confirm")}
                type="password"
                variant="bordered"
              />
              <div className="flex w-full items-start flex-col md:flex-row justify-between md:items-center gap-2 px-1 py-2">
                <Checkbox
                  defaultSelected
                  name="terms_of_use_agreement"
                  size="sm"
                >
                  {t("Base.terms_of_use_agreement")}
                </Checkbox>
              </div>
              <Spacer y={4} />
              <p className="text-start text-small text-gray-700 dark:text-gray-200">
                {t("Base.sign_in_terms_agreement")}
              </p>
              <Button className="w-full" color="primary" type="submit">
                {t("Base.continue")}
              </Button>
            </Form>
            <p className="text-center text-small">
              <Link href="/login" size="sm">
                {t("Base.enter_existing_account")}
              </Link>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
