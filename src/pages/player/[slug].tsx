import { Group, Stack, Image, Text, UnstyledButton, Card } from "@mantine/core";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import Logo from "~/components/logo";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ slug: string }>,
) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson,
  });

  const slug = context.params?.slug ?? "";

  try {
    const steamId = await helpers.player.findProfile.fetch({
      steamUsername: slug,
    });

    await helpers.player.summary.prefetch({ steamId });

    return {
      props: {
        trpcState: helpers.dehydrate(),
        steamId,
      },
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/?error=not-found",
      },
    };
  }
};

const gameIconResolver = (appId: number) => {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
};

const PlayerPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { data: playerSummary, isSuccess: isSummarySuccess } =
    api.player.summary.useQuery(
      { steamId: props.steamId },
      {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
      },
    );

  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex h-32 w-full items-center justify-between px-4">
        <UnstyledButton className="bg rounded-lg hover:scale-110">
          <div className="grid grid-flow-col items-center gap-2 px-4 py-4">
            <Logo height={48} width={48} />
            <p className="font-extrabold tracking-tight text-white sm:text-[4rem]">
              MIST
            </p>
          </div>
        </UnstyledButton>
        <Stack align="center" gap="xs ">
          {!!isSummarySuccess && (
            <Image
              className="border-4 border-zinc-700 hover:scale-110"
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
                  className="justify-center hover:scale-105"
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
                  className="justify-center hover:scale-105"
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
                  className="justify-center hover:scale-105"
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

export default PlayerPage;
