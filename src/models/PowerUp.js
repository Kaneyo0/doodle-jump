import Objects from './Objects.js';

const height = 20;
const width = height * 3.83;
const helicopter = 'helicopter';
const types = [helicopter];

class PowerUp extends Objects {
    constructor(id, positionX, positionY) {
        super(false, positionX, positionY, width, height);
        this.id = id;
        this.equipped = false;
        this.skin = '../../public/assets/power_up/helicopter.png';
        this.type = this.chooseType();
        this.effect = this.setEffect();
    }

    chooseType() {
        let random = Math.random()*types.length | 0;
        return types[random];
    }

    setEffect() {
        switch (this.type) {
            case helicopter:
                return {
                    gravity: 0,
                    velocity: 18
                }
        }
    }

    reset() {
        // lol
    }
}

export default PowerUp;