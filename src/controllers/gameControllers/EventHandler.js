class EventHandler {
    constructor(game) {
        this.game = game;
    }

    handleEvent(event) {
        switch(event.type) {
            case 'keydown':
                this.handleKeyPressed(event.keyCode);
                break;
            case 'keyup':
                this.handleKeyReleased(event.keyCode);
                break;
            default:
                console.error('Error: event ' + event.type + 'is not supported');
        }
    }

    handleKeyPressed(keyPressed) {
        switch(keyPressed) {
            case 37:
            case 81: 
                this.game.startDoodlerMovement(false, 'left');
                break;
            case 39:
            case 68: 
                this.game.startDoodlerMovement(true, 'right');
                break;
            case 90:
                this.game.jumpDoodler();
                break;   
        }
    }

    handleKeyReleased(keyLeft) {
        switch(keyLeft) {
            case 37:
            case 81: 
                this.game.stopDoodlerMovement(false);
                break;
            case 39:
            case 68: 
                this.game.stopDoodlerMovement(true);
                break;
            case 82:
                this.game.restartGame();
                break;
            case 27:
                this.game.togglePause();
                break;
        }
    }
}

export default EventHandler;