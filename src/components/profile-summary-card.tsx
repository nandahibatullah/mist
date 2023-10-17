import { Group, Stack, Image, Text, Card } from "@mantine/core";
import { type PlayerInfo } from "~/types";

const gameIconResolver = (appId: number) => {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
};

export const ProfileSummaryCard = ({
  playerInfo,
}: {
  playerInfo: PlayerInfo;
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
        <Text fw={500}>Profile Summary</Text>
      </Group>
      <div className="grid grid-cols-2 grid-rows-3 gap-4 px-4 py-4 lg:grid-cols-3 lg:grid-rows-1">
        <DetailCard>
          <Card.Section className="pb-2">
            <Stack gap={1} align="center">
              <p className="font-extrabold lg:text-[1.5rem]">
                {playerInfo.numberOfGames}
              </p>
              <Text className="text-center" size="sm">
                Games Owned
              </Text>
            </Stack>
          </Card.Section>
        </DetailCard>
        <DetailCard>
          <Card.Section className="pb-2">
            <Stack gap={1} align="center">
              <p className="text-center font-extrabold lg:text-[1.5rem]">
                {playerInfo.totalPlayTime} hours
              </p>
              <Text className="text-center" size="sm">
                Total Steam Playtime
              </Text>
            </Stack>
          </Card.Section>
        </DetailCard>
        <DetailCard classNames="col-span-2 row-span-2 lg:col-span-1 lg:row-span-1">
          <Card.Section>
            <Image
              alt="game-icon"
              src={gameIconResolver(playerInfo.mostPlayedGame.appid)}
              className="relative top-[-1px]"
            />
          </Card.Section>
          <Card.Section className="pb-2">
            <Stack gap={1} align="center">
              <p className="break-word text-center font-extrabold">
                {playerInfo.mostPlayedGame.name}
              </p>
              <Text size="sm">Most played</Text>
            </Stack>
          </Card.Section>
        </DetailCard>
      </div>
    </Card>
  );
};
