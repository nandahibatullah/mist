import { Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

const Player = () => {
  const [steamUsername, setSteamUsername] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setSteamUsername(router.query.slug?.toString() ?? "");
    }
  }, [router.isReady, router.query.slug]);

  const {
    data: steamId,
    error,
    isLoading,
    isError,
    isSuccess,
  } = api.player.findProfile.useQuery(
    {
      steamUsername: steamUsername ?? "",
    },
    {
      enabled: !!steamUsername,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  );

  if (isError) {
    void router.push("/");
    notifications.show({
      title: "Steam profile not found",
      message: error.message,
      color: "red",
    });
  }

  return (
    <>
      {isLoading && <Loader />}
      {isSuccess && <p>Steam ID: {steamId}</p>}
    </>
  );
};

export default Player;
