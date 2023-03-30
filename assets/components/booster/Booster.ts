import { _decorator, Component, Node, NodeEventType, Label, HorizontalTextAlignment, Vec3 } from 'cc';
import { Game } from '../Game';
const { ccclass, property } = _decorator;

@ccclass('Booster')
export class Booster extends Component {
    active:boolean = false;
    text:Label;
    title:Label;
    slug:string = "";
    count:number = 0;

    start() {
        const node = new Node();
        this.text = node.addComponent(Label);
        this.text.fontSize = 80;
        this.text.lineHeight = 80;
        this.text.horizontalAlign = HorizontalTextAlignment.CENTER;
        this.text.node.setPosition(new Vec3(-5,5));
        this.text.string = this.count.toString();
        this.node.parent.getChildByName("boostertext").addChild(node);

        const nodeTitle = new Node();
        this.title = nodeTitle.addComponent(Label);
        this.title.fontSize = 100;
        this.title.lineHeight = 100;
        this.title.horizontalAlign = HorizontalTextAlignment.CENTER;
        this.title.node.setPosition(new Vec3(-5,5));
        this.title.string = this.slug;
        this.node.parent.getChildByName("boosterIcon").addChild(nodeTitle);

        this.node.parent.on(NodeEventType.MOUSE_DOWN, (event) => {
            this.toggle();
        });
    }

    update(deltaTime: number) {
        
    }

    setType(type:string){
        this.slug = type;
        this.title.string = this.slug;
    }

    setValue(count:number){
        this.count = count;
        this.text.string = this.count.toString();
    }
    
    toggle(){
        this.active = !this.active;
        this.title.fontSize = this.active ? 120 : 80;

        this.node.parent.parent.parent
            .getChildByName("Game")
            .getComponent(Game)
            .setActiveBooster(this.active ? this.slug : null);
    }
}