import Objects from './Objects.js';

const height = 20;
const width = height * 3.83;
const baseVelocity = 18;
const chanceToMove = 20;
const chanceToBroke = 10;

class Platform extends Objects {

    constructor(id, gameWidth, baseYPosition) {
        super(false, Math.floor(Math.random() * (gameWidth - width)), baseYPosition, width, height);
        this.skinChoice = {
            green:'../../public/assets/environment/green-platform.png', 
            blue:'../../public/assets/environment/blue-platform.png',
            broken:'../../public/assets/environment/broken-platform_1.png'
        };
        this.skin = this.skinChoice.green;
        this.id = id;
        this.broken = false;
        this.falling = false;
        this.movementSpeed = 3;
        this.velocity = baseVelocity;
        this.gravity = 0.7;
        this.init();
    }

    init() {
        let random = Math.random() * 100;
        let move = false;
        let broken = false;
    
        switch (true) {
            case random <= chanceToBroke:
                broken = true;
                break;
            case random <= chanceToMove:
                move = true;
                break;
        }

        this.setBroken(broken);
        this.setMove(move);
    }

    setBroken(broken) {
        this.broken = broken;
        if (broken) this.skin = this.skinChoice.broken;
    }

    setMove(move) {
        this.move = move;
        if (move) {
            this.skin = this.skinChoice.blue;
            if (Math.random() * 100 > 50) {
                this.movement.horizontal = true;
                this.left = true;
            } else {
                this.movement.vertical = true;
                this.up = true;
            }
        }
    }

    reset(baseYPosition) {
        this.init();
        this.position.x = Math.floor(Math.random() * (this.gameWidth - width));
        this.position.y = baseYPosition;
        this.falling = false;
        this.right = false;
        this.left = false;
        this.up = false;
        this.down = false;
        this.movement.horizontal = false;
        this.movement.vertical = false;
        if (this.broken) this.velocity = baseVelocity;
    }

    refreshMove() {
        if (this.broken && this.falling) this.beginFall();
        if (this.move) {
            if (this.movement.horizontal) this.horizontalMove();
            if (this.movement.vertical) this.verticalMove();
        } 
    }

    beginFall() {
        this.position.y += this.velocity;
        this.velocity += this.gravity;
    }
}

export default Platform;