// pages/_document.js
import {Head, Html, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <meta name="theme-color" content="#1c1917"/>

      </Head>
      <body className="bg-gray-900 text-white">
      <Main/>
      <NextScript/>
      </body>
    </Html>
  )
}
