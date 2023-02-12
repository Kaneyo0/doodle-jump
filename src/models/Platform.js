import Objects from './Objects.js';

const height = 20;
const width = height * 3.83;
const variation = 120;
const baseVelocity = 18;

class Platform extends Objects {
    constructor(id, gameWidth, baseYPosition) {
        super(false, Math.floor(Math.random() * (gameWidth - width)), baseYPosition, width, height);
        this.skin = {
            green:'../../public/assets/environment/green-platform.png', 
            blue:'../../public/assets/environment/blue-platform.png',
            broken:'../../public/assets/environment/broken-platform_1.png'
        };
        this.id = id;
        this.broken = false;
        this.fall = false;
        this.movementSpeed = 6;
        this.velocity = baseVelocity;
        this.gravity = 0.7;
    }

    reset(baseYPosition) {
        this.position.x = Math.floor(Math.random() * (this.gameWidth - width));
        this.position.y = Math.floor(Math.random() * (baseYPosition - (baseYPosition - variation)) + (baseYPosition - variation))
        this.fall = false;
        if (this.broken) this.velocity = baseVelocity;
    }

    setBroken(broken) {
        this.broken = broken;
    }

    setMove(move) {
        this.move = move;
        if (move) this.left = true;
    }

    refreshMove() {
        if (this.broken) this.beginFall();
        if (this.move) this.horizontalMove();
    }

    beginFall() {
        if (this.fall) {
            this.position.y += this.velocity;
            this.velocity += this.gravity;
        }
    }

    horizontalMove() {
        if (this.left) {
            this.position.x -= this.movementSpeed;
        }
        if (this.right) {
            this.position.x += this.movementSpeed;
        }
        if (this.position.x + this.width >= this.gameWidth) {
            this.right = false;
            this.left = true;
        }
        if (this.position.x <= 0) {
            this.right = true;
            this.left = false;
        }
    }
}

export default Platform;