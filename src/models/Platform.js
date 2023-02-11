import Objects from './Objects.js';

const height = 20;
const width = height * 3.83;
const variation = 120;

class Platform extends Objects {
    constructor(id, gameWidth, baseYPosition) {
        super(false, Math.floor(Math.random() * (gameWidth - width)), baseYPosition, width, height);
        this.gameWidth = gameWidth;
        this.id = id;
        this.broken = false;
    }

    reset(baseYPosition) {
        this.position.x = Math.floor(Math.random() * (this.gameWidth - width));
        this.position.y = Math.floor(Math.random() * (baseYPosition - (baseYPosition - variation)) + (baseYPosition - variation))
    }

    setBroken() {
        this.broken = true;
    }
}

export default Platform;