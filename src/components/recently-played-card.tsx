import { Group, Stack, Image, Text, Card } from "@mantine/core";
import { type PlayerInfo } from "~/types";

const gameIconResolver = (appId: number) => {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
};

type RecentlyPlayedGames = PlayerInfo["recentlyPlayedGames"];

export const RecentlyPlayedCard = ({
  recentlyPlayedGames,
}: {
  recentlyPlayedGames: RecentlyPlayedGames;
}) => {
  const DetailCard = ({
    children,
    classNames,
  }: {
    children: JSX.Element | JSX.Element[];
    classNames?: string;
  }) => {
    return (
      <Card
        style={{ backgroundColor: "#ffc438", color: "#18181b" }}
        className={"justify-center".concat(" ", classNames ?? "")}
      >
        {children}
      </Card>
    );
  };

  return (
    <Card shadow="sm" padding="sm" radius="md">
      <Group justify="center" py="xs">
        <Text fw={500}>Recently Played Games</Text>
      </Group>
      <div className="grid grid-cols-2 gap-4 px-4 py-4 lg:grid-cols-3">
        {recentlyPlayedGames?.map((game, index) => (
          <DetailCard key={index} classNames="col-span-1 lg:col-span-1">
            <Card.Section>
              <Image
                alt="game-icon"
                src={gameIconResolver(game.appId)}
                className="relative top-[-1px]"
              />
            </Card.Section>
            <Card.Section className="pb-2">
              <Stack gap={1} align="center">
                <p className="break-word text-center font-extrabold">
                  {game.name}
                </p>
                <p className="break-word text-center text-sm">
                  {game.recentPlayTime} hours recently
                </p>
              </Stack>
            </Card.Section>
          </DetailCard>
        ))}
      </div>
    </Card>
  );
};
