import { _decorator, Component, Sprite, SpriteFrame, EventTarget, NodeEventType, Vec3, Quat, quat } from 'cc';
import { Field } from './Field';
const { ccclass, property } = _decorator;

type AnimationType = 'blast' | 'grow';

@ccclass('Square')
export class Square extends Component {
    x:number;
    y:number;
    color:string;
    lowScale:Vec3 = new Vec3(0.07,0.07,1);
    dScale:Vec3 = new Vec3(0.2,0.2,1);
    upScale:Vec3 = new Vec3(0.3,0.3,1);
    
    animationCount:number = 0;
    animationType:string|null = null;

    animationSelector: Record<AnimationType, () => void> = {
        'blast': this.blast,
        'grow': this.grow
    }
     
    animationHandler(){
        this.animationSelector[this.animationType].apply(this);
    }

    start() {
        this.node.on(NodeEventType.MOUSE_DOWN, (event) => {
            this.node.parent.getComponent(Field).checkBlast(this);
        });
        this.node.on(NodeEventType.MOUSE_ENTER, (event) => {
            this.node.setScale(this.upScale);
        });
        this.node.on(NodeEventType.MOUSE_LEAVE, (event) => {
            this.node.setScale(this.dScale);
        });
    }

    update(deltaTime: number) {
        if(this.animationType){
            this.animationCount--;
            this.animationHandler();
            if(this.animationCount < 0){
                this.animationType = null;
            }
        }
    }

    build(color:string,spriteFrame:SpriteFrame){
        let spriteComponent:Sprite = this.node.addComponent(Sprite);
        spriteComponent.spriteFrame = spriteFrame;
        this.color = color;
        this.node.setScale(this.lowScale);
        this.setAnimation("grow");
    }

    setPosition(x:number,y:number){
        this.x = x;
        this.y = y;
        this.node.setPosition(new Vec3(x*40,-y*40));
    }

    setAnimation(type:string, n: number = 10){
        this.animationCount = n;
        this.animationType = type;
    }

    grow(){
        const scale:Vec3 = this.node.getScale();
        this.node.setScale(new Vec3(scale.x*1.1,scale.y*1.1,1));
    }

    startBlast(){
        this.setAnimation("blast");
    }

    blast(){
        const scale:Vec3 = this.node.getScale();
        this.node.setScale(new Vec3(scale.x*.9,scale.y*.9,1));
        if(this.animationCount === 0){
            this.node.destroy();
        }
    }
}

