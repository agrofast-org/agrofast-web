import Body from "@/components/body";
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
      <Body className="flex flex-row" hideHeader>
        <div className="lg:flex flex-col flex-[4] justify-center items-center hidden">
          <section className="flex flex-col items-start gap-4 p-4">
            <h1 className="font-light font-mono text-2xl text-gray-700 dark:text-gray-200">
              {t("Advertizement.self_title1")}
            </h1>
            <h1 className="max-w-md font-bold font-inter text-4xl text-gray-700 dark:text-gray-200">
              {t("Advertizement.self_subtitle1")}
            </h1>
            <p className="text-gray-700 text-sm dark:text-gray-200">
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
        <div className="flex flex-[5] justify-center md:items-center max-h-svh overflow-hidden overflow-y-auto">
          <div className="flex flex-col gap-4 px-8 py-6 w-full max-w-md min-h-max">
            <div className="flex flex-col items-center gap-2">
              <Agrofast.Logo className="w-40 h-10" />
            </div>
            <p className="pb-2 font-semibold text-2xl text-gray-700 text-left dark:text-gray-200">
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
                type="name"
                autoCapitalize="words"
                variant="bordered"
              />
              <Input
                isRequired
                className="text-gray-700 dark:text-gray-200"
                label={t("Base.surname")}
                labelPlacement="outside"
                name="surname"
                placeholder={t("Base.write_surname")}
                type="name"
                autoCapitalize="words"
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
                          className="text-default-700 text-xl pointer-events-none"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex flex-col gap-1 px-1 py-2 max-w-xs text-gray-700 dark:text-gray-200">
                        <div className="font-bold text-small">
                          {t("Base.write_number")}
                        </div>
                        <div className="text-tiny">
                          {t("Base.write_your_number_info")}
                        </div>
                        <div className="text-tiny">
                          {t("Base.write_your_number_info2")}
                          <Code className="px-1 p-0.5 text-tiny">
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
              <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-2 px-1 py-2 w-full">
                <Checkbox
                  defaultSelected
                  name="terms_of_use_agreement"
                  size="sm"
                >
                  {t("Base.terms_of_use_agreement")}
                </Checkbox>
              </div>
              <Spacer y={4} />
              <p className="text-gray-700 text-small text-start dark:text-gray-200">
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
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
