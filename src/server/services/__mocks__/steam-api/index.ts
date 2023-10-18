import {
  type GetOwnedGamesResponse,
  type GetPlayerSummariesResponse,
  type RecentlyPlayedGamesResponse,
} from "~/types";

export const MockGetOwnedGamesResponse: GetOwnedGamesResponse = {
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

export const MockGetPlayerSummariesResponse: GetPlayerSummariesResponse = {
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

export const MockRecentlyPlayedGamesResponse: RecentlyPlayedGamesResponse = {
  response: {
    total_count: 2,
    games: [
      {
        appid: 1086940,
        name: "Baldur's Gate 3",
        playtime_forever: 12072,
        img_icon_url: "d866cae7ea1e471fdbc206287111f1b642373bd9",
        playtime_2weeks: 12072,
      },
      {
        appid: 1245620,
        name: "ELDEN RING",
        playtime_forever: 136,
        img_icon_url: "b6e290dd5a92ce98f89089a207733c70c41a1871",
        playtime_2weeks: 136,
      },
    ],
  },
};
