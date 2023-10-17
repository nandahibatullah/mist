import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { Loader, MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import Layout from "~/components/layout";
import { Router } from "next/router";
import { useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("finished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <Notifications position="top-left" />
      <Layout>
        {loading ? (
          <div className="container flex min-h-screen items-center justify-center">
            <Loader />
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
