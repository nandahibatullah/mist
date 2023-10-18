import {
  Button,
  TextInput,
  Text,
  Stack,
  Group,
  HoverCard,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { z } from "zod";
import { NamedLogo } from "../components/named-logo";
import { IconInfoCircle } from "@tabler/icons-react";
import Link from "next/link";

const steamInfoSchema = z.object({
  steamUsername: z
    .string()
    .min(1, { message: "Please enter your Steam username" }),
});

type SteamInfoFormData = z.infer<typeof steamInfoSchema>;

export default function Home() {
  const form = useForm<SteamInfoFormData>({
    validate: zodResolver(steamInfoSchema),
    initialValues: {
      steamUsername: "",
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (router.query?.error === "not-found") {
      notifications.show({
        title: "Steam profile not found",
        message: "Failed loading user",
        color: "red",
      });
      void router.push("/");
    }
  });

  const handleSubmit = (data: SteamInfoFormData) => {
    console.log(data.steamUsername);
    void router.push(`/player/${data.steamUsername}`);
  };

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        <NamedLogo />
      </h1>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label={
              <Group justify="center" className="items-center pb-2">
                <Text>Steam Username | Steam ID</Text>
                <HoverCard width={280} shadow="md" withArrow position="right">
                  <HoverCard.Target>
                    <IconInfoCircle />
                  </HoverCard.Target>
                  <HoverCard.Dropdown className="items-center">
                    <Text size="sm">
                      Click
                      <Link
                        className="font-extrabold"
                        href="https://help.steampowered.com/en/faqs/view/2816-BE67-5B69-0FEC"
                      >
                        {" here "}
                      </Link>
                      for more information.
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>
            }
            {...form.getInputProps("steamUsername")}
          />
          <Button
            type="submit"
            size="sm"
            className="bg-[#ffb400] text-zinc-900"
          >
            <Text size="sm" c="#18181b">
              View Profile
            </Text>
          </Button>
        </Stack>
      </form>
    </div>
  );
}
