import Body from "@/components/body";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import { AddCircle, Pen } from "@solar-icons/react";
import { Button } from "@heroui/react";
import Link from "next/link";
import List, { IdentifierColumn, ListAction, ListColumn, ListOperations } from "@/components/list";
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
              {t("UI.labels.carrier")}
            </h1>
            <Button
              as={Link}
              className="bg-default-200 text-default-700"
              href="/web/carrier/new"
            >
              {t("UI.titles.add", {item: t("UI.labels.carrier")})} <AddCircle weight="LineDuotone" />
            </Button>
          </div>
          <List getUrl="/carrier">
            <IdentifierColumn label="Id" name="uuid" />
            <ListColumn label={t('UI.labels.name')} name="name" />
            <ListColumn label={t("UI.labels.carrier_manufacturer")} name="manufacturer" />
            <ListColumn label={t("UI.labels.carrier_plate")} name="plate" />
            <ListColumn label={t("UI.labels.carrier_body_type")} name="vehicle_type" />
            <ListColumn label={t("UI.labels.carrier_model")} name="model" />
            <ListColumn
              label={t("UI.labels.carrier_manufacturer_date")}
              name="manufacturer_date"
              date
            />
            <ListOperations label={"Operações"}>
              {/* <ListAction
                name="view"
                label={t("UI.buttons.view")}
                icon={<Eye size={22} />}
                onAction={() => {})}
              /> */}
              <ListAction
                name="edit"
                label={t("UI.buttons.edit")}
                icon={<Pen size={22} />}
                onAction={(id) => router.push(`/web/carrier/${id}`)}
              />
              {/* <ListAction
                name="delete"
                label={t("UI.buttons.delete")}
                icon={<TrashBinTrash size={22} className="text-danger" />}
                tooltipProps={{ color: "danger" }}
                onAction={() => {}}
              /> */}
            </ListOperations>
          </List>
        </section>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
