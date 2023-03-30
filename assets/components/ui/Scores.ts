import { _decorator, Node, Label, HorizontalTextAlignment, Vec3 } from 'cc';
import { Editable } from './Editable';
const { ccclass, property } = _decorator;

@ccclass('Scores')
export class Scores extends Editable {
    start() {
        const node = new Node();
        this.text = node.addComponent(Label);
        this.text.fontSize = 200;
        this.text.lineHeight = 200;
        this.text.horizontalAlign = HorizontalTextAlignment.CENTER;
        this.text.node.setPosition(new Vec3(-10,10));
        this.text.string = this.value.toString();
        this.node.addChild(node);
    }
}

