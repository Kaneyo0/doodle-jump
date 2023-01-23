import Objects from './Objects.js';

const height = 20;
const width = height * 3.83;

class Platform extends Objects {
    constructor(gameWidth) {
        super(Math.floor(Math.random() * (gameWidth - width)), Math.floor(Math.random() * window.innerHeight), width, height);
        this.skin = '../../public/assets/environment/green-platform.png';
    }
}

export default Platform;