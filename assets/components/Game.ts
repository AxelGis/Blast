import { _decorator, Component, Node, Sprite, error, SpriteFrame, assetManager, Vec3 } from 'cc';
import { Field } from './field/Field';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    start() {
        let field:Field = this.node.addComponent(Field);
        field.node.setPosition(new Vec3(-350,150));
    }

    update(deltaTime: number) {
        
    }
}

