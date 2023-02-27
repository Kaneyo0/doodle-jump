import Objects from './Objects.js';

const helicopter = 'helicopter';
const jetpack = 'jetpack';
const rocket = 'rocket';
const spring = 'spring';
const trampoline = 'trampoline';
const invulnerability = 'invulnerability';
const types = [helicopter, jetpack, spring, trampoline, rocket, invulnerability];
const skinChoice = {
    helicopter:'../../public/assets/power_up/helicopter.png', 
    jetpack:'../../public/assets/power_up/jetpack.png',
    rocket:'../../public/assets/power_up/rocket.png',
    spring:'../../public/assets/power_up/spring.png',
    trampoline:'../../public/assets/power_up/trampoline.png',
    invulnerability:'../../public/assets/power_up/invulnerability.png'
};

class PowerUp extends Objects {
    constructor(id, positionX, positionY) {
        super(false, positionX, positionY, 0, 0);
        this.id = id;
        this.equipped = false;
        this.used = false;
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
                    canTouch: false,
                    invulnerability: false,
                    time: 2000
                }

                this.skin = skinChoice.helicopter;
                this.height = 20;
                this.width = this.height * 1.6;
                break;
            case jetpack:
                this.effect = {
                    gravityMultiplicator: 0,
                    velocityMultiplicator: 1.2,
                    jump: false,
                    canTouch: false,
                    invulnerability: false,
                    time: 4000
                }

                this.skin = skinChoice.jetpack;
                this.height = 40;
                this.width = this.height * 0.6;
                break;
            case rocket:
                this.effect = {
                    gravityMultiplicator: 0,
                    velocityMultiplicator: 1.5,
                    jump: false,
                    canTouch: false,
                    invulnerability: false,
                    time: 6000
                }

                this.skin = skinChoice.rocket;
                this.height = 100;
                this.width = this.height * 0.68;
                break;
            case spring:
                this.effect = {
                    gravityMultiplicator: 1,
                    velocityMultiplicator: 2,
                    jump: true,
                    canTouch: false,
                    invulnerability: false,
                    time: 0
                }

                this.skin = skinChoice.spring;
                this.height = 20;
                this.width = this.height * 0.61;
                break;
            case trampoline:
                this.effect = {
                    gravityMultiplicator: 1,
                    velocityMultiplicator: 2,
                    jump: true,
                    canTouch: false,
                    invulnerability: false,
                    time: 0
                }

                this.skin = skinChoice.trampoline;
                this.height = 20;
                this.width = this.height * 2.6;
                break;
            case invulnerability:
                this.effect = {
                    gravityMultiplicator: 1,
                    velocityMultiplicator: 1,
                    jump: false,
                    canTouch: true,
                    invulnerability: true,
                    time: 15000
                }

                this.skin = skinChoice.invulnerability;
                this.height = 40;
                this.width = this.height;
        }

        this.position.y -= this.height;
    }

    reset(positionX, positionY) {
        this.position.x = positionX;
        this.position.y = positionY;
        this.equipped = false;
        this.used = false;
        this.init();
    }
}

export default PowerUp;