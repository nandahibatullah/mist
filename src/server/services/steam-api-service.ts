import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";
import { URL, URLSearchParams } from "url";
import {
  OwnedGamesResponseSchema,
  PlayerSummariesResponseSchema,
  ResolveVanityURLResponseSchema,
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
        message: `Failed to fetch Steam data. Status code: ${response.status} returned.`,
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
        message: `Failed to fetch Steam data. Status code: ${response.status} returned.`,
      });
    }

    const responseData = PlayerSummariesResponseSchema.parse(
      await response.json(),
    );

    return responseData.response;
  }

  public async findSteamId(steamUsername: string) {
    const resolveVanityUrlEndpoint = new URL(
      `${STEAM_WEB_API_URL}/ISteamUser/ResolveVanityURL/v1`,
    );
    const queryParams = {
      key: this.steamApiKey,
      vanityurl: steamUsername,
      format: "json",
    };

    resolveVanityUrlEndpoint.search = new URLSearchParams(
      queryParams,
    ).toString();

    const response = await fetch(resolveVanityUrlEndpoint, {
      method: "GET",
    });

    if (response.status !== 200) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch Steam data. Status code: ${response.status} returned.`,
      });
    }

    const responseData = ResolveVanityURLResponseSchema.parse(
      await response.json(),
    );

    if (!responseData.response.steamid) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Failed to find Steam profile for: ${steamUsername}`,
      });
    }

    return responseData.response.steamid;
  }
}
