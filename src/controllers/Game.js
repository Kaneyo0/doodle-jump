import GameUi from "../views/GameUi.js";
import Map from "../models/Map.js";
import EventHandler from "./gameControllers/EventHandler.js";
import CollisionHandler from "./gameControllers/CollisionHandler.js";
import MovementController from "./gameControllers/MovementController.js";
import Doodler from "../models/Doodler.js";
import Platform from "../models/platform.js";
import Monster from "../models/Monster.js";
import PowerUp from "../models/PowerUp.js";

const gameWidth = 1000;
const nbPlatforms = 40;
const nbMonsters = 5;
const platformBaseYPosition = window.innerHeight - 100;
const spaceBetweenPlatforms = 100;
const chanceMonsterAppear = 20;
const chanceToPowerUp = 30;

class Game {
    constructor() {
        this.isPaused = false;
        this.Map = new Map(gameWidth);
        this.GameUi = new GameUi(this, this.Map.width);
        this.EventHandler = new EventHandler(this);
        this.CollisionHandler = new CollisionHandler(this);
        this.MovementController = new MovementController();
        this.doodler = new Doodler(gameWidth);
        this.objectQuantity = 0;

        this.activePlatforms = [];
        this.inactivePlatforms = [];
        this.platformYPosition = platformBaseYPosition;

        this.activeMonsters = [];
        this.inactiveMonsters = [];

        this.activePowerUps = [];
        this.inactivePowerUps = [];

        this.activeEffect = false;
        this.timeEffect = 0;
        this.startEffect;

        this.game = function() {
            if (!this.isPaused) {
                this.createGameElements();
                this.moveGameElements();
                this.controlGameElements();
            }
            window.requestAnimationFrame(() => { this.game() });
        }
        
        this.GameUi.initUi();
        window.requestAnimationFrame(() => { this.game() });
    }

    getDoodler() {
        return this.doodler;
    }

    getAllElements() {
        return this.activePlatforms.concat(this.activeMonsters).concat(this.activePowerUps);
    }

    getObjectData(idObject) {
        let result = this.getAllElements().filter(object => { return object.id == idObject });
        return result[0];
    }

    getElementTabs(constructor) {
        switch(constructor) {
            case Platform: 
                return {active: this.activePlatforms, inactive: this.inactivePlatforms}
            case Monster:
                return {active: this.activeMonsters, inactive: this.inactiveMonsters}
            case PowerUp:
                return {active: this.activePowerUps, inactive: this.inactivePowerUps}
            default:
                console.log('Unknown game object');
        } 
    }

    receiveEvent(event) {
       this.EventHandler.handleEvent(event);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }

    restartGame() {
        this.doodler = new Doodler(gameWidth);
        this.isPaused = false;
    }

    createGameElements() {
        while (this.activePlatforms.length < nbPlatforms && this.verifyLastPlatform()) this.createObject(Platform, gameWidth, this.platformYPosition);
    }
    
    moveGameElements() {
        this.doodler.move();
        this.moveEnvironment();
    }

    controlGameElements() {
        this.controlActiveEffect();
        this.CollisionHandler.testCollision();
        this.controlScreenPosition();
        this.GameUi.refreshGameUi();
        this.testObjectsPosition();
    }

    startDoodlerMovement(right, direction) {
        this.MovementController.startObjectMovement(this.doodler, right, direction);
    }

    stopDoodlerMovement(right) {
        this.MovementController.stopObjectMovement(this.doodler, right);
    }

    controlActiveEffect() {
        if (this.activeEffect && Date.now() - this.startEffect >= this.timeEffect) {
            this.activeEffect = false;
            this.doodler.reset();
        }
    }

    controlScreenPosition() {
        if (this.doodler.position.y < window.innerHeight / 3 && this.doodler.isJumping()) {
            this.doodler.canMove = false;
            this.getAllElements().forEach(element => { element.position.y += this.doodler.velocity });
        }
    }

    doodlerIsTouching(object) {
        if (this.doodler.canTouch) {
            let constructor = object.constructor;

            switch(constructor) {
                case Platform:
                    if (!object.broken) {
                        if (!this.doodler.isJumping()) this.doodler.initJump();
                    } else {
                        object.falling = true;
                    }
                    break;
                case Monster:
                    object.skin = '';
                    this.doodler.isJumping() ? this.endGame() : this.doodler.initJump();
                    break;
                case PowerUp:
                    this.applyEffect(object.effect);
                    // if (!object.effect.jump) this.recycleObject(object);
                    break;
                default:
                    console.log(`Unknown ${constructor} element`);
            }
        }
    }

    createObject(constructor, x, y) {
        let random = Math.random() * 100;
        let elemTabs = this.getElementTabs(constructor); 
        let newObject;

        if (elemTabs.inactive.length > 0) {
            newObject = elemTabs.inactive.shift();
            if (constructor == PowerUp) newObject.reset(x, y);
            if (constructor == Platform) newObject.reset(this.platformYPosition);
        } else {
            newObject = new constructor(this.objectQuantity ,x, y);
        }

        this.objectQuantity++;

        if (constructor == Platform) {
            if (this.platformYPosition > -300) this.platformYPosition -= spaceBetweenPlatforms;
            switch (true) {
                case random <= chanceMonsterAppear:
                    if (this.activeMonsters.length < nbMonsters) this.createObject(Monster, gameWidth, this.platformYPosition);
                    break;
                case random <= chanceToPowerUp:
                    if (!newObject.broken && !newObject.canMove) this.createObject(PowerUp, newObject.position.x + (newObject.width/3), newObject.position.y);
                    break;
            }
        }

        elemTabs.active.push(newObject);
        this.GameUi.createObject(newObject);
    }

    moveEnvironment() {
        this.getAllElements().forEach(gameElement => { 
            if (gameElement.constructor != PowerUp) gameElement.refreshMove();
        });
    }

    recycleObject(object) {
        let elemTabs = this.getElementTabs(object.constructor);
        
        elemTabs.inactive.push(object);
        elemTabs.active.splice(elemTabs.active.indexOf(object), 1);

        this.GameUi.recycleObject(object);
    }

    verifyLastPlatform() {
        if (this.activePlatforms.length > 0) {
            for (let index = this.activePlatforms.length - 1; index > 0; index--) {
                if (!this.activePlatforms[index].broken) {
                    if (this.activePlatforms[this.activePlatforms.length - 1].position.y >= this.platformYPosition + spaceBetweenPlatforms) return true;
                    return false;
                }
            }
        }

        return true;
    }

    applyEffect({ time, ...effect }) {
        this.activeEffect = true;
        this.timeEffect = time;
        this.startEffect = Date.now();
        this.doodler.applyEffect(effect);
    }

    testObjectsPosition() {
        this.getAllElements().forEach(gameElement => {
            if (gameElement.position.y > window.innerHeight + gameElement.height) this.recycleObject(gameElement);
        });

        if (this.doodler.position.y > window.innerHeight + 200) this.endGame();
    }

    endGame() {
        this.isPaused = true;
        console.log('Game Over');
    }
}

export default Game;