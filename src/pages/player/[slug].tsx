import {
  Group,
  Stack,
  Image,
  Text,
  UnstyledButton,
  Card,
  Loader,
  Center,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Logo from "~/components/logo";
import { api } from "~/utils/api";

const gameIconResolver = (appId: number) => {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
};

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
    error: steamIdError,
    isLoading: isSteamIdLoading,
    isError: isSteamIdError,
    isSuccess: isSteamIdSuccess,
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

  const {
    data: playerSummary,
    isLoading: isSummaryLoading,
    isSuccess: isSummarySuccess,
  } = api.player.summary.useQuery(
    { steamId: steamId ?? "" },
    {
      enabled: !!isSteamIdSuccess,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  );

  if (isSteamIdError) {
    void router.push("/");
    notifications.show({
      title: "Steam profile not found",
      message: steamIdError.message,
      color: "red",
    });
  }

  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex h-32 w-full items-center justify-between px-4">
        <UnstyledButton>
          <div className="grid grid-flow-col items-center gap-2">
            <Logo height={48} width={48} />
            <p className="font-extrabold tracking-tight text-white sm:text-[4rem]">
              MIST
            </p>
          </div>
        </UnstyledButton>
        <Stack align="center" gap="xs ">
          {!!isSummarySuccess && (
            <Image
              className="border-4 border-zinc-700"
              fallbackSrc="https://placehold.co/600x400?text=Placeholder"
              src={playerSummary?.playerInfo.avatarURL}
              alt="player-avatar"
              radius="lg"
              h={64}
              w={64}
            />
          )}
          <p className="font-extrabold text-white">
            {playerSummary?.playerInfo.username}
          </p>
        </Stack>
      </div>
      {(!!isSteamIdLoading || !!isSummaryLoading) && (
        <Center>
          <Loader />
        </Center>
      )}
      {!!isSummarySuccess && (
        <>
          <div className="grid grid-cols-2 grid-rows-1 gap-4">
            <Card shadow="sm" padding="sm" radius="md">
              <Group justify="center" py="xs">
                <Text fw={500}>Profile Summary</Text>
              </Group>
              <div className="grid gap-4 px-4 py-4 lg:grid-cols-3">
                <Card
                  style={{ backgroundColor: "#ffc438", color: "black" }}
                  className="justify-center"
                >
                  <Stack gap={1} align="center">
                    <p className="font-extrabold lg:text-[1.5rem]">
                      {playerSummary?.playerInfo.numberOfGames}
                    </p>
                    <Text className="text-center" size="sm">
                      Games Owned
                    </Text>
                  </Stack>
                </Card>
                <Card
                  style={{ backgroundColor: "#ffc438", color: "black" }}
                  className="justify-center"
                >
                  <Stack gap={1} align="center">
                    <p className="text-center font-extrabold lg:text-[1.5rem]">
                      {playerSummary?.playerInfo.totalPlayTime} hours
                    </p>
                    <Text className="text-center" size="sm">
                      Total Steam Playtime
                    </Text>
                  </Stack>
                </Card>
                <Card
                  style={{ backgroundColor: "#ffc438", color: "black" }}
                  className="justify-center"
                  padding={"lg"}
                >
                  <Card.Section>
                    <Image
                      alt="game-icon"
                      src={gameIconResolver(
                        playerSummary.playerInfo.mostPlayedGame.appid,
                      )}
                    />
                  </Card.Section>
                  <Stack gap={1} align="center">
                    <p className="break-word text-center font-extrabold lg:text-[1.25em]">
                      {playerSummary?.playerInfo.mostPlayedGame.name}
                    </p>
                    <Text size="sm">Most played</Text>
                  </Stack>
                </Card>
              </div>
            </Card>
            <Card shadow="sm" padding="sm" radius="md"></Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Player;
