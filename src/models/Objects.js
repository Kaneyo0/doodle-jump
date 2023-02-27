const verticalMovement = 200;
const baseVelocity = 18;
const baseGravity = 0.7;

class Objects {
    constructor(canMove, positionX, positionY, width, height, gameWidth) {
        this.position = {x:positionX, y:positionY};
        this.gameWidth = gameWidth;
        this.velocity = baseVelocity;
        this.gravity = baseGravity;
        this.right = false;
        this.left = false;
        this.up = false;
        this.down = false;
        this.width = width;
        this.height = height;
        this.canMove = canMove;
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

    beginFall() {
        this.position.y += this.velocity;
        this.velocity += this.gravity;
    }
}

export default Objects;