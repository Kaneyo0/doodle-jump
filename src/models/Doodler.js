import Objects from './Objects.js';

const doodlerSize = 50;
const baseMovementSpeed = 12;
const baseVelocity = 18;
const baseGravity = 0.7;

class Doodle extends Objects {
    constructor(gameWidth) {
        super(true, (gameWidth/2) - (doodlerSize / 2), window.innerHeight - doodlerSize, doodlerSize, doodlerSize, gameWidth);
        this.skin = {left:'../../public/assets/doodler/doodler-left.webp', right:'../../public/assets/doodler/doodler-right.webp'};
        this.canTouch = true;
        this.isInvulnerable = false;
        this.direction = 'left';
        this.movementSpeed = baseMovementSpeed;
    }

    respawn() {
        this.position.y = window.innerHeight/2;
        this.position.x = this.gameWidth/2;
        this.reset();
    }

    reset() {
        this.gravity = baseGravity;
        this.canTouch = true;
        this.isInvulnerable = false;
    }

    initJump() {
        if (this.canMove) 
        this.velocity = baseVelocity;
    }

    jump() {
        if (this.canMove) this.position.y -= this.velocity;
        this.velocity -= this.gravity;
        if (this.velocity <= 0) this.canMove = true; 
    }

    isJumping() {
        return this.velocity > 0;
    }

    horizontalMove() {
        if (this.left) { this.position.x -= this.movementSpeed; }
        if (this.right) { this.position.x += this.movementSpeed; }
        if (this.position.x - this.width > this.gameWidth) { this.position.x = 0; }
        if (this.position.x + this.width < 0) { this.position.x = this.gameWidth; }
    } 

    move() {
        this.jump();
        this.horizontalMove();
    }

    applyEffect({ gravityMultiplicator, velocityMultiplicator, jump, canTouch, invulnerability }) {
        if(jump) this.initJump();
        this.gravity = baseGravity * gravityMultiplicator;
        this.velocity = baseVelocity * velocityMultiplicator;
        this.canTouch = canTouch;
        this.isInvulnerable = invulnerability;
    }
}

export default Doodle;