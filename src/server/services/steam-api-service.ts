import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";
import { URL, URLSearchParams } from "url";
import {
  OwnedGamesResponseSchema,
  PlayerSummariesResponseSchema,
} from "../schemas/steam-api";

export const STEAM_WEB_API_URL = "https://api.steampowered.com";

export default class SteamAPIService {
  private readonly steamApiKey: string = env.STEAM_API_KEY;

  /**
   * docs: https://developer.valvesoftware.com/wiki/Steam_Web_API#GetOwnedGames_.28v0001.29
   */
  public async getOwnedGames(steamUserId: string) {
    const playerOwnedEndpoint = new URL(
      `${STEAM_WEB_API_URL}/IPlayerService/GetOwnedGames/v1`,
    );
    const queryParams = {
      key: this.steamApiKey,
      steamid: steamUserId,
      include_appinfo: "true",
      include_played_free_games: "true",
      include_extended_appinfo: "true",
      format: "json",
    };

    playerOwnedEndpoint.search = new URLSearchParams(queryParams).toString();

    const response = await fetch(playerOwnedEndpoint, {
      method: "GET",
    });

    if (response.status !== 200) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch steam data. Status code: ${response.status} returned.`,
      });
    }

    const responseData = OwnedGamesResponseSchema.parse(await response.json());

    return responseData.response;
  }

  /**
   * docs: https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29
   */
  public async getPlayerSummaries(steamids: string[]) {
    const playerSummariesEndpoint = new URL(
      `${STEAM_WEB_API_URL}/ISteamUser/GetPlayerSummaries/v0002`,
    );
    const queryParams = {
      key: this.steamApiKey,
      steamids: steamids,
      format: "json",
    };

    playerSummariesEndpoint.search = new URLSearchParams(
      queryParams,
    ).toString();

    const response = await fetch(playerSummariesEndpoint, {
      method: "GET",
    });

    if (response.status !== 200) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch steam data. Status code: ${response.status} returned.`,
      });
    }

    const responseData = PlayerSummariesResponseSchema.parse(
      await response.json(),
    );

    return responseData.response;
  }
}
