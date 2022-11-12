import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-theme="dracula">
      <Head>
        <meta property="og:title" content="Quizlet" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://quizlet.aktindo.vercel.app" />
        <meta
          property="og:image"
          content="https://quizlet.aktindo.vercel.app/favicon.ico"
        />
        <meta
          property="og:description"
          content="A simple API-based quiz app."
        />
        <meta name="theme-color" content="	#bf95f9" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
