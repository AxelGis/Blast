import { _decorator, Component, Node, assetManager, SpriteFrame, error, Sprite, Vec3 } from 'cc';
import { Square } from './Square';
const { ccclass, property } = _decorator;

type SingleSquare = {
    x: number;
    y: number;
}

@ccclass('Field')
export class Field extends Component {
    @property([Number])
    minBlast:number = 2;                                            //K
    @property([Number])
    fieldSize:number[] = [10,10];                                   //[N,M]
    @property([String])
    colors:string[] = ["red","blue","green","yellow","purple"];     //[C]

    sprites:Map<string, SpriteFrame> = new Map<string, SpriteFrame>;
    nears:Square[];
    destroyed:SingleSquare[];

    start() {
        assetManager.loadBundle('squares', (err, bundle) => {
            let cnt = 0;
            this.colors.forEach(color => {
                bundle.load(`${color}/spriteFrame`, SpriteFrame, (err: Error, data: SpriteFrame)=>{
                    cnt++;
                    if (data) { 
                        this.sprites.set(color,data);
                    }
                    if(cnt >= this.colors.length){
                        this.init();
                    }
                });            
            });
        });        
    }

    update(deltaTime: number) {
        
    }

    init(){
        const [N,M] = this.fieldSize;
        for(let i=0; i < N; i++){
            for(let j=0; j < M; j++){
                this.addBlock(i,j);
            }
        }
    }

    addBlock(x:number, y: number){
        const [color,spriteFrame] = this.getRandomSprite();

        const node = new Node();
        let square:Square = node.addComponent(Square);
        square.build(color,spriteFrame);
        square.setPosition(x,y);
        this.node.addChild(node);
    }

    getRandomSprite():[string,SpriteFrame] {
        const index:number = Math.floor(Math.random() * this.colors.length);
        const color:string = this.colors[index];
        return [color,this.sprites.get(color)];
    }

    /**
     * Blast calculation
     */
    checkBlast(square:Square){
        this.nears = [];
        this.destroyed = [];
        this.getNears(square.x,square.y,square.color);

        this.nears.forEach(near=>{
            near.startBlast();
            this.moveColumn(near.node);

            for(let i=0; i<this.fieldSize[1];i++){
                const empty:SingleSquare = {x: near.x,y: i};
                if(!this.destroyed.find(val => val.x === near.x && val.y === i)){
                    this.destroyed.push(empty);
                    break;
                } 
            }
        });
    }

    getNears(x:number,y:number,color:string){
        const nears:Node[] = this.node.children.filter(
            ch => ch.getComponent(Square).color === color && 
                    Math.abs(ch.getComponent(Square).x - x) <= 1 && 
                    Math.abs(ch.getComponent(Square).y - y) <= 1 &&
                    (ch.getComponent(Square).x === x || ch.getComponent(Square).y === y));

        if(nears.length >= this.minBlast)
            nears.forEach(near=>{
                const subSquare:Square = near.getComponent(Square);
                if(this.nears.indexOf(subSquare) === -1){
                    this.nears.push(subSquare);
                    this.getNears(subSquare.x,subSquare.y,subSquare.color);
                }
            });
    }

    moveColumn(near:Node){
        const inLines:Node[] = this.node.children.filter(
            ch => ch.getComponent(Square).x === near.getComponent(Square).x && 
            ch.getComponent(Square).y < near.getComponent(Square).y);

        setTimeout(()=>{
            inLines.forEach(node=>{
                try{
                    const square:Square = node.getComponent(Square);
                    square.setPosition(square.x,++square.y);
                } catch (e) {}
            });

            this.fillEmpty();
        },1000);
    }

    fillEmpty(){
        this.destroyed.forEach((ss,i)=>{
            this.addBlock(ss.x,ss.y);
            this.destroyed.splice(i,1);
        });
    }
}