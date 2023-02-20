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

    getElementTabs(object) {
        switch(object.constructor.name) {
            case 'Platform': 
                return [this.activePlatforms, this.inactivePlatforms, '.platform'];
            case 'Monster':
                return [this.activeMonsters, this.inactiveMonsters, '.monster'];
            case 'PowerUp':
                return [this.activePowerUps, this.inactivePowerUps, '.power_up'];
            default:
                console.log('Unknown game object');
        }
    }

    createObject(object) {
        let elemTabs = this.getElementTabs(object);
        let newElement;

        if (elemTabs[1].length > 0) {
            newElement = elemTabs[1].shift();
        } else {
            newElement = this.templates.cloneNode(true).querySelector(elemTabs[2]);
            newElement.style.height = object.height + 'px';
        }

        newElement.src = object.skin;
        newElement.dataset.idData = object.id;
        newElement.style.transform = `translate(${object.position.x}px, ${object.position.y}px)`;
        
        elemTabs[0].push(newElement);
        this.main.append(newElement);
    }

    recycleObject(object) {
        let elemTabs = this.getElementTabs(object);
        let elemToRecycle = this.getObject(object.id);

        elemTabs[1].push(elemToRecycle);
        elemTabs[0].splice(elemTabs[0].indexOf(elemToRecycle), 1);
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