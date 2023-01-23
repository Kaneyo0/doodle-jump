class Objects {
    constructor(positionX, positionY, width, height) {
        this.position   = {x:positionX, y:positionY};
        this.width      = width;
        this.height     = height;
        this.status;
    }

    // get position() {
    //     return this.position;
    // }

    // set position({positionX, positionY}) {
    //     this.position = {x:positionX, y:positionY};
    // }
}

export default Objects;