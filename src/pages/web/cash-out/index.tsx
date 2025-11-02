import Body from "@/components/body";
import { MakeCashOutRequestButton } from "@/components/ux/transport/make-cash-out-request-button";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import { CashOutList } from "@/lists/cash-out-list";
import Head from "next/head";

export default function Index() {
  return (
    <>
      <Head>
        <title>Solicitações de saque</title>
        <meta name="description" content="" />
      </Head>
      <Body className="flex flex-row justify-center">
        <section className="flex flex-col items-start gap-4 mx-auto p-4 container">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-semibold text-gray-700 dark:text-gray-200 text-2xl">
              Solicitações de saque
            </h1>
            <MakeCashOutRequestButton />
          </div>
          <CashOutList />
        </section>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
