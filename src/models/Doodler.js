import Objects from './Objects.js';

const doodlerSize = 60;
const baseVelocity = 18;

class Doodle extends Objects {
    constructor(positionX) {
        super(true, positionX - (doodlerSize / 2), window.innerHeight - doodlerSize, doodlerSize, doodlerSize);
        this.skin = {left:'../../public/assets/doodler/lik-left.png', right:'../../public/assets/doodler/lik-right.png'};
        this.canTouch = true;
        this.direction = 'left';
        this.jumping = true;
        this.movementSpeed = 12;
        this.velocity = baseVelocity;
        this.gravity = 0.7;
    }

    initJump() {
        if (this.move) {
            this.velocity = baseVelocity;
            this.jumping = true;
        }
    }

    jump() {
        if (this.jumping) {
            if (this.move) this.position.y -= this.velocity;
            this.velocity -= this.gravity;
            if (this.velocity <= 0) this.jumping = false; 
        } else {
            this.move = true;
            this.position.y += this.velocity;
            if (this.velocity < baseVelocity) this.velocity += this.gravity;
        }
    }

    horizontalMove() {
        if (this.left) { this.position.x -= this.movementSpeed; }
        if (this.right) { this.position.x += this.movementSpeed; }
        if (this.position.x - this.width > this.gameWidth) { this.position.x = 0; }
        if (this.position.x + this.width < 0) { this.position.x = this.gameWidth; }
    } 
}

export default Doodle;