const gameWidth = 1200;
const verticalMovement = 200;

class Objects {
    constructor(move, positionX, positionY, width, height) {
        this.position = {x:positionX, y:positionY};
        this.gameWidth = gameWidth;
        this.right = false;
        this.left = false;
        this.up = false;
        this.down = false;
        this.width = width;
        this.height = height;
        this.move = move;
        this.movement = {
            horizontal: false,
            vertical: false
        }
        this.status;
        this.positionDifference = 0;
    }

    horizontalMove() {
        if (this.left) this.position.x -= this.movementSpeed;
        if (this.right) this.position.x += this.movementSpeed;
        if (this.position.x + this.width >= this.gameWidth) {
            this.right = false;
            this.left = true;
        }
        if (this.position.x <= 0) {
            this.right = true;
            this.left = false;
        }
    }

    verticalMove() {
        if (this.up) {
            this.position.y -= this.movementSpeed;
            this.positionDifference -= this.movementSpeed;
        }
        if (this.down) {
            this.position.y += this.movementSpeed;
            this.positionDifference += this.movementSpeed;
        } 
        if (this.positionDifference <= -verticalMovement) {
            this.up = false;
            this.down = true;
        }
        if (this.positionDifference >= verticalMovement) {
            this.up = true;
            this.down = false;
        }
    }
}

export default Objects;