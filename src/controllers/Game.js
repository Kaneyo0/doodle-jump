import GameUi from "../views/GameUi.js";
import Map from "../models/Map.js";
import Doodler from "../models/Doodler.js";
import Platform from "../models/platform.js";

const gameWidth = 800;

class Game {
    constructor() {
        this.isPaused = false;
        this.Map = new Map(gameWidth);
        this.GameUi = new GameUi(this, this.Map.width);
        this.doodler = new Doodler(gameWidth/2);
        this.platforms = [];
        this.nbPlatforms = 10;
        this.movementSpeed = 8;
        console.log(window.innerHeight);
        this.game = function() {
            if (!this.isPaused) {
                console.log('game is running');
                this.testEndGame();
                this.testCollision();
                this.jumpDoodler();
                while (this.platforms.length < this.nbPlatforms) {
                    let platform = new Platform(gameWidth);
                    this.platforms.push(platform);
                    this.GameUi.createPlatform(platform);
                }
                if (this.doodler.left) {
                    this.doodler.position.x -= this.movementSpeed;
                    
                }
                if (this.doodler.right) {
                    this.doodler.position.x += this.movementSpeed;
                    
                }
                if (this.doodler.position.x - this.doodler.width > gameWidth) {
                    this.doodler.position.x = 0;
                }
                if (this.doodler.position.x + this.doodler.width < 0) {
                    this.doodler.position.x = gameWidth;
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
                this.handleKeyReleased(event.key);
                break;
        }
    }

    handleKeyPressed(keyPressed) {
        switch(keyPressed) {
            case 'q': 
                this.startDoodlerMovement(false, 'left');
                break;
            case 'd': 
                this.startDoodlerMovement(true, 'right');
                break;
            case 'z':
                this.doodler.initJump();
                break;   
        }
    }

    handleKeyReleased(keyLeft) {
        switch(keyLeft) {
            case 'q': 
                this.doodler.left = false;
                break;
            case 'd': 
                this.doodler.right = false;
                break;
            case 'r':
                this.doodler = new Doodler(gameWidth/2);
                this.isPaused = false;
                break;
            case 'b':
                this.isPaused = !this.isPaused;
                break;
        }
    }

    startDoodlerMovement(right, direction) {
        this.doodler.left = !right;
        this.doodler.right = right;
        this.doodler.direction  = direction;
    }

    jumpDoodler() {
        this.doodler.jump();
    }

    testCollision() {
        if (!this.doodler.jumping) {
            if (this.doodler.position.y + this.doodler.height >= window.innerHeight) {
                this.doodler.initJump();
            }
    
            this.platforms.forEach(platform => {
                if (this.doodlerIsTouchingObject(platform)) {
                    this.doodler.initJump();
                }
            });
        }
    }

    doodlerIsTouchingObject(object) {
        return this.doodler.position.y + this.doodler.height >= object.position.y && 
               this.doodler.position.x + this.doodler.width >= object.position.x &&
               object.position.y + object.height >= this.doodler.position.y &&
               object.position.x + object.width >= this.doodler.position.x
    }

    testEndGame() {
        if (this.doodler.position.y > window.innerHeight) {
            this.isPaused = true;
            console.log('Game Over');
        }
    }
}

export default Game;