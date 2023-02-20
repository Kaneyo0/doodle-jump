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
const chanceToMove = 20;
const chanceToBroke = 10;

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

    getElementTabs(object) {
        switch(object.constructor.name) {
            case 'Platform': 
                return [this.activePlatforms, this.inactivePlatforms, '.platform'];
            case 'Monster':
                return [this.activeMonsters, this.inactiveMonsters, '.monster'];
            case 'PowerUp':
                return [this.activePowerUps, this.inactivePowerUps, '.power_up'];
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
        this.createPlatforms();
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
            let constructor = object.constructor.name;
            switch(constructor) {
                case 'Platform':
                    if (!object.broken) {
                        if (!this.doodler.jumping) this.jumpDoodler();
                    } else {
                        object.fall = true;
                    }
                    break;
                case 'Monster':
                    object.skin = '';
                    // console.log(this.doodler.jumping + ' feur ' + this.monsterCount);
                    // this.monsterCount++;
                    // this.doodler.jumping ? this.endGame() : this.jumpDoodler();
                    this.jumpDoodler();
                    break;
                case 'PowerUp':
                    this.recycleObject(object);
                    this.doodler.gravity = 0;
                    this.doodler.velocity = 18;
                    break;
                default:
                    console.log('Unknown ' + constructor + ' element');
            }
        }
    }

    createPlatforms() {
        while (this.activePlatforms.length < nbPlatforms && this.verifyLastPlatform()) {
            let platform;
            let broken = false;
            let move = false;
            let random = Math.random() * 100;

            switch (true) {
                case random <= chanceToBroke:
                    broken = true;
                    break;
                case random <= chanceToMove:
                    move = true;
                    break;
            }

            if (this.inactivePlatforms.length > 0) {
                platform = this.inactivePlatforms.shift();
                platform.reset(this.platformYPosition);
            } else {
                platform = new Platform(this.objectQuantity, gameWidth, this.platformYPosition);
            }

            platform.setBroken(broken);
            platform.setMove(move);
            
            if (this.platformYPosition > -300) this.platformYPosition -= spaceBetweenPlatforms;

            this.objectQuantity++;
            if (!broken && !move && random < 50) {
                this.createPowerUp(platform.position)
            }
            this.activePlatforms.push(platform);
            this.GameUi.createObject(platform);
        }
    }

    createMonsters() {
        let random = Math.random() * 100;
        if (this.activeMonsters.length < nbMonsters && random <= 1) {
            let monster;
            let move = false;
            let random = Math.random() * 100;

            switch (true) {
                case random <= chanceToMove:
                    move = true;
                    break;
            }

            if (this.inactiveMonsters.length > 0) {
                monster = this.inactiveMonsters.shift();
                monster.reset();
            } else {
                monster = new Monster(this.objectQuantity, gameWidth);
            }

            monster.setMove(move);

            this.objectQuantity++;
            this.activeMonsters.push(monster);
            this.GameUi.createObject(monster);
        }
    }

    createPowerUp({ x, y }) {
        let powerUp;

        if (this.inactivePowerUps.length > 0) {
            powerUp = this.inactivePowerUps.shift();
            // powerUp.reset();
        } else {
            powerUp = new PowerUp(this.objectQuantity ,x, y);
        }

        this.objectQuantity++;
        this.activePowerUps.push(powerUp);
        this.GameUi.createObject(powerUp);
    }

    moveEnvironment() {
        this.getAllElements().forEach(gameElement => { 
            if (gameElement.constructor.name != 'PowerUp') { gameElement.refreshMove() }
        });
    }

    recycleObject(object) {
        let elemTabs = this.getElementTabs(object);
        
        elemTabs[1].push(object);
        elemTabs[0].splice(elemTabs[0].indexOf(object), 1);

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