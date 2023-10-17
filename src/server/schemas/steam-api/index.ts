import { z } from "zod";

export const OwnedGamesResponseSchema = z.object({
  response: z.object({
    game_count: z.number(),
    games: z.array(
      z.object({
        appid: z.number(),
        name: z.string(),
        playtime_forever: z.number(),
        img_icon_url: z.string(),
        has_community_visible_stats: z.boolean().default(false),
        playtime_windows_forever: z.number().optional(),
        playtime_mac_forever: z.number().optional(),
        playtime_linux_forever: z.number().optional(),
        rtime_last_played: z.number().optional(),
        has_workshop: z.boolean().default(false),
        has_market: z.boolean().default(false),
        has_dlc: z.boolean().default(false),
        playtime_disconnected: z.number().optional(),
      }),
    ),
  }),
});

export const PlayerSummariesResponseSchema = z.object({
  response: z.object({
    players: z.array(
      z.object({
        steamid: z.string(),
        communityvisibilitystate: z.number(),
        profilestate: z.number(),
        personaname: z.string(),
        lastlogoff: z.number().optional(),
        profileurl: z.string(),
        avatar: z.string(),
        avatarmedium: z.string(),
        avatarfull: z.string(),
        personastate: z.number(),
        commentpermission: z.number().optional(),
        realname: z.string().optional(),
        primaryclanid: z.string().optional(),
        timecreated: z.number().optional(),
        gameid: z.string().optional(),
        gameserverip: z.string().optional(),
        gameextrainfo: z.string().optional(),
        cityid: z.number().optional(),
        loccountrycode: z.string().optional(),
        locstatecode: z.string().optional(),
        loccityid: z.number().optional(),
      }),
    ),
  }),
});

export const ResolveVanityURLResponseSchema = z.object({
  response: z.object({
    steamid: z.string().optional(),
    success: z.number(),
    message: z.string().optional(),
  }),
});

export const RecentlyPlayedGamesResponseSchema = z.object({
  response: z.object({
    total_count: z.number(),
    games: z.array(
      z.object({
        appid: z.number(),
        name: z.string(),
        playtime_2weeks: z.number(),
        playtime_forever: z.number(),
        img_icon_url: z.string(),
      }),
    ),
  }),
});
