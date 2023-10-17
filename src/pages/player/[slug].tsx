import {
  Group,
  Stack,
  Image,
  UnstyledButton,
  Title,
  Pagination,
  Center,
  em,
} from "@mantine/core";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { useState } from "react";
import Link from "next/link";
import { GameLibraryCard } from "~/components/game-library-card";
import { ProfileSummaryCard } from "../../components/profile-summary-card";
import { type SteamGame } from "~/types";
import { useMediaQuery } from "@mantine/hooks";
import { NamedLogo } from "~/components/named-logo";
import { RecentlyPlayedCard } from "~/components/recently-played-card";

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

const LibraryDisplay = ({ games }: { games: SteamGame[] }) => {
  const [activePage, setPage] = useState(1);
  const isMobile = useMediaQuery(`(max-width: ${em(900)})`);
  const columns = isMobile ? 3 : 8; // matches col number in grid
  const paginationControllerSize = isMobile ? "sm" : "md";
  const GamesPerPage = columns * 5;
  const totalPages = Math.ceil(games.length / GamesPerPage);
  /**
   * - 1 to active page because indexes start at 0 but pagination at 1.
   * In desktop view:
   * page 1 values should be (0, 40)
   * page 2 values should be (40, 80)
   * ...
   * page 4 values should be (120, 160)
   * */
  const pageStart = (activePage - 1) * GamesPerPage;
  const pageEnd = activePage * GamesPerPage;

  const paginatedGames = games.slice(pageStart, pageEnd);

  return (
    <div className="grid grid-cols-3 gap-3 py-4 lg:grid-cols-8">
      <Group justify="stat" className="col-span-3 lg:col-span-8">
        <Title>Library</Title>
      </Group>
      {paginatedGames.map((game) => (
        <GameLibraryCard key={game.appid} game={game} />
      ))}

      <Center className="col-span-3 py-4 lg:col-span-8">
        <Pagination
          size={paginationControllerSize}
          total={totalPages}
          onChange={setPage}
          withEdges
        />
      </Center>
    </div>
  );
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
        <Link href="/">
          <UnstyledButton className="bg rounded-lg hover:scale-110">
            <NamedLogo />
          </UnstyledButton>
        </Link>
        {!!isSummarySuccess && (
          <Link href={`https://steamcommunity.com/profiles/${props.steamId}`}>
            <Stack align="center" gap="xs ">
              <Image
                className="border-4 border-zinc-700 hover:scale-110"
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                src={playerSummary.playerInfo.avatarURL}
                alt="player-avatar"
                radius="lg"
                h={64}
                w={64}
              />
              <p className="font-extrabold text-white">
                {playerSummary?.playerInfo.username}
              </p>
            </Stack>
          </Link>
        )}
      </div>
      {!!isSummarySuccess && (
        <div className="container w-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ProfileSummaryCard playerInfo={playerSummary.playerInfo} />
            <RecentlyPlayedCard
              recentlyPlayedGames={playerSummary.playerInfo.recentlyPlayedGames}
            />
          </div>
          <LibraryDisplay games={playerSummary.playerInfo.games} />
        </div>
      )}
    </div>
  );
};

export default PlayerPage;
