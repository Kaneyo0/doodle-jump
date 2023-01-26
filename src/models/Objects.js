const gameWidth = 1200;

class Objects {
    constructor(move, positionX, positionY, width, height) {
        this.position = {x:positionX, y:positionY};
        this.width = width;
        this.height = height;
        this.move = move;
        this.movementSpeed = 8;
        this.status;
    }

    horizontalMove() {
        if (this.left) {
            this.position.x -= this.movementSpeed;
        }
        if (this.right) {
            this.position.x += this.movementSpeed;
        }
        if (this.position.x - this.width > gameWidth) {
            this.position.x = 0;
        }
        if (this.position.x + this.width < 0) {
            this.position.x = gameWidth;
        }
    }
}

export default Objects;