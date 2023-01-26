import Objects from './Objects.js';

const baseVelocity = 15;
const doodlerSize = 60;

class Doodle extends Objects {
    constructor(positionX) {
        super(true, positionX - (doodlerSize / 2), window.innerHeight - doodlerSize, doodlerSize, doodlerSize);
        this.skin = {left:'../../public/assets/doodler/lik-left.png', right:'../../public/assets/doodler/lik-right.png'};
        this.direction = 'left';
        this.right = false;
        this.left = false;
        this.jumping = true;
        this.movementSpeed = 10;
        this.velocity = baseVelocity;
        this.gravity = 0.5;
    }

    initJump() {
        if (this.move) {
            this.velocity = baseVelocity;
            this.jumping = true;
        }
    }

    jump() {
        if (this.jumping) {
            if (this.move) {
                this.position.y -= this.velocity;
            }
            this.velocity -= this.gravity;
            if (this.velocity <= 0) {
                // this.move = true;
                this.jumping = false;
            } 
        } else {
            this.move = true;
            this.position.y += this.velocity;
            if (this.velocity < baseVelocity) {
                this.velocity += this.gravity;
            }
        }
    }
}

export default Doodle;