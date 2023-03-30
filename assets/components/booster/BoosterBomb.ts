import { Field } from "../field/Field";
import { Square } from "../field/Square";
import { BoosterType } from "./BoosterHandler";

type BBombType = {
    square:Square;
}

const radius:number = 3;

export function BoosterBomb (...rest:any) {
    const [square] = rest;
    const field:Field = this;

    field.initMove();
    field.nears = field.node.children.reduce((result,fld)=>{
        const block:Square = fld.getComponent(Square);
        if(Math.abs(block.x - square.x) + Math.abs(block.y - square.y) < radius){
            result.push(block);
        }
        return result;
    },[]);

    field.blastBlocks();
    field.getParentComponent().subBooster(BoosterType.BOMB);
}