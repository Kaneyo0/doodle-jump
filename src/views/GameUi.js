import Platform from "../models/platform.js";
import Monster from "../models/Monster.js";
import PowerUp from "../models/PowerUp.js";

class GameUi {
    main = document.querySelector(".main");
    scoreUi = document.querySelector(".scoreUi");
    score = document.querySelector(".score");
    templates = document.querySelector(".template").content;
    baseMenu = this.templates.cloneNode(true).querySelector(".menuBase");
    pauseMenu = this.templates.cloneNode(true).querySelector(".pauseMenuContent");
    loseMenu = this.templates.cloneNode(true).querySelector(".loseMenuContent");
    startMenu = this.templates.cloneNode(true).querySelector(".startMenuContent");

    constructor(game, map_width) {
        this.gameWidth = map_width + "px";
        this.main.style.width = this.gameWidth;
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
        document.addEventListener(
            "keydown",
            (ev) => {
                this.emitEvent(ev);
            },
            false,
        );
        document.addEventListener(
            "keyup",
            (ev) => {
                this.emitEvent(ev);
            },
            false,
        );
        document.addEventListener(
            "click",
            (ev) => {
                this.emitEvent(ev);
            },
            false,
        );
    }

    emitEvent(event) {
        this.game.receiveEvent(event);
    }

    initDoodler() {
        this.scoreUi.style.transform = `translate(${this.gameWidth}px, 0px)`;
        this.doodlerElem = this.templates.cloneNode(true).querySelector(".doodler");
        this.doodlerElem.style.width = this.game.doodler.width + "px";
        this.doodlerElem.style.height = this.game.doodler.height + "px";
        this.main.append(this.doodlerElem);
    }

    getAllUiElements() {
        return this.activePlatforms.concat(this.activeMonsters).concat(this.activePowerUps);
    }

    getObject(idObject) {
        let result = this.getAllUiElements().filter((object) => {
            return object.dataset.idData == idObject;
        });
        return result[0];
    }

    getElementTabs(constructor) {
        switch (constructor) {
            case Platform:
                return { active: this.activePlatforms, inactive: this.inactivePlatforms, className: ".platform" };
            case Monster:
                return { active: this.activeMonsters, inactive: this.inactiveMonsters, className: ".monster" };
            case PowerUp:
                return { active: this.activePowerUps, inactive: this.inactivePowerUps, className: ".power_up" };
            default:
                console.log("Unknown game object");
        }
    }

    toggleMenu({ isStarted, isPaused, isOver }) {
        if (isStarted) {
            switch (true) {
                case isOver:
                    this.main.append(this.baseMenu);
                    document.querySelector(".menuPicture").src = "./public/assets/hud/you-lose.webp";
                    document.querySelector(".mainMenu").append(this.loseMenu);
                    break;
                case isPaused:
                    this.main.append(this.baseMenu);
                    document.querySelector(".mainMenu").append(this.pauseMenu);
                    break;
                default:
                    document.querySelector(".menuContent").remove();
                    this.baseMenu.remove();
            }
        } else {
            this.main.append(this.baseMenu);
            document.querySelector(".mainMenu").append(this.startMenu);
        }
    }

    createObject(object) {
        let elemTabs = this.getElementTabs(object.constructor);
        let newElement;

        if (elemTabs.inactive.length > 0) {
            newElement = elemTabs.inactive.shift();
        } else {
            newElement = this.templates.cloneNode(true).querySelector(elemTabs.className);
        }

        newElement.src = object.skin;
        newElement.dataset.idData = object.id;
        newElement.style.height = object.height + "px";

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
        switch (this.game.doodler.direction) {
            case "left":
                this.doodlerElem.src = `${this.game.doodler.skin.left}`;
                break;
            case "right":
                this.doodlerElem.src = `${this.game.doodler.skin.right}`;
                break;
        }

        this.doodlerElem.style.transform = `translate(${this.game.doodler.position.x}px, ${this.game.doodler.position.y}px)`;
    }

    refreshElements() {
        this.getAllUiElements().forEach((uiElement) => {
            let objectData = this.game.getObjectData(uiElement.dataset.idData);
            uiElement.style.transform = `translate(${objectData.position.x}px, ${objectData.position.y}px)`;
        });

        this.score.innerHTML = Math.floor(this.game.score);
    }

    refreshGameUi() {
        this.refreshDoodler();
        this.refreshElements();
    }
}

export default GameUi;
