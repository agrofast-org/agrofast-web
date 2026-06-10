import Body from "@/components/body";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import { GetStaticPaths } from "next";
import { Params } from "next/dist/server/request/params";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/http/request/get-request";
import { RequestCard } from "@/components/ux/transport/request-card";
import { Request } from "@/types/transport";
import { Section } from "@/components/section";

export default function Find() {
  const { query } = useRouter();
  const pt = useTranslations("Pages.SignUp");

  const { data: request, isFetched: requestFetched } = useQuery<Request>({
    queryKey: ["request", query.uuid],
    queryFn: async () =>
      getRequest(query.uuid as string).then(({ data }) => data),
    enabled: !!query.uuid,
  });

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Body className="flex flex-col">
        {request && requestFetched ? (
          <Section className="mx-auto p-4 pb-0 max-w-[912px] container">
            <RequestCard request={request} offerButton={false} />
          </Section>
        ) : (
          <Section className="mx-auto p-4 max-w-[912px] container">
            Carregando chamado...
          </Section>
        )}
      </Body>
    </>
  );
}

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = getStaticPropsWithMessages;
