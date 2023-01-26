class CollisionHandler {
    constructor(game) {
        this.game = game;
    }

    testCollision() {
        if (!this.game.getDoodler().jumping) {
            if (this.game.getDoodler().position.y + this.game.getDoodler().height >= window.innerHeight) {
                this.game.jumpDoodler();
            }
    
            this.game.getAllPlatforms().forEach(platform => {
                if (this.doodlerIsTouchingObject(platform)) {
                    this.game.jumpDoodler();
                }
            });
        }
    }

    doodlerIsTouchingObject(object) {
        return this.game.getDoodler().position.y + this.game.getDoodler().height >= object.position.y && 
               this.game.getDoodler().position.x + this.game.getDoodler().width >= object.position.x &&
               object.position.y + object.height >= this.game.getDoodler().position.y &&
               object.position.x + object.width >= this.game.getDoodler().position.x
    }
}

export default CollisionHandler;