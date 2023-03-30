import { Field } from "../field/Field";
import { SingleSquare, Square } from "../field/Square"
import { BoosterType } from "./BoosterHandler";

let selectedBlock:Square = null;

export function BoosterTeleport (...rest:any) {
    const [square] = rest;
    const field:Field = this;

    if(selectedBlock){
        const coords: SingleSquare = {x: square.x, y: square.y};
        square.setPosition(selectedBlock.x,selectedBlock.y);
        selectedBlock.setPosition(coords.x,coords.y);

        selectedBlock = null;
        
        field.getParentComponent().subBooster(BoosterType.TELEPORT);
    } else {
        selectedBlock = square;
    }
}