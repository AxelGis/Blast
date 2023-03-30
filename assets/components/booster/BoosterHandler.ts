import { Field } from "../field/Field";
import { BoosterBomb } from "./BoosterBomb";
import { BoosterTeleport } from "./BoosterTeleport";

export enum BoosterType {
    BOMB = "B",
    TELEPORT = "TP"
}

const boosterSelector: Record<BoosterType, () => void> = {
    "B":    BoosterBomb,
    "TP":   BoosterTeleport
}
 
export const boosterHandler = (boosterType:string, field:Field, ...rest:any[]) => {
    boosterSelector[boosterType].apply(field, rest);
}