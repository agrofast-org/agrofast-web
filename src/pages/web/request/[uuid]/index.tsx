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
import { Offer, Request } from "@/types/transport";
import { getRequestOffers } from "@/http/request/get-request-offers";
import { Divider } from "@heroui/react";
import { Section } from "@/components/section";

export default function Find() {
  const { query } = useRouter();
  const pt = useTranslations("Pages.SignUp");

  const { data: request, isFetched: requestFetched } = useQuery<Request>({
    queryKey: ["request", query.uuid],
    queryFn: async () => getRequest(query.uuid as string).then(({ data }) => data),
    enabled: !!query.uuid,
  });

  const { data: offers, isFetched: offersFetched } = useQuery<Offer[]>({
    queryKey: ["request", query.uuid, "offers"],
    queryFn: async () => getRequestOffers(query.uuid as string).then(({ data }) => data),
    enabled: !!query.uuid,
  });

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Body className="flex flex-col justify-center">
        <Section className="mx-auto p-4 max-w-[912px] container">
          {/* <FormBody>
            <RequestUpdateForm
              uuid={Array.isArray(query.uuid) ? query.uuid[0] : query.uuid}
            />
          </FormBody> */}
          {request && requestFetched ? (
            <>
              <RequestCard request={request} offerButton={false} />
            </>
          ) : (
            <>Carregando chamado...</>
          )}
        </Section>
        <Section className="mx-auto p-4 max-w-[912px] container">
          <Divider className="max-w-[912px]" />
        </Section>
        <Section className="mx-auto p-4 max-w-[912px] container">
          {offers && offersFetched ? (
            <>
              {offers.map(() => (
                <>Nn sei oq</>
              ))}
            </>
          ) : (
            <>Ainda não foram feitas ofertas para este chamado.</>
          )}
        </Section>
      </Body>
    </>
  );
}

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = getStaticPropsWithMessages;
