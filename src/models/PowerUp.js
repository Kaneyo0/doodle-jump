import Objects from './Objects.js';

const height = 20;
const width = height * 3.83;

class PowerUp extends Objects {
    constructor(id, positionX, positionY) {
        super(false, positionX, positionY, width, height);
        this.id = id;
        this.equipped = false;
        this.skin = '../../public/assets/power_up/helicopter.png';
    }
}

export default PowerUp;