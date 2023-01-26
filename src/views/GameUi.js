class GameUi {
    main = document.querySelector('.main');

    constructor(game, map_width) {
        this.main.style.width = map_width + "px";
        this.game = game;
        this.activePlatforms = [];
        this.inactivePlatforms = [];
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
        this.doodlerElem = document.createElement('img');
        this.doodlerElem.classList.add('doodler');
        this.doodlerElem.style.width = this.game.doodler.width + 'px';
        this.doodlerElem.style.height = this.game.doodler.height + 'px';
        this.main.append(this.doodlerElem);
    }

    getPlatformElem(idPlatform) {
        let result = this.activePlatforms.filter(platform => {
            return platform.dataset.idData == idPlatform;
        })
        return result[0];
    }

    createPlatform(platformObj) {
        let platform = document.createElement('img');
        this.activePlatforms.push(platform);
        this.main.append(platform);

        platform.src = platformObj.skin;
        platform.dataset.idData = platformObj.id;
        platform.classList.add('platform');
        platform.style.height = platformObj.height + 'px';
        platform.style.transform = `translate(${platformObj.position.x}px, ${platformObj.position.y}px)`;
    }

    recyclePlatform(idPlatform) {
        let platform = this.getPlatformElem(idPlatform);
        this.inactivePlatforms.push(platform);
        this.activePlatforms.splice(this.activePlatforms.indexOf(platform), 1);
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

    refreshPlatform() {
        this.activePlatforms.forEach(platform => {
            let platformData = this.game.getPlatformData(platform.dataset.idData);
            platform.style.transform = `translate(${platformData.position.x}px, ${platformData.position.y}px)`;
        })
    }

    refreshGameUi() {
        this.refreshDoodler();
        this.refreshPlatform();
    }
}

export default GameUi;