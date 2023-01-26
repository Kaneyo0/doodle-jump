import GameUi from "../views/GameUi.js";
import Map from "../models/Map.js";
import EventHandler from "./gameControllers/EventHandler.js";
import CollisionHandler from "./gameControllers/CollisionHandler.js";
import MovementController from "./gameControllers/MovementController.js";
import Doodler from "../models/Doodler.js";
import Platform from "../models/platform.js";

const gameWidth = 800;
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
                this.platformYPosition = this.activePlatforms[this.activePlatforms.length - 1].position.y;
                this.doodler.horizontalMove();
                this.doodler.jump();
                this.CollisionHandler.testCollision();
                this.controlScreenPosition();
                this.GameUi.refreshGameUi();
                this.testPlatformPosition();
                this.testEndGame();
            }
            window.requestAnimationFrame(()=>{this.game()});
        }
        
        this.GameUi.initUi();
        window.requestAnimationFrame(()=>{this.game()});
    }

    getDoodler() {
        return this.doodler;
    }

    getAllPlatforms() {
        return this.activePlatforms;
    }

    getPlatformData(idPlatform) {
        let result = this.activePlatforms.filter(platform => {
            return platform.id == idPlatform;
        })
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
            this.activePlatforms.forEach(platform => {
                platform.position.y += 8;
            });
        }
    }

    jumpDoodler() {
        this.doodler.initJump();
    }

    createPlatform() {
        while (this.activePlatforms.length < nbPlatforms) {
            let platform = new Platform(this.platformQuantity, gameWidth, this.platformYPosition);
            this.platformQuantity ++;
            this.activePlatforms.push(platform);
            this.platformYPosition = this.activePlatforms[this.activePlatforms.length - 1].position.y - 50;
            this.GameUi.createPlatform(platform);
        }
    }

    recyclePlatform(idPlatform) {
        let platform = this.getPlatformData(idPlatform);
        this.inactivePlatforms.push(platform);
        this.activePlatforms.splice(this.activePlatforms.indexOf(platform), 1);
        this.GameUi.recyclePlatform(idPlatform);
    }

    testPlatformPosition() {
        this.activePlatforms.forEach(platform => {
            if (platform.position.y > this.doodler.position.y * 8) {
                this.recyclePlatform(platform.id);
            }
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