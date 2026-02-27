import Objects from "./Objects.js";

const height = 40;
const width = height * 1.69;
const yPosition = -200;
const chanceToMove = 20;

class Monster extends Objects {
    constructor(id, gameWidth) {
        super(false, Math.floor(Math.random() * (gameWidth - width)), yPosition, width, height, gameWidth);
        this.skin = "../../public/assets/monsters/monster_1.webp";
        this.id = id;
        this.movementSpeed = 3;
        this.init();
    }

    init() {
        let random = Math.random() * 100;

        switch (true) {
            case random <= chanceToMove:
                this.canMove = true;
                if (Math.random() * 100 > 50) {
                    this.movement.horizontal = true;
                    this.left = true;
                } else {
                    this.movement.vertical = true;
                    this.up = true;
                }
                break;
            default:
                this.canMove = false;
        }
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
        this.init();
    }

    refreshMove() {
        if (this.canMove) {
            if (this.movement.horizontal) this.horizontalMove();
            if (this.movement.vertical) this.verticalMove();
        }
    }
}

export default Monster;
