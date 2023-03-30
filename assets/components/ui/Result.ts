import { _decorator, Component, Node, Label, HorizontalTextAlignment, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Result')
export class Result extends Component {
    start() {
        const scores:number = +localStorage.getItem("scores") || 0;
        const record:number = +localStorage.getItem("record") || 0;
        
        const node = new Node();
        const text = node.addComponent(Label);
        text.fontSize = 80;
        text.lineHeight = 80;
        text.horizontalAlign = HorizontalTextAlignment.CENTER;
        text.node.setPosition(new Vec3(-10,10));
        text.string = `Result: ${scores}\nBest result: ${record}`;
        this.node.addChild(node);
    }

    update(deltaTime: number) {
        
    }
}

