// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <Script src="https://cdn.tailwindcss.com" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>
      <body className="bg-gray-900 text-white">
      <Main />
      <NextScript />
      </body>
    </Html>
  )
}
