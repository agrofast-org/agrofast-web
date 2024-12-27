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
} from "@nextui-org/react";
import { useState } from "react";
import Agrofast from "@/components/ui/agrofast";
import { getPortfolioUrl, numberInputMask } from "@/lib/utils";
import Input from "@/components/input";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/getStaticProps";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Login() {
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
        <title>{t("Login.meta_title")}</title>
        <meta name="description" content={t("Login.meta_description_1")} />
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
              {t("Base.enter_existing_account")}
            </p>
            <Form
              className="flex flex-col flex-1 gap-4"
              validationBehavior="native"
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
                            {t("Base.write_number")}
                          </div>
                          <div className="text-tiny">
                            {t("Base.write_your_number_info")}
                          </div>
                          <div className="text-tiny">
                            {t("Base.write_your_number_info2")}
                            <Code className="px-1 p-0.5 text-tiny">
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
                <Input
                  isRequired
                  className="text-gray-700 dark:text-gray-200"
                  label={t("Base.password")}
                  labelPlacement="outside"
                  name="password"
                  placeholder={t("Base.write_password")}
                  type="password"
                  variant="bordered"
                />
                <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-2 px-1 py-2 w-full">
                  <Checkbox defaultSelected name="remember" size="sm">
                    {t("Base.remember_me")}
                  </Checkbox>
                  <Link
                    className="text-gray-700 hover:text-gray-900 dark:hover:text-gray-300 dark:text-gray-200 hover:underline"
                    href="/forgot-password"
                    size="sm"
                  >
                    {t("Base.forgot_password")}
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <Button className="w-full" color="primary" type="submit">
                  {t("Base.enter")}
                </Button>
                <p className="text-center text-small">
                  <Link href="/sign-in" size="sm">
                    {t("Base.create_account")}
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
