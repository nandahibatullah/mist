import Head from "next/head";
import Link from "next/link";
import router from "next/router";

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <Head>
        <title>MIST | Steam Profile Analysis</title>
        <meta name="description" content="My Immediate Steam Tracker" />
        <meta name="referrer" content="no-referrer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-foreground flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
