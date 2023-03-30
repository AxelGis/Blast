import { _decorator, Component, Node, Sprite, error, SpriteFrame, assetManager, Vec3, director } from 'cc';
import { Booster } from './booster/Booster';
import { BoosterType } from './booster/BoosterTypes';
import { Field } from './field/Field';
import { Moves } from './ui/Moves';
import { Scores } from './ui/Scores';
const { ccclass, property } = _decorator;

enum Scenes {
    win = "Win",
    lost = "Lost"
}

@ccclass('Game')
export class Game extends Component {
    @property([Number])
    minBlast:number = 2;                                            //K
    @property([Number])
    fieldSize:number[] = [10,10];                                   //[N,M]
    @property([String])
    colors:string[] = ["red","blue","green","yellow","purple"];     //[C]
    @property(Number)
    scoresToWin:number = 30;                                        //X
    @property(Number)
    maxMoves:number = 10;                                           //Y
    @property([String])
    availableBoosters:string[] = [BoosterType.BOMB, BoosterType.TELEPORT]

    movesComponent:Moves = null;
    scoresComponent:Scores = null;
    activeBooster:string|null = null;

    start() {
        let field:Field = this.node.addComponent(Field);
        field.node.setPosition(new Vec3(-350,150));
        field.minBlast = this.minBlast;
        field.fieldSize = this.fieldSize;
        field.colors = this.colors;
        field.preload();

        this.setMoves(this.maxMoves);
        this.setScores(0);

        this.availableBoosters.forEach(boost => {
            const booster:Booster = this.getBooster(boost);
            booster.setType(boost);
            booster.setValue(2);
        });
    }

    update(deltaTime: number) {
        
    }

    addScore(n:number){
        this.setScores(this.getScores() + n);
    }  

    getScores(){
        this.scoresComponent = this.scoresComponent ?? this.node.parent.getComponentInChildren(Scores);
        return this.scoresComponent.value;
    }    
    
    setScores(n:number){
        this.scoresComponent = this.scoresComponent ?? this.node.parent.getComponentInChildren(Scores);
        this.scoresComponent.setValue(n);
    }

    subMove(n:number = 1){
        this.setMoves(this.getMoves() - n);
    }

    getMoves():number{
        this.movesComponent = this.movesComponent ?? this.node.parent.getComponentInChildren(Moves);
        return this.movesComponent.value;
    }

    setMoves(n:number){
        this.movesComponent = this.movesComponent ?? this.node.parent.getComponentInChildren(Moves);
        this.movesComponent.setValue(n);
        if(n <= 0){
            this.endGame();
        }
    }

    endGame(){
        const scores:number = this.getScores();
        localStorage.setItem("scores",scores.toString());
        const lastRecord:number = +localStorage.getItem("record") || 0;
        const record:number = Math.max(lastRecord,scores);
        localStorage.setItem("record",record.toString());

        const scene:string = scores >= this.scoresToWin ? Scenes.win : Scenes.lost;
        director.loadScene(scene);
    }

    getBooster(type:string){
        return this.node.parent.getChildByName("bg")
                        .getChildByName("booster"+type)
                        .getChildByName("Booster").getComponent(Booster);
    }

    setActiveBooster(type:string|null){
        this.activeBooster = type;

        if(type)
            this.availableBoosters.forEach(boost => {
                if(boost !== type){
                    const booster:Booster = this.getBooster(boost);
                    if(booster.active)
                        booster.toggle();
                }
            });
    }
}