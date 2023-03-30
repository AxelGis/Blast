import { _decorator, Component, Node, NodeEventType, Vec3 } from 'cc';
import { Game } from '../Game';
const { ccclass, property } = _decorator;

@ccclass('Mixer')
export class Mixer extends Component {
    start() {
        this.node.parent.on(NodeEventType.MOUSE_DOWN, (event) => {
            this.node.parent.parent.parent
                .getChildByName("Game")
                .getComponent(Game)
                .mixer();
        });
        this.node.parent.on(NodeEventType.MOUSE_ENTER, (event) => {
            this.node.parent.setScale(new Vec3(2.2,2.2,1));
        });
        this.node.parent.on(NodeEventType.MOUSE_LEAVE, (event) => {
            this.node.parent.setScale(new Vec3(2,2,1));
        });
    }

    update(deltaTime: number) {
        
    }
}

