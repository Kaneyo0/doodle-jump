import GameUi from "../views/GameUi.js";
import Map from "../models/Map.js";
import Doodler from "../models/Doodler.js";
import Platform from "../models/platform.js";

const gameWidth = 800;

class Game {
    constructor() {
        this.isPaused       = false;
        this.Map            = new Map(gameWidth);
        this.GameUi         = new GameUi(this, this.Map.width);
        this.doodler        = new Doodler(gameWidth/2);
        this.platforms      = [];
        this.nbPlatforms    = 10;
        this.movementSpeed  = 5;
        console.log(window.innerHeight);
        this.game           = function() {
            if (!this.isPaused) {
                console.log('game is running');
                this.testEndGame();
                this.testCollision();
                this.jumpDoodler();
                while (this.platforms.length < this.nbPlatforms) {
                    let platform = new Platform();
                    this.platforms.push(platform);
                    this.GameUi.createPlatform(platform);
                }
                if (this.doodler.left) {
                    this.doodler.position.x -= this.movementSpeed;
                }
                if (this.doodler.right) {
                    this.doodler.position.x += this.movementSpeed;
                }
                this.GameUi.refreshGameUi();
            }
            window.requestAnimationFrame(()=>{this.game()});
        }
        
        this.GameUi.initUi();
        window.requestAnimationFrame(()=>{this.game()});
    }

    receiveEvent(event) {
        switch(event.type) {
            case 'keydown':
                this.handleKeyPressed(event.key);
                break;
            case 'keyup':
                this.stopDoodler(event.key);
                break;
        }
    }

    handleKeyPressed(keyPressed) {
        switch(keyPressed) {
            case 'q': 
                this.moveDoodler(false, 'left');
                break;
            case 'd': 
                this.moveDoodler(true, 'right');
                break;
            case 'z':
                this.doodler.initJump();
                break;
        }
    }

    moveDoodler(right, direction) {
        this.doodler.left = !right;
        this.doodler.right = right;
        this.doodler.direction  = direction;
    }

    stopDoodler(keyLeft) {
        switch(keyLeft) {
            case 'q': 
                this.doodler.left = false;
                break;
            case 'd': 
                this.doodler.right = false;
                break;
            case 'b':
                this.isPaused = !this.isPaused;
                break;
        }
    }

    jumpDoodler() {
        this.doodler.jump();
    }

    testCollision() {
        if (!this.doodler.up) {
            if (this.doodler.position.y == window.innerHeight - this.doodler.height) {
                this.doodler.initJump();
            }
    
            this.platforms.forEach(platform => {
                if ((this.doodler.position.y - this.doodler.height) == (platform.position.y - platform.height)) {
                    this.doodler.initJump();
                    console.log(this.doodler.position.y + this.doodler.height);
                    console.log(platform.position.y + platform.height);
                }
            });
        }
    }

    testEndGame() {
        if (this.doodler.position.y > window.innerHeight) {
            this.isPaused = true;
            console.log('Game Over');
        }
    }
}

export default Game;