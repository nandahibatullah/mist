import { TRPCError } from "@trpc/server";
import { type z } from "zod";
import SteamAPIService from "./steam-api-service";
import { type OwnedGamesResponseSchema } from "../schemas/steam-api";

type Games = z.infer<typeof OwnedGamesResponseSchema>["response"]["games"];

export default class PlayerService {
  private readonly steamService: SteamAPIService;

  constructor() {
    this.steamService = new SteamAPIService();
  }

  public async fetchSummary(steamUserId: string) {
    const playerSummaries = await this.steamService.getPlayerSummaries([
      steamUserId,
    ]);
    const libraryInfo = await this.steamService.getOwnedGames(steamUserId);
    const playerInfo = playerSummaries.players[0];

    if (!playerInfo) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Information for player: ${steamUserId} not found`,
      });
    }

    return {
      playerInfo: {
        avatarURL: playerInfo.avatarfull,
        username: playerInfo.personaname,
        steamProfileURL: playerInfo.profileurl,
        numberOfGames: libraryInfo.game_count,
        totalPlayTime: this.calculateEntireLibraryPlaytime(libraryInfo.games),
        mostPlayedGame: this.findMostPlayedGame(libraryInfo.games),
        games: libraryInfo.games,
      },
    };
  }

  private calculateEntireLibraryPlaytime(games: Games) {
    const playtimeMinutes = games.reduce(
      (accumulator, currentGame) => currentGame.playtime_forever + accumulator,
      0,
    );

    return (playtimeMinutes / 60).toFixed(1);
  }

  private findMostPlayedGame(games: Games) {
    const mostPlayedGame = games.reduce((mostPlayed, currentGame) =>
      mostPlayed.playtime_forever > currentGame.playtime_forever
        ? mostPlayed
        : currentGame,
    );

    return mostPlayedGame;
  }
}
