import { Loader } from "@mantine/core";
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
    // replace with notification
    console.log(error.message);
  }

  return (
    <>
      {isLoading && <Loader />}
      {isSuccess && <p>Steam ID: {steamId}</p>}
    </>
  );
}
