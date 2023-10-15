import { TRPCError } from "@trpc/server";
import SteamAPIService from "./steam-api-service";

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
        games: libraryInfo.games,
      },
    };
  }
}
