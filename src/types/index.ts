import { type RouterOutputs } from "~/utils/api";

export type PlayerInfo = RouterOutputs["player"]["summary"]["playerInfo"];
export type SteamGame = {
  appId: number;
  name: string;
  playTime: number;
};
