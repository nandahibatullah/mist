import SteamAPIService, {
  STEAM_WEB_API_URL,
} from "@server/services/steam-api-service";
import type {
  OwnedGamesResponseSchema,
  PlayerSummariesResponseSchema,
} from "@server/schemas/steam-api";
import { type z } from "zod";
import { env } from "~/env.mjs";
import { URL, URLSearchParams } from "url";

type GetOwnedGamesResponse = z.infer<typeof OwnedGamesResponseSchema>;
type GetPlayerSummariesResponse = z.infer<typeof PlayerSummariesResponseSchema>;

const MockGetOwnedGamesResponse: GetOwnedGamesResponse = {
  response: {
    game_count: 2,
    games: [
      {
        appid: 1086940,
        name: "Baldur's Gate 3",
        playtime_forever: 12072,
        img_icon_url: "d866cae7ea1e471fdbc206287111f1b642373bd9",
        has_community_visible_stats: true,
        playtime_windows_forever: 12072,
        playtime_mac_forever: 0,
        playtime_linux_forever: 0,
        rtime_last_played: 1696676944,
        has_workshop: false,
        has_market: false,
        has_dlc: true,
        playtime_disconnected: 178,
      },
      {
        appid: 1245620,
        name: "ELDEN RING",
        playtime_forever: 136,
        img_icon_url: "b6e290dd5a92ce98f89089a207733c70c41a1871",
        has_community_visible_stats: true,
        playtime_windows_forever: 136,
        playtime_mac_forever: 0,
        playtime_linux_forever: 0,
        rtime_last_played: 1677886883,
        has_workshop: false,
        has_market: false,
        has_dlc: true,
        playtime_disconnected: 0,
      },
    ],
  },
};

const MockGetPlayerSummariesResponse: GetPlayerSummariesResponse = {
  response: {
    players: [
      {
        steamid: "76561198034698530",
        communityvisibilitystate: 3,
        profilestate: 1,
        personaname: "Captain Picard",
        commentpermission: 2,
        profileurl: "https://steamcommunity.com/id/cloonaid/",
        avatar:
          "https://avatars.steamstatic.com/5867f563183ad6ade9758995afc86ebf7165746b.jpg",
        avatarmedium:
          "https://avatars.steamstatic.com/5867f563183ad6ade9758995afc86ebf7165746b_medium.jpg",
        avatarfull:
          "https://avatars.steamstatic.com/5867f563183ad6ade9758995afc86ebf7165746b_full.jpg",
        personastate: 0,
        realname: "Jean-Luc Picard",
        primaryclanid: "103582791435617037",
        timecreated: 1291675132,
        loccountrycode: "FR",
        locstatecode: "A6",
      },
    ],
  },
};

describe("SteamAPIService", () => {
  const service = new SteamAPIService();

  describe("getOwnedGames", () => {
    describe("when the params are correct", () => {
      const steamId = "my-steam-id";
      const playerOwnedEndpoint = new URL(
        `${STEAM_WEB_API_URL}/IPlayerService/GetOwnedGames/v1`,
      );
      const queryParams = {
        key: env.STEAM_API_KEY,
        steamid: steamId,
        include_appinfo: "true",
        include_played_free_games: "true",
        include_extended_appinfo: "true",
        format: "json",
      };

      beforeEach(() => {
        playerOwnedEndpoint.search = new URLSearchParams(
          queryParams,
        ).toString();
      });

      test("returns a list of the player's owned games", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementationOnce(
          () =>
            Promise.resolve({
              json: () => Promise.resolve(MockGetOwnedGamesResponse),
              status: 200,
            }) as Promise<Response>,
        );

        const response = await service.getOwnedGames("my-steam-id");

        expect(fetchSpy).toBeCalledWith(playerOwnedEndpoint, {
          method: "GET",
        });

        expect(response).toEqual(MockGetOwnedGamesResponse.response);
      });
    });

    describe("when the params aren't correct", () => {
      test("throws an error", async () => {
        vi.spyOn(global, "fetch").mockImplementationOnce(
          () =>
            Promise.resolve({
              status: 400,
            }) as Promise<Response>,
        );

        await expect(() =>
          service.getOwnedGames("not-correct-id"),
        ).rejects.toThrow(/Failed to fetch Steam data/);
      });
    });
  });

  describe("getPlayerSummaries", () => {
    describe("when the params are correct", () => {
      const steamId = "my-steam-id";
      const playerSummariesEndpoint = new URL(
        `${STEAM_WEB_API_URL}/ISteamUser/GetPlayerSummaries/v0002/`,
      );
      const queryParams = {
        key: env.STEAM_API_KEY,
        steamids: [steamId],
        format: "json",
      };

      beforeEach(() => {
        playerSummariesEndpoint.search = new URLSearchParams(
          queryParams,
        ).toString();
      });

      test("returns a list of information about the players", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementationOnce(
          () =>
            Promise.resolve({
              json: () => Promise.resolve(MockGetPlayerSummariesResponse),
              status: 200,
            }) as Promise<Response>,
        );

        const response = await service.getPlayerSummaries([steamId]);

        expect(fetchSpy).toBeCalledWith(playerSummariesEndpoint, {
          method: "GET",
        });
        expect(response).toEqual(MockGetPlayerSummariesResponse.response);
      });
    });

    describe("when the params aren't correct", () => {
      test("throws an error", async () => {
        vi.spyOn(global, "fetch").mockImplementationOnce(
          () =>
            Promise.resolve({
              status: 400,
            }) as Promise<Response>,
        );

        await expect(() =>
          service.getOwnedGames("not-correct-id"),
        ).rejects.toThrow(/Failed to fetch Steam data/);
      });
    });
  });
});
