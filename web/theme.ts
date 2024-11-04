"use client";

import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryShade:7,
  primaryColor:"cyan",
  autoContrast: true,
  fontFamily: "Arial",  //Helvetica, sans-serif;
  respectReducedMotion: true,
  cursorType: "pointer",
  defaultRadius: "md"
});
