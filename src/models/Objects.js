const gameWidth = 1200;

class Objects {
    constructor(move, positionX, positionY, width, height) {
        this.position = {x:positionX, y:positionY};
        this.gameWidth = gameWidth;
        this.right = false;
        this.left = false;
        this.width = width;
        this.height = height;
        this.move = move;
        this.status;
    }
}

export default Objects;