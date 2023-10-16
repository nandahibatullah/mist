import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import Layout from "~/components/layout";

const theme = createTheme({
  primaryColor: "yellow",
  primaryShade: 5,
  colors: {
    yellow: [
      "#fff9e1",
      "#fff1cc",
      "#ffe29b",
      "#ffd264",
      "#ffc438",
      "#ffbb1c",
      "#ffb709",
      "#e3a000",
      "#ca8e00",
      "#af7900",
    ],
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <Notifications position="top-left" />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
