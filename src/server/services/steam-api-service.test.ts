import SteamAPIService, {
  STEAM_WEB_API_URL,
} from "@server/services/steam-api-service";
import { env } from "~/env.mjs";
import { URL, URLSearchParams } from "url";
import { redis } from "~/utils/redis";
import {
  MockGetOwnedGamesResponse,
  MockGetPlayerSummariesResponse,
} from "./__mocks__/steam-api";

const mockRedisCacheEmpty = () => {
  vi.spyOn(redis, "get").mockImplementationOnce(() => Promise.resolve(null));
  vi.spyOn(redis, "set").mockImplementationOnce(() => Promise.resolve("OK"));
};

const mockFetchOwnedGames = () => {
  return vi.spyOn(global, "fetch").mockImplementationOnce(
    () =>
      Promise.resolve({
        json: () => Promise.resolve(MockGetOwnedGamesResponse),
        status: 200,
      }) as Promise<Response>,
  );
};

/** The other functions in the service logic wise is pretty similar
 * to each other. It takes in a response, if it fails, throw, if not, return.
 * The most valuable tests are around the getOwned games. The heaviest endpoint,
 * and with the most "logic".
 */
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
        mockRedisCacheEmpty();
      });

      test("returns a list of the player's owned games", async () => {
        const fetchSpy = mockFetchOwnedGames();
        const response = await service.getOwnedGames("my-steam-id");

        expect(fetchSpy).toBeCalledWith(playerOwnedEndpoint, {
          method: "GET",
        });
        expect(response).toEqual(MockGetOwnedGamesResponse.response);
      });
    });

    describe("when the params aren't correct", () => {
      beforeEach(() => {
        mockRedisCacheEmpty();
      });

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

    describe("when the response is cached", () => {
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
        vi.spyOn(redis, "get").mockImplementationOnce(() =>
          Promise.resolve(JSON.stringify(MockGetOwnedGamesResponse)),
        );
        vi.spyOn(redis, "set").mockImplementationOnce(() =>
          Promise.resolve("OK"),
        );
      });

      test("it fetches data from the redis cache", async () => {
        const fetchSpy = mockFetchOwnedGames();
        const response = await service.getOwnedGames("my-steam-id");

        expect(fetchSpy).not.toBeCalled();
        expect(response).toEqual(MockGetOwnedGamesResponse.response);
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
        mockRedisCacheEmpty();
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
