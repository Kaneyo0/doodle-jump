class CollisionHandler {
    constructor(game) {
        this.game = game;
    }

    testCollision() {
        let doodler = this.game.getDoodler();

        // if (doodler.position.y + doodler.height >= window.innerHeight) {
        //     doodler.initJump();
        // }

        this.game.getAllElements().forEach((element) => {
            if (this.doodlerIsTouchingObject(element)) {
                this.game.doodlerIsTouching(element);
            }
        });
    }

    doodlerIsTouchingObject(object) {
        let doodler = this.game.getDoodler();

        return (
            doodler.position.y + doodler.height >= object.position.y &&
            doodler.position.x + doodler.width >= object.position.x &&
            object.position.y + object.height >= doodler.position.y &&
            object.position.x + object.width >= doodler.position.x
        );
    }
}

export default CollisionHandler;
