import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript, Box } from "@mantine/core";
import { theme } from "../theme";

export const metadata = {
  title: "Mantine Next.js template",
  description: "I am using Mantine with Next.js!",
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body style={{ marginLeft:"5", backgroundColor:"#f8f9fa"}}>
        <MantineProvider theme={theme}>
          <Box mr={"lg"} ml={"lg"} mt={"lg"} mb={"sm"}>
            {children}
          </Box>
        </MantineProvider>
      </body>
    </html>
  );
}
