class EventHandler {
    constructor(game) {
        this.game = game;
    }

    handleEvent(event) {
        switch(event.type) {
            case 'keydown':
                this.handleKeyPressed(event.key);
                break;
            case 'keyup':
                this.handleKeyReleased(event.key);
                break;
            default:
                console.error('Error: event ' + event.type + 'is not supported');
        }
    }

    handleKeyPressed(keyPressed) {
        switch(keyPressed) {
            case 'q': 
                this.game.startDoodlerMovement(false, 'left');
                break;
            case 'd': 
                this.game.startDoodlerMovement(true, 'right');
                break;
            case 'z':
                this.game.jumpDoodler();
                break;   
        }
    }

    handleKeyReleased(keyLeft) {
        switch(keyLeft) {
            case 'q': 
                this.game.stopDoodlerMovement(false);
                break;
            case 'd': 
                this.game.stopDoodlerMovement(true);
                break;
            case 'r':
                this.game.restartGame();
                break;
            case 'b':
                this.game.togglePause();
                break;
        }
    }
}

export default EventHandler;