import { Button, TextInput, Text, Stack } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { z } from "zod";
import Logo from "~/components/logo";

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
        <div className="grid grid-flow-col content-end items-center gap-2">
          <Logo height={64} width={64} />
          <span className="text-white">MIST</span>
        </div>
      </h1>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Steam Username"
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
