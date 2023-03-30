import { _decorator, Component, Node, NodeEventType, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Restart')
export class Restart extends Component {
    start() {
        this.node.parent.on(NodeEventType.MOUSE_DOWN, (event) => {
            director.loadScene("Main");
        });
    }

    update(deltaTime: number) {
        
    }
}