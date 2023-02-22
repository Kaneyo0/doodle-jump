import GameUi from "../views/GameUi.js";
import Map from "../models/Map.js";
import EventHandler from "./gameControllers/EventHandler.js";
import CollisionHandler from "./gameControllers/CollisionHandler.js";
import MovementController from "./gameControllers/MovementController.js";
import Doodler from "../models/Doodler.js";
import Platform from "../models/platform.js";
import Monster from "../models/Monster.js";
import PowerUp from "../models/PowerUp.js";

const gameWidth = 1200;
const nbPlatforms = 20;
const nbMonsters = 5;
const platformBaseYPosition = window.innerHeight - 100;
const spaceBetweenPlatforms = 100;


class Game {
    constructor() {
        this.isPaused = false;
        this.Map = new Map(gameWidth);
        this.GameUi = new GameUi(this, this.Map.width);
        this.EventHandler = new EventHandler(this);
        this.CollisionHandler = new CollisionHandler(this);
        this.MovementController = new MovementController();
        this.doodler = new Doodler(gameWidth/2);
        this.objectQuantity = 0;

        this.activePlatforms = [];
        this.inactivePlatforms = [];
        this.platformYPosition = platformBaseYPosition;

        this.activeMonsters = [];
        this.inactiveMonsters = [];

        this.activePowerUps = [];
        this.inactivePowerUps = [];

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
        this.doodler = new Doodler(gameWidth/2);
        this.isPaused = false;
    }

    createGameElements() {
        while (this.activePlatforms.length < nbPlatforms && this.verifyLastPlatform()) {
            this.createObject(Platform, gameWidth, this.platformYPosition);
        }
        // this.createPlatforms();
        // this.createMonsters();
    }
    
    moveGameElements() {
        this.doodler.horizontalMove();
        this.doodler.jump();
        this.moveEnvironment();
    }

    controlGameElements() {
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

    controlScreenPosition() {
        if (this.doodler.position.y < window.innerHeight / 3) {
            this.doodler.move = false;
            this.getAllElements().forEach(element => { element.position.y += this.doodler.velocity });
        }
    }

    jumpDoodler() {
        this.doodler.initJump();
    }

    doodlerIsTouching(object) {
        if (this.doodler.canTouch) {
            let constructor = object.constructor;

            switch(constructor) {
                case Platform:
                    if (!object.broken) {
                        if (!this.doodler.jumping) this.jumpDoodler();
                    } else {
                        object.falling = true;
                    }
                    break;
                case Monster:
                    object.skin = '';
                    this.doodler.jumping ? this.endGame() : this.jumpDoodler();
                    break;
                case PowerUp:
                    this.applyEffect(object.effect);
                    this.recycleObject(object);
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
            newObject.reset(this.platformYPosition);
        } else {
            newObject = new constructor(this.objectQuantity ,x, y);
        }

        this.objectQuantity++;
        if (constructor == Platform) {
            if (this.platformYPosition > -300) this.platformYPosition -= spaceBetweenPlatforms;
            // if (!newObject.broken && !newObject.move && random < 50) this.createObject(PowerUp, newObject.position.x, newObject.position.y);
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

    applyEffect({ gravity, velocity }) {
        this.doodler.gravity = gravity;
        this.doodler.velocity = velocity;
    }

    testObjectsPosition() {
        this.getAllElements().forEach(gameElement => {
            if (gameElement.position.y > window.innerHeight + 200) this.recycleObject(gameElement);
        });

        if (this.doodler.position.y > window.innerHeight + 200) this.endGame();
    }

    endGame() {
        this.isPaused = true;
        console.log('Game Over');
    }
}

export default Game;