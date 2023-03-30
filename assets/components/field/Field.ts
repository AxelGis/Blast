import { _decorator, Component, Node, assetManager, SpriteFrame, error, Sprite, Vec3 } from 'cc';
import { boosterHandler } from '../booster/BoosterHandler';
import { Game } from '../Game';
import { SingleSquare, Square } from "../field/Square"
const { ccclass, property } = _decorator;

@ccclass('Field')
export class Field extends Component {
    minBlast:number;
    fieldSize:number[];
    colors:string[];

    sprites:Map<string, SpriteFrame> = new Map<string, SpriteFrame>;
    nears:Square[];
    destroyed:SingleSquare[];
    blocked:boolean = false;

    start() {}

    update(deltaTime: number) {}

    /**
     * Preload sprites
     */
    preload(){
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

    /**
     * Fill game field
     */
    init(){
        const [N,M] = this.fieldSize;
        for(let i=0; i < N; i++){
            for(let j=0; j < M; j++){
                this.addBlock(i,j);
            }
        }
    }

    /**
     * Add new block to field
     * @param x
     * @param y 
     */
    addBlock(x:number, y: number){
        const [color,spriteFrame] = this.getRandomSprite();

        const node = new Node();
        let square:Square = node.addComponent(Square);
        square.build(color,spriteFrame);
        square.setPosition(x,y);
        this.node.addChild(node);
    }

    /**
     * Get random sprite color from set
     * @returns [color:string,spriteFrame:SpriteFrame]
     */
    getRandomSprite():[string,SpriteFrame] {
        const index:number = Math.floor(Math.random() * this.colors.length);
        const color:string = this.colors[index];
        return [color,this.sprites.get(color)];
    }

    initMove(){
        this.nears = [];
        this.destroyed = [];
    }

    /**
     * Blast calculation
     * @param square clicked square
     */
    checkBlast(square:Square){
        if(this.blocked){
            return;
        }

        //boosterHandler
        const boosterType:string|null = this.getParentComponent().activeBooster;
        if(boosterType){
            boosterHandler(boosterType, this, square);
            return;
        }

        //get near blocks
        this.blocked = true;
        this.initMove();
        this.getNears(square.x,square.y,square.color);

        if(this.nears.length === 0){
            this.blocked = false;
            return;
        }

        this.blastBlocks();
    }

    /**
     * Blast blocks
     */
    blastBlocks(){
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

        this.endMove();
    }

    /**
     * Get closest squares by color
     * @param x 
     * @param y 
     * @param color 
     */
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

    /**
     * Move nodes down after blast
     * @param near blasted Node
     */
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
        },500);
    }

    /**
     * Fill empty squares with new blocks
     */
    fillEmpty(){
        if(this.destroyed)
            this.destroyed.forEach((ss,i)=>{
                this.addBlock(ss.x,ss.y);
                this.destroyed.splice(i,1);
            });
        this.blocked = false;
    }

    /**
     * Set move ends
     */
    endMove(){
        this.addScore(this.destroyed.length);
        this.subMove();
    }

    /**
     * Get parent component
     * @returns Game component
     */
    getParentComponent(){
        return this.node.getComponent(Game);
    }

    /**
     * Add scores
     * @param n scores
     */
    addScore(n:number){
        this.getParentComponent().addScore(n);
    }

    /**
     * Sub moves
     * @param n moves, default = 1
     */
    subMove(n:number = 1){
        this.getParentComponent().subMove();
    }

    /**
     * Mix blocks
     */
    mixer(){
        this.node.children.forEach(block=>{
            block.destroy();
        });
        this.init();
    }
}