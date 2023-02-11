import GameUi from "../views/GameUi.js";
import Map from "../models/Map.js";
import EventHandler from "./gameControllers/EventHandler.js";
import CollisionHandler from "./gameControllers/CollisionHandler.js";
import MovementController from "./gameControllers/MovementController.js";
import Doodler from "../models/Doodler.js";
import Platform from "../models/platform.js";

const gameWidth = 1200;
const nbPlatforms = 40;
const platformBaseYPosition = window.innerHeight - 100;

class Game {
    constructor() {
        this.isPaused = false;
        this.Map = new Map(gameWidth);
        this.GameUi = new GameUi(this, this.Map.width);
        this.EventHandler = new EventHandler(this);
        this.CollisionHandler = new CollisionHandler(this);
        this.MovementController = new MovementController();
        this.doodler = new Doodler(gameWidth/2);
        this.activePlatforms = [];
        this.inactivePlatforms = [];
        this.platformQuantity = 0;
        this.platformYPosition = platformBaseYPosition;
        this.game = function() {
            if (!this.isPaused) {
                this.createPlatform();
                if ((Math.random() * 100) >= 30) {
                    this.createPlatform(true);
                }
                this.doodler.horizontalMove();
                this.doodler.jump();
                this.CollisionHandler.testCollision();
                this.controlScreenPosition();
                this.GameUi.refreshGameUi();
                this.testPlatformPosition();
                this.testEndGame();
            }
            window.requestAnimationFrame(() => { this.game() });
        }
        
        this.GameUi.initUi();
        window.requestAnimationFrame(() => { this.game() });
    }

    getDoodler() {
        return this.doodler;
    }

    getAllPlatforms() {
        return this.activePlatforms;
    }

    getPlatformData(idPlatform) {
        let result = this.activePlatforms.filter(platform => { return platform.id == idPlatform });
        return result[0];
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

    startDoodlerMovement(right, direction) {
        this.MovementController.startObjectMovement(this.doodler, right, direction);
    }

    stopDoodlerMovement(right) {
        this.MovementController.stopObjectMovement(this.doodler, right);
    }

    controlScreenPosition() {
        if (this.doodler.position.y < window.innerHeight / 3) {
            this.doodler.move = false;
            this.activePlatforms.forEach(platform => { platform.position.y += this.doodler.velocity });
        }
    }

    jumpDoodler() {
        this.doodler.initJump();
    }

    doodlerIsTouching(object) {
        switch(object.constructor.name) {
            case 'Platform':
                if (!object.broken) this.jumpDoodler();
                break;
        }
    }

    createPlatform(broken = false) {
        while (this.activePlatforms.length < nbPlatforms && this.verifyLastPlatform()) {
            let platform;

            if (this.inactivePlatforms.length > 0) {
                platform = this.inactivePlatforms.shift();
                platform.reset(this.platformYPosition);
            } else {
                platform = new Platform(this.platformQuantity, gameWidth, this.platformYPosition);
            }

            if (broken) platform.setBroken();
            
            if (this.platformYPosition > -300) this.platformYPosition -= 50;

            this.platformQuantity++;
            this.activePlatforms.push(platform);
            this.GameUi.createPlatform(platform);
        }
    }

    recyclePlatform(idPlatform) {
        let platform = this.getPlatformData(idPlatform);
        this.inactivePlatforms.push(platform);
        this.activePlatforms.splice(this.activePlatforms.indexOf(platform), 1);
        this.GameUi.recyclePlatform(idPlatform);
    }

    verifyLastPlatform() {
        if (this.activePlatforms.length > 0) {
            if (this.activePlatforms[this.activePlatforms.length - 1].position.y > -300) return true;
            return false;
        }

        return true;
    }

    testPlatformPosition() {
        this.activePlatforms.forEach(platform => {
            if (platform.position.y > window.innerHeight) this.recyclePlatform(platform.id);
        })
    }

    testEndGame() {
        if (this.doodler.position.y > window.innerHeight) {
            this.isPaused = true;
            console.log('Game Over');
        }
    }
}

export default Game;