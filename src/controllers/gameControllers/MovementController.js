class MovementController {
    constructor() {}

    startObjectMovement(object, right, direction) {
        object.left = !right;
        object.right = right;
        object.direction = direction;
    }

    stopObjectMovement(object, right) {
        if (right) {
            object.right = false;
        } else {
            object.left = false;
        }
    }
}

export default MovementController;