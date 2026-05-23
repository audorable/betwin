import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Web-only HTML root — never runs on mobile.
 * Constrains the app to phone width and centres it on desktop,
 * matching the mobile layout without touching any app screens.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* Expo Router web scroll reset */}
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: WEB_STYLES }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const WEB_STYLES = `
  /* Page background — visible on wide screens outside the phone frame */
  html, body {
    margin: 0;
    padding: 0;
    background-color: #e2d6db;
    min-height: 100vh;
  }

  /* Phone-frame container */
  #root {
    max-width: 430px;
    width: 100%;
    min-height: 100vh;
    margin: 0 auto;
    background-color: #FEF0F4;
    box-shadow: 0 0 60px rgba(0, 0, 0, 0.18);
    position: relative;

    /* Top padding that mimics the iOS status bar gap on web */
    padding-top: env(safe-area-inset-top, 44px);
    box-sizing: border-box;
  }

  /* Ensure the root fills its container */
  #root > div {
    min-height: 100vh;
  }
`;
