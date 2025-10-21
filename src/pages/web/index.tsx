import { Layout } from "@/components/layout";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useUser } from "@/contexts/auth-provider";
import { Button } from "@/components/button";
import ProfileTypeForm from "@/forms/profile-type-form";
import RequestForm from "@/forms/request-form";
import ConditionalModal from "@/components/conditional-modal";
import Link from "next/link";
import React from "react";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { getAvailableRequests } from "@/http/request/get-available-requests";

export default function Index() {
  const t = useTranslations("Pages.Web.Index");
  const { user, machinery, carriers, transportLoaded } = useUser();

  const { data } = useQuery({
    queryKey: ["requests-query"],
    queryFn: async () => getAvailableRequests().then((res) => res.data),
    enabled: user?.profile_type === "transporter",
  });

  return (
    <>
      <Head>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
      </Head>
      <Layout>
        <ConditionalModal
          isOpen={!!user && !user?.profile_type}
          canClose={false}
        >
          <ProfileTypeForm />
        </ConditionalModal>
        {!transportLoaded && (
          <section className="flex flex-col justify-center items-center gap-6 mx-auto p-4 max-w-[912px] text-center container">
            <Spinner label={t("messages.loading.profile")} />
          </section>
        )}
        {transportLoaded && user?.profile_type === "requester" && (
          <>
            {machinery && machinery.length > 0 ? (
              <RequestForm />
            ) : (
              <section className="flex flex-col justify-center items-center gap-6 mx-auto p-4 max-w-[912px] text-center container">
                <h1 className="font-bold text-2xl">
                  {t("messages.requester.no_machinery_title")}
                </h1>
                <p className="text-neutral-600 dark:text-neutral-300 text-lg">
                  {t("messages.requester.no_machinery_description")}
                </p>
                <Button color="primary" as={Link} href="/web/machinery/new">
                  {t("messages.requester.register_machinery")}
                </Button>
              </section>
            )}
          </>
        )}
        {transportLoaded && user?.profile_type === "transporter" && (
          <>
            {carriers && carriers.length > 0 ? (
              <section className="flex flex-col justify-center items-center gap-6 mx-auto p-4 max-w-[912px] text-center container">
                <h1 className="font-bold text-2xl">
                  {t("messages.transporter.welcome")}
                </h1>
                <p className="text-neutral-600 dark:text-neutral-300 text-lg">
                  {t("messages.transporter.available_requests_description")}
                </p>
                <div>
                  {data && data.length > 0 ? (
                    <ul>
                      {data.map((request) => (
                        <li key={request.id}>{request.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{t("messages.transporter.no_available_requests")}</p>
                  )}
                </div>
              </section>
            ) : (
              <section className="flex flex-col justify-center items-center gap-6 mx-auto p-4 max-w-[912px] text-center container">
                <h1 className="font-bold text-2xl">
                  {t("messages.transporter.no_vehicles_title")}
                </h1>
                <p className="text-neutral-600 dark:text-neutral-300 text-lg">
                  {t("messages.transporter.no_vehicles_description")}
                </p>
                <Button color="primary" as={Link} href="/web/carrier/new">
                  {t("messages.transporter.register_vehicle")}
                </Button>
              </section>
            )}
          </>
        )}
      </Layout>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
