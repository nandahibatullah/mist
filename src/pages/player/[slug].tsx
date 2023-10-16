import { Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function Player() {
  const router = useRouter();
  const {
    data: steamId,
    error,
    isLoading,
    isError,
    isSuccess,
  } = api.player.findProfile.useQuery(
    {
      steamUsername: router.query.slug?.toString() ?? "",
    },
    {
      retry: false,
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
}
