import { TRPCError } from "@trpc/server";
import SteamAPIService from "./steam-api-service";
import { type SteamGame } from "~/types";

export default class PlayerService {
  private readonly steamService: SteamAPIService;

  constructor() {
    this.steamService = new SteamAPIService();
  }

  public async fetchSummary(steamUserId: string) {
    const playerSummaries = await this.steamService.getPlayerSummaries([
      steamUserId,
    ]);
    const playerInfo = playerSummaries.players[0];

    if (!playerInfo) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Information for player: ${steamUserId} not found`,
      });
    }

    const libraryInfo = await this.steamService.getOwnedGames(steamUserId);
    const recentlyPlayedGames = await this.steamService.fetchRecentlyPlayed(
      steamUserId,
    );
    const formattedRecentlyPlayedGames = recentlyPlayedGames.games.map(
      (game) => {
        const recentPlaytimeInHours = (game.playtime_2weeks / 60).toFixed(1);
        return {
          appId: game.appid,
          name: game.name,
          recentPlayTime: recentPlaytimeInHours,
        };
      },
    );

    const sortedGamesByPlaytime = libraryInfo.games.sort(
      (a, b) => b.playtime_forever - a.playtime_forever,
    );

    return {
      playerInfo: {
        avatarURL: playerInfo.avatarfull,
        username: playerInfo.personaname,
        steamProfileURL: playerInfo.profileurl,
        numberOfGames: libraryInfo.game_count,
        totalPlayTime: this.calculateEntireLibraryPlaytime(libraryInfo.games),
        mostPlayedGame: this.findMostPlayedGame(libraryInfo.games),
        recentlyPlayedGames: formattedRecentlyPlayedGames,
        games: sortedGamesByPlaytime,
      },
    };
  }

  private calculateEntireLibraryPlaytime(games: SteamGame[]) {
    const playtimeMinutes = games.reduce(
      (accumulator, currentGame) => currentGame.playtime_forever + accumulator,
      0,
    );

    return (playtimeMinutes / 60).toFixed(1);
  }

  private findMostPlayedGame(games: SteamGame[]) {
    const mostPlayedGame = games.reduce((mostPlayed, currentGame) =>
      mostPlayed.playtime_forever > currentGame.playtime_forever
        ? mostPlayed
        : currentGame,
    );

    return mostPlayedGame;
  }
}
