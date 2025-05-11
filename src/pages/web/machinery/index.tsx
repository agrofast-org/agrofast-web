import Body from "@/components/body";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import List, {
  IdentifierColumn,
  ListColumn,
  ListOperations,
} from "@/components/list";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Index() {
  const t = useTranslations();
  const pt = useTranslations("Pages.SignUp");
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Body className="flex flex-row justify-center">
        <section className="flex flex-col items-start gap-4 mx-auto p-4 container">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-semibold text-gray-700 dark:text-gray-200 text-2xl">
              {t("Advertizement.titles.primary")}
            </h1>
            <Button as={Link} href="/web/machinery/new">
              Adicionar novo
            </Button>
          </div>
          <List
            getUrl="/machinery"
            // onView={(id) => {}}
            onEdit={(id) => {
              router.push(`/web/machinery/${id}`);
            }}
            // onDelete={(id) => {}}
          >
            <IdentifierColumn label="Id" name="uuid" />
            <ListColumn label="Name" name="name" />
            <ListColumn label="Manufacturer" name="manufacturer" />
            <ListColumn label="Type" name="type" />
            <ListColumn label="Model" name="model" />
            <ListColumn
              label="Manufactured Date"
              name="manufacturer_date"
              date
            />
            {/* <ListColumn label="Weight" name="weight" />
            <ListColumn label="Length" name="length" />
            <ListColumn label="Width" name="width" />
            <ListColumn label="Height" name="height" />
            <ListColumn label="Axles" name="axles" />
            <ListColumn label="Tire Config" name="tire_config" /> */}
            <ListOperations label="Operações" />
          </List>
        </section>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
