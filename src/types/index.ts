import { type z } from "zod";
import { type OwnedGamesResponseSchema } from "~/server/schemas/steam-api";
import { type RouterOutputs } from "~/utils/api";

export type SteamGame = z.infer<
  typeof OwnedGamesResponseSchema
>["response"]["games"][0];

export type PlayerInfo = RouterOutputs["player"]["summary"]["playerInfo"];
