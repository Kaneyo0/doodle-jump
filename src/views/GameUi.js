class GameUi {
    main = document.querySelector('.main');
    templates = document.querySelector('.template').content;

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
        this.doodlerElem = this.templates.cloneNode(true).querySelector('.doodler');
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
        let platform;
        if (this.inactivePlatforms.length > 0) {
            platform = this.inactivePlatforms.shift();
        } else {
            if (platformObj.broken) {
                platform = this.templates.cloneNode(true).querySelector('.platform broken');
            } else {
                platform = this.templates.cloneNode(true).querySelector('.platform');
            }
            platform.style.height = platformObj.height + 'px';
        }
        platform.dataset.idData = platformObj.id;
        platform.style.transform = `translate(${platformObj.position.x}px, ${platformObj.position.y}px)`;
        
        this.activePlatforms.push(platform);
        this.main.append(platform);
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