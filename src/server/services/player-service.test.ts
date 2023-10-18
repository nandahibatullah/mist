import SteamAPIService from "./steam-api-service";
import PlayerService from "./player-service";
import {
  MockGetPlayerSummariesResponse,
  MockGetOwnedGamesResponse,
  MockRecentlyPlayedGamesResponse,
} from "./__mocks__/steam-api";
import { type GetOwnedGamesResponse } from "~/types";

vi.mock("./steam-api-service");

const formatSteamGame = (
  game: GetOwnedGamesResponse["response"]["games"][0],
) => {
  const playTime = (game.playtime_forever / 60).toFixed(1);
  return {
    appId: game.appid,
    name: game.name,
    playTime: Number(playTime),
  };
};

const mockSteamAPIServiceResponses = () => {
  vi.spyOn(
    SteamAPIService.prototype,
    "getPlayerSummaries",
  ).mockImplementationOnce(() =>
    Promise.resolve(MockGetPlayerSummariesResponse.response),
  );
  vi.spyOn(SteamAPIService.prototype, "getOwnedGames").mockImplementationOnce(
    () => Promise.resolve(MockGetOwnedGamesResponse.response),
  );
  vi.spyOn(
    SteamAPIService.prototype,
    "fetchRecentlyPlayed",
  ).mockImplementationOnce(() =>
    Promise.resolve(MockRecentlyPlayedGamesResponse.response),
  );
};

describe("PlayerService", () => {
  const service = new PlayerService();

  describe("fetchSummary()", () => {
    afterEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();
    });

    describe("when steamUserId param is valid", () => {
      const { games: ownedGames } = MockGetOwnedGamesResponse.response;

      beforeEach(() => {
        mockSteamAPIServiceResponses();
      });

      test("returns key player info", async () => {
        const response = await service.fetchSummary("steam-id");
        const { avatarfull, personaname, profileurl } =
          MockGetPlayerSummariesResponse.response.players[0]!;

        expect(response.playerInfo.avatarURL).toEqual(avatarfull);
        expect(response.playerInfo.username).toEqual(personaname);
        expect(response.playerInfo.steamProfileURL).toEqual(profileurl);
        expect(response.playerInfo.numberOfGames).toEqual(
          MockGetOwnedGamesResponse.response.game_count,
        );
      });

      test("returns the total playtime across all games", async () => {
        const totalPlayTimeInMinutes = ownedGames.reduce(
          (acc, curr) => curr.playtime_forever + acc,
          0,
        );
        const expectedPlayTimeInHours = (totalPlayTimeInMinutes / 60).toFixed(
          1,
        );
        const response = await service.fetchSummary("steam-id");

        expect(response.playerInfo.totalPlayTime).toEqual(
          expectedPlayTimeInHours,
        );
      });

      test("returns the most played Game", async () => {
        const mostPlayedGame = ownedGames.reduce((top, current) =>
          top.playtime_forever > current.playtime_forever ? top : current,
        );
        const response = await service.fetchSummary("steam-id");

        expect(response.playerInfo.mostPlayedGame).toEqual(
          formatSteamGame(mostPlayedGame),
        );
      });

      test("returns formatted recently played games", async () => {
        const { games } = MockRecentlyPlayedGamesResponse.response;
        const recentlyPlayedGames = games.map((game) => {
          const recentPlaytimeInHours = (game.playtime_2weeks / 60).toFixed(1);
          return {
            appId: game.appid,
            name: game.name,
            recentPlayTime: recentPlaytimeInHours,
          };
        });
        const response = await service.fetchSummary("steam-id");

        expect(response.playerInfo.recentlyPlayedGames).toEqual(
          recentlyPlayedGames,
        );
      });

      test("returns formatted games in order by most played", async () => {
        const gamesSortedByPlaytime = ownedGames.sort(
          (a, b) => b.playtime_forever - a.playtime_forever,
        );
        const formattedGames = gamesSortedByPlaytime.map((game) =>
          formatSteamGame(game),
        );
        const response = await service.fetchSummary("steam-id");
        expect(response.playerInfo.games).toEqual(formattedGames);
      });
    });

    describe("when steamUserId param is not valid", () => {
      beforeEach(() => {
        vi.spyOn(
          SteamAPIService.prototype,
          "getPlayerSummaries",
        ).mockImplementationOnce(() => Promise.resolve({ players: [] }));
      });

      test("throws a NOT_FOUND error", async () => {
        await expect(() =>
          service.fetchSummary("not-correct-id"),
        ).rejects.toThrow(/Information for player: not-correct-id not found/);
      });
    });
  });
});
