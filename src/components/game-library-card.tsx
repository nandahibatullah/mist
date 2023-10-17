import { Group, Image, Text, Card } from "@mantine/core";
import { IconClockPlay } from "@tabler/icons-react";
import Link from "next/link";
import { type SteamGame } from "~/types";

const gameIconResolver = (appId: number) => {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
};

export const GameLibraryCard = ({ game }: { game: SteamGame }) => {
  const urlFriendlyName = game.name.replace(" ", "+");
  const fallBackImageUrl = `https://placehold.co/250x117?text=${urlFriendlyName}`;
  const playTimeInHours = (game.playtime_forever / 60).toFixed(1);

  return (
    <Link href={`https://store.steampowered.com/app/${game.appid}`}>
      <Card
        key={game.appid}
        shadow="xl"
        className="items-center justify-center hover:scale-105"
      >
        <Card.Section>
          <Image
            alt="game-icon"
            src={gameIconResolver(game.appid)}
            fallbackSrc={fallBackImageUrl}
          />
        </Card.Section>
        <Group justify="center" className="pt-2 text-center">
          <IconClockPlay />
          <Text size="xs">{playTimeInHours} hours</Text>
        </Group>
      </Card>
    </Link>
  );
};
