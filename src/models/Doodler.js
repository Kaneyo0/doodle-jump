import Objects from './Objects.js';

const baseVelocity = 20;
const doodlerSize = 80;

class Doodle extends Objects {
    constructor(positionX) {
        super(positionX - (doodlerSize / 2), window.innerHeight - doodlerSize, doodlerSize, doodlerSize);
        this.skin = {left:'../../public/assets/doodler/lik-left.png', right:'../../public/assets/doodler/lik-right.png'};
        this.direction = 'left';
        this.right = false;
        this.left = false;
        this.jumping = true;
        this.velocity = baseVelocity;
        this.gravity = 0.7;
    }

    initJump() {
        this.velocity = baseVelocity;
        this.jumping = true;
    }

    jump() {
        if (this.jumping) {
            this.position.y -= this.velocity;
            this.velocity -= this.gravity;
            if (this.velocity <= 0) {
                this.jumping = false;
            } 
        } else {
            this.position.y += this.velocity;
            if (this.velocity < baseVelocity) {
                this.velocity += this.gravity;
            }
        }
    }
}

export default Doodle;