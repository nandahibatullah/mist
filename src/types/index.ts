import { type z } from "zod";
import {
  type OwnedGamesResponseSchema,
  type PlayerSummariesResponseSchema,
  type RecentlyPlayedGamesResponseSchema,
} from "~/server/schemas/steam-api";
import { type RouterOutputs } from "~/utils/api";

export type PlayerInfo = RouterOutputs["player"]["summary"]["playerInfo"];

export type SteamGame = {
  appId: number;
  name: string;
  playTime: number;
};

export type GetOwnedGamesResponse = z.infer<typeof OwnedGamesResponseSchema>;
export type GetPlayerSummariesResponse = z.infer<
  typeof PlayerSummariesResponseSchema
>;
export type RecentlyPlayedGamesResponse = z.infer<
  typeof RecentlyPlayedGamesResponseSchema
>;
