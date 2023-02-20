import Objects from "./Objects.js";

const height = 40;
const width = height * 3.83;
const baseVelocity = 18;
const yPosition = -200

class Monster extends Objects {

    constructor(id, gameWidth) {
        super(false, Math.floor(Math.random() * (gameWidth - width)), yPosition, width, height);
        this.skin = '../../public/assets/monsters/monster_1.png';
        this.id = id;
        this.movementSpeed = 3;
        this.velocity = baseVelocity;
        this.gravity = 0.7;
    }

    reset() {
        this.position.x = Math.floor(Math.random() * (this.gameWidth - width));
        this.position.y = yPosition;
        this.right = false;
        this.left = false;
        this.up = false;
        this.down = false;
        this.movement.horizontal = false;
        this.movement.vertical = false;
    }

    setMove(move) {
        this.move = move;
        if (move) {
            if (Math.random() * 100 > 50) {
                this.movement.horizontal = true;
                this.left = true;
            } else {
                this.movement.vertical = true;
                this.up = true;
            }
        }
    }

    refreshMove() {
        if (this.move) {
            if (this.movement.horizontal) this.horizontalMove();
            if (this.movement.vertical) this.verticalMove();
        } 
    }
}

export default Monster;