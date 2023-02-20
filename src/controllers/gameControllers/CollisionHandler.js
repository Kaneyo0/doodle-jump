class CollisionHandler {
    constructor(game) {
        this.game = game;
    }

    testCollision() {
        if (this.game.getDoodler().position.y + this.game.getDoodler().height >= window.innerHeight) {
            this.game.jumpDoodler();
        }

        this.game.getAllElements().forEach(element => {
            if (this.doodlerIsTouchingObject(element)) {
                this.game.doodlerIsTouching(element);
            }
        });
    }

    doodlerIsTouchingObject(object) {
        let doodler = this.game.getDoodler();

        return  (doodler.position.y + doodler.height >= object.position.y && 
                doodler.position.x + doodler.width >= object.position.x &&
                object.position.y + object.height >= doodler.position.y &&
                object.position.x + object.width >= doodler.position.x);
        
        // return !(object.position.x > doodler.position.x + doodler.width 
        //         && object.position.x < doodler.position.x - object.width
        //         && object.position.y > doodler.position.y + doodler.height
        //         && object.position.y < doodler.position.y - object.height);
    }
}

export default CollisionHandler;