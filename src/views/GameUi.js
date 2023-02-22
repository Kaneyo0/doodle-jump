import Platform from "../models/platform.js";
import Monster from "../models/Monster.js";
import PowerUp from "../models/PowerUp.js";

class GameUi {
    main = document.querySelector('.main');
    templates = document.querySelector('.template').content;

    constructor(game, map_width) {
        this.main.style.width = map_width + "px";
        this.game = game;

        this.activePlatforms = [];
        this.inactivePlatforms = [];

        this.activeMonsters = [];
        this.inactiveMonsters = [];

        this.activePowerUps = [];
        this.inactivePowerUps = [];

        this.doodlerElem;
        this.initEventsHandlers();
    }

    initEventsHandlers() {
        document.addEventListener('keydown', (ev)=>{this.emitEvent(ev)}, false);
        document.addEventListener('keyup', (ev)=>{this.emitEvent(ev)}, false);
    }

    emitEvent(event) {
        this.game.receiveEvent(event);
    }
    
    initUi() {
        this.doodlerElem = this.templates.cloneNode(true).querySelector('.doodler');
        this.doodlerElem.style.width = this.game.doodler.width + 'px';
        this.doodlerElem.style.height = this.game.doodler.height + 'px';
        this.main.append(this.doodlerElem);
    }

    getAllUiElements() {
        return this.activePlatforms.concat(this.activeMonsters).concat(this.activePowerUps);
    }

    getObject(idObject) {
        let result = this.getAllUiElements().filter(object => { return object.dataset.idData == idObject });
        return result[0];
    }

    getElementTabs(constructor) {
        switch(constructor) {
            case Platform: 
                return {active: this.activePlatforms, inactive: this.inactivePlatforms, className: '.platform'}
            case Monster:
                return {active: this.activeMonsters, inactive: this.inactiveMonsters, className: '.monster'}
            case PowerUp:
                return {active: this.activePowerUps, inactive: this.inactivePowerUps, className: '.power_up'}
            default:
                console.log('Unknown game object');
        }
    }

    createObject(object) {
        let elemTabs = this.getElementTabs(object.constructor);
        let newElement;

        if (elemTabs.inactive.length > 0) {
            newElement = elemTabs.inactive.shift();
        } else {
            newElement = this.templates.cloneNode(true).querySelector(elemTabs.className);
            newElement.style.height = object.height + 'px';
        }

        newElement.src = object.skin;
        newElement.dataset.idData = object.id;
        newElement.style.transform = `translate(${object.position.x}px, ${object.position.y}px)`;
        
        elemTabs.active.push(newElement);
        this.main.append(newElement);
    }

    recycleObject(object) {
        let elemTabs = this.getElementTabs(object.constructor);
        let elemToRecycle = this.getObject(object.id);

        elemTabs.inactive.push(elemToRecycle);
        elemTabs.active.splice(elemTabs.active.indexOf(elemToRecycle), 1);
    }

    refreshDoodler() {
        switch(this.game.doodler.direction) {
            case 'left': 
                this.doodlerElem.src = `${this.game.doodler.skin.left}`;
                break;
            case 'right': 
                this.doodlerElem.src = `${this.game.doodler.skin.right}`;
                break;
        }

        this.doodlerElem.style.transform = `translate(${this.game.doodler.position.x}px, ${this.game.doodler.position.y}px)`;
    }

    refreshElements() {
        this.getAllUiElements().forEach(uiElement => {
            let objectData = this.game.getObjectData(uiElement.dataset.idData);
            uiElement.style.transform = `translate(${objectData.position.x}px, ${objectData.position.y}px)`;
        });
    }

    refreshGameUi() {
        this.refreshDoodler();
        this.refreshElements();
    }
}

export default GameUi;