import Objects from './Objects.js';

const height = 20;
const width = height * 3.83;
const variation = 100;

class Platform extends Objects {
    constructor(id, gameWidth, baseYPosition) {
        super(false, Math.floor(Math.random() * (gameWidth - width)),
            Math.floor(Math.random() * (baseYPosition - (baseYPosition - variation)) + (baseYPosition - variation   )), width, height);
        this.id = id;
        this.skin = '../../public/assets/environment/green-platform.png';
        this.broken = false;
    }
}

export default Platform;