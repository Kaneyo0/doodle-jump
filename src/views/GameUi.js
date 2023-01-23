class GameUi {
    main = document.querySelector('.main');

    constructor(game, map_width) {
        this.main.style.width = map_width + "px";
        this.game = game;
        this.platforms = [];
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

    createPlatform(platformObj) {
        let platform = document.createElement('img');
        this.platforms.push(platform);
        this.main.append(platform);

        platform.src = platformObj.skin;
        platform.classList.add('platform');
        platform.style.height = platformObj.height + 'px';
        platform.style.transform = `translate(${platformObj.position.x}px, ${platformObj.position.y}px)`;
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

    refreshGameUi() {
        this.refreshDoodler();
    }
}

export default GameUi;