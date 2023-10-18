import { Group, Text, Card } from "@mantine/core";
import { IconClockPlay } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { type SteamGame } from "~/types";

const steamGameIconResolver = (appId: number) => {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
};

export const GameLibraryCard = ({ game }: { game: SteamGame }) => {
  const urlFriendlyName = game.name.replace(" ", "+");
  const fallBackImageUrl = `https://placehold.co/250x117?text=${urlFriendlyName}`;

  return (
    <Link href={`https://store.steampowered.com/app/${game.appId}`}>
      <Card
        key={game.appId}
        shadow="xl"
        className="items-center justify-center hover:scale-105"
      >
        <Card.Section>
          <Image
            alt="game-icon"
            src={steamGameIconResolver(game.appId)}
            width={182}
            height={85}
            placeholder="blur"
            blurDataURL={fallBackImageUrl}
            priority
          />
        </Card.Section>
        <Group justify="center" className="pt-2 text-center">
          <IconClockPlay />
          <Text size="xs">{game.playTime} hours</Text>
        </Group>
      </Card>
    </Link>
  );
};
