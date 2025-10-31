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
import { Divider, Image, Link, Snippet, Spacer } from "@heroui/react";
import { Section } from "@/components/section";
import { Button } from "@/components/button";
import { api } from "@/service/api";
import { RequestOffersList } from "@/lists/request-offers-list";

export default function Find() {
  const { query } = useRouter();
  const pt = useTranslations("Pages.SignUp");

  const { data: request, isFetched: requestFetched } = useQuery<Request>({
    queryKey: ["request", query.uuid],
    queryFn: async () =>
      getRequest(query.uuid as string).then(({ data }) => data),
    enabled: !!query.uuid,
  });

  const { refetch: refetchVerifyPayment, isFetching: isVerifyingPayment } =
    useQuery({
      queryKey: ["request", query.uuid, "verify_payment"],
      queryFn: async () =>
        api.get(`/request/${query.uuid}/update`).then(({ data }) => data),
      enabled: false,
      retry: false,
      refetchInterval: 5000,
    });

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Body className="flex flex-col">
        {request && requestFetched ? (
          <>
            <Section className="mx-auto p-4 pb-0 max-w-[912px] container">
              <RequestCard request={request} offerButton={false} />
            </Section>
            {request.payment && (
              <>
                <Section className="mx-auto p-4 pt-0 max-w-[912px] container">
                  <h1>
                    {request.payment.status !== "approved"
                      ? "Realize o pagamento"
                      : "Pagamento realizado"}
                  </h1>
                </Section>
                {request.payment.status !== "approved" && (
                  <Section className="sm:flex-row sm:items-start mx-auto p-4 pt-0 pb-0 max-w-[912px] container">
                    <div>
                      <Image
                        className="w-96"
                        src={`data:image/png;base64,${request.payment.qr_code_base64}`}
                        alt="QR Code"
                      />
                    </div>
                    <div className="flex flex-col flex-1 min-h-full">
                      <div>
                        <p className="mb-2">
                          Se preferir, copie e cole o código abaixo no seu
                          aplicativo de banco:
                        </p>
                        <Snippet
                          hideSymbol
                          className=""
                          classNames={{
                            pre: "max-w-80 truncate",
                          }}
                        >
                          {request.payment.qr_code}
                        </Snippet>
                        <p className="mt-4">
                          Acesse o{" "}
                          <Link href={request.payment.ticket_url}>
                            Mercado Pago
                          </Link>{" "}
                          através deste link para mais informações.
                        </p>
                      </div>
                      <Spacer className="sm:h-16" />
                      <div>
                        <p>Já realizou o pagamento?</p>
                        <Button
                          isLoading={isVerifyingPayment}
                          onPress={() => refetchVerifyPayment()}
                        >
                          Verificar status de pagamento
                        </Button>
                      </div>
                    </div>
                  </Section>
                )}
              </>
            )}
          </>
        ) : (
          <Section className="mx-auto p-4 max-w-[912px] container">
            Carregando chamado...
          </Section>
        )}
        <Section className="mx-auto p-4 max-w-[912px] container">
          <Divider className="max-w-[912px]" />
        </Section>
        <Section className="mx-auto p-4 max-w-[912px] container">
          <RequestOffersList />
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
