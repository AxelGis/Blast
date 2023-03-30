import { _decorator, Component, Vec3, director } from 'cc';
import { Booster } from './booster/Booster';
import { BoosterType } from './booster/BoosterHandler';
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
    @property(Number)
    mixCount:number = 2;                                            //S
    @property([String])
    availableBoosters:string[] = [BoosterType.BOMB, BoosterType.TELEPORT]

    movesComponent:Moves = null;
    scoresComponent:Scores = null;
    activeBooster:string|null = null;

    /**
     * Start game - create field with NxM blocks
     */
    start() {
        let field:Field = this.node.addComponent(Field);
        field.node.setPosition(new Vec3(-350,200));
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

    /**
     * Increase scores
     * @param n scores count
     */
    addScore(n:number){
        this.setScores(this.getScores() + n);
    }  

    /**
     * Get current scores
     * @returns number scores
     */
    getScores():number{
        this.scoresComponent = this.scoresComponent ?? this.node.parent.getComponentInChildren(Scores);
        return this.scoresComponent.value;
    }    
 
    /**
     * Set scores in UI
     * @param n scores
     */
    setScores(n:number){
        this.scoresComponent = this.scoresComponent ?? this.node.parent.getComponentInChildren(Scores);
        this.scoresComponent.setValue(n);
    }

    /**
     * Sub moves count
     * @param n default 1
     */
    subMove(n:number = 1){
        this.setMoves(this.getMoves() - n);
    }

    /**
     * Get moves count
     * @returns number moves
     */
    getMoves():number{
        this.movesComponent = this.movesComponent ?? this.node.parent.getComponentInChildren(Moves);
        return this.movesComponent.value;
    }

    /**
     * Set moves in UI
     * @param n number moves
     */
    setMoves(n:number){
        this.movesComponent = this.movesComponent ?? this.node.parent.getComponentInChildren(Moves);
        this.movesComponent.setValue(n);
        if(n <= 0){
            this.endGame();
        }
    }

    /**
     * End game and save current scores and record to localStorage
     */
    endGame(){
        const scores:number = this.getScores();
        localStorage.setItem("scores",scores.toString());
        const lastRecord:number = +localStorage.getItem("record") || 0;
        const record:number = Math.max(lastRecord,scores);
        localStorage.setItem("record",record.toString());

        const scene:string = scores >= this.scoresToWin ? Scenes.win : Scenes.lost;
        director.loadScene(scene);
    }

    /**
     * Get booster UI component
     * @param type 
     * @returns 
     */
    getBooster(type:string):Booster{
        return this.node.parent.getChildByName("bg")
                        .getChildByName("booster"+type)
                        .getChildByName("Booster").getComponent(Booster);
    }

    /**
     * Set active booster type or clear (null)
     * @param type 
     */
    setActiveBooster(type:string|null){
        this.activeBooster = type;

        if(type)
            this.availableBoosters.forEach(boost => {
                if(boost !== type){
                    const booster:Booster = this.getBooster(boost);
                    if(booster.active)
                        booster.deactivate();
                }
            });
    }

    /**
     * Sub booster count by type
     * @param type 
     */
    subBooster(type:string){
        const booster:Booster = this.getBooster(type);
        booster.setValue(--booster.count);
        if(booster.count <= 0){
            this.activeBooster = null;
            booster.deactivate();
        }
    }

    /**
     * Mix game field
     */
    mixer(){
        if(this.mixCount--){
            this.node.getComponent(Field).mixer();
        } else {
            this.endGame();
        }
    }
}