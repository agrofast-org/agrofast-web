import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-scroll-behavior="smooth" className="bg-default-100 text-default-900">
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
