import Objects from './Objects.js';

const helicopter = 'helicopter';
const jetpack = 'jetpack';
const rocket = 'rocket';
const spring = 'spring';
const trampoline = 'trampoline';
const types = [helicopter, jetpack, spring, trampoline, rocket];
const skinChoice = {
    helicopter:'../../public/assets/power_up/helicopter.png', 
    jetpack:'../../public/assets/power_up/jetpack.png',
    rocket:'../../public/assets/power_up/rocket.png',
    spring:'../../public/assets/power_up/spring.png',
    trampoline:'../../public/assets/power_up/trampoline.png'
};

class PowerUp extends Objects {
    constructor(id, positionX, positionY) {
        super(false, positionX, positionY, 0, 0);
        this.id = id;
        this.equipped = false;
        this.type;
        this.effect;
        this.skin;
        this.init();
    }

    init() {
        let random = Math.random()*types.length | 0;
        this.type = types[random];

        switch (this.type) {
            case helicopter:
                this.effect = {
                    gravityMultiplicator: 0,
                    velocityMultiplicator: 1,
                    jump: false,
                    time: 2000
                }

                this.skin = skinChoice.helicopter;
                this.height = 20;
                break;
            case jetpack:
                this.effect = {
                    gravityMultiplicator: 0,
                    velocityMultiplicator: 1.2,
                    jump: false,
                    time: 4000
                }

                this.skin = skinChoice.jetpack;
                this.height = 40;
                break;
            case rocket:
                this.effect = {
                    gravityMultiplicator: 0,
                    velocityMultiplicator: 1.5,
                    jump: false,
                    time: 6000
                }

                this.skin = skinChoice.rocket;
                this.height = 100;
                break;
            case spring:
                this.effect = {
                    gravityMultiplicator: 1,
                    velocityMultiplicator: 2,
                    jump: true,
                    time: 0
                }

                this.skin = skinChoice.spring;
                this.height = 20;
                break;
            case trampoline:
                this.effect = {
                    gravityMultiplicator: 1,
                    velocityMultiplicator: 2,
                    jump: true,
                    time: 0
                }

                this.skin = skinChoice.trampoline;
                this.height = 20;
                break;
        }
    }

    reset(positionX, positionY) {
        this.position.x = positionX;
        this.position.y = positionY;
        this.init();
    }
}

export default PowerUp;