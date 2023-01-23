import Objects from './Objects.js';

class Platform extends Objects {
    constructor() {
        super(Math.floor(Math.random() * ((window.innerWidth * 0.5) - 10) + 10), Math.floor(Math.random() * window.innerHeight), 0, 5);
        this.skin = '../../public/assets/environment/green-platform.png';
    }
}

export default Platform;