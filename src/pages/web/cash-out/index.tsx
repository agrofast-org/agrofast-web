import Body from "@/components/body";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import { Button, Link } from "@heroui/react";
import Head from "next/head";

export default function Index() {
  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="" />
      </Head>
      <Body className="flex flex-row justify-center">
        <section className="flex flex-col items-start gap-4 mx-auto p-4 container">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-semibold text-gray-700 dark:text-gray-200 text-2xl">
              Solicitações de saque
            </h1>
            <Button
              as={Link}
              className="bg-default-200 text-default-700"
              href="/web/carrier/new"
            >
              Nova solicitação
            </Button>
          </div>
          <CashOutList />
        </section>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
