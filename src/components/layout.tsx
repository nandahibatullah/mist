import Head from "next/head";

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <Head>
        <title>MIST | Steam Profile Analysis</title>
        <meta name="description" content="My Immediate Steam Tracker" />
        <meta name="referrer" content="no-referrer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-foreground flex min-h-screen flex-col items-center">
        {children}
      </main>
    </>
  );
};

export default Layout;
