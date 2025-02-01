import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <script
            // 🟢  REPLACE "X" WITH YOUR actual AdSense publisher ID
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
