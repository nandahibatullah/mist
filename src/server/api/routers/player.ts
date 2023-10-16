import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import PlayerService from "~/server/services/player-service";
import SteamAPIService from "~/server/services/steam-api-service";

export const playerRouter = createTRPCRouter({
  summary: publicProcedure
    .input(z.object({ steamId: z.string() }))
    .query(async ({ input }) => {
      return await new PlayerService().fetchSummary(input.steamId);
    }),
  findProfile: publicProcedure
    .input(z.object({ steamUsername: z.string() }))
    .query(async ({ input }) => {
      return await new SteamAPIService().findSteamId(input.steamUsername);
    }),
});
