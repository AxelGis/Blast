import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Editable')
export class Editable extends Component {
    value:number = 0;
    text:Label;

    start() {

    }

    update(deltaTime: number) {
        
    }

    setValue(value:number){
        this.value = value;
        this.text.string = this.value.toString();
    }
}

