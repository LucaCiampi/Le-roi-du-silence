import * as THREE from 'three'

export default class Zone {
    constructor(_options) {
        // Options
        this.name = _options.name;
        this.startPosition = _options.startPosition;
        this.endPosition = _options.endPosition;
        this.data = _options.data;

        // Set up
        this.isIn = false;
        this.boundingBox = null;

        this.init()
    }

    init() {
        // Box
        this.boundingBox = new THREE.Box2(this.startPosition, this.endPosition);
    }

    playerInZone(playerPosition) {
        if(this.boundingBox.containsPoint(new THREE.Vector2(playerPosition.x, playerPosition.z))) {
            return true
        }
        
        return false
    }
}