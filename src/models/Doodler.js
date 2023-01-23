import Objects from './Objects.js';

const baseVelocity = 25;
const doodlerSize = 80;

class Doodle extends Objects {
    constructor(positionX) {
        super(positionX - (doodlerSize / 2), window.innerHeight - doodlerSize, doodlerSize, doodlerSize);
        this.skin       = {left:'../../public/assets/doodler/lik-left.png', right:'../../public/assets/doodler/lik-right.png'};
        this.direction  = 'left';
        this.right      = false;
        this.left       = false;
        this.up         = true;
        this.lastLand   = this.position.y;
        this.velocity   = baseVelocity;
        this.gravity    = 1;
    }

    initJump() {
        this.lastLand   = this.position.y;
        this.velocity   = baseVelocity;
        this.up         = true;
    }

    jump() {
        if (this.up) {
            this.position.y -= this.velocity;
            this.velocity -= this.gravity;
            if (this.velocity <= 0) {
                this.up = false;
            } 
        } else {
            this.position.y += this.velocity;
            this.velocity += this.gravity;
        }
    }
}

export default Doodle;