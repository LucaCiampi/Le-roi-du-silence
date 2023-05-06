import * as THREE from 'three'

export default class Zone {
    constructor(_options) {
        // Options
        this.parameter = _options.parameter;
        this.name = _options.name;
        this.startPosition = _options.startPosition;
        this.endPosition = _options.endPosition;

        // Set up
        this.isIn = false;
        this.boundingBox = null;

        this.init()
    }

    init() {
        // Box
        this.boundingBox = new THREE.Box2(this.startPosition, this.endPosition);
    }

    hasPlayerInZone(playerPosition) {
        if(this.boundingBox.containsPoint(new THREE.Vector2(playerPosition.x, playerPosition.z))) {
            return true
        }
        
        return false
    }

    startZoneActions() {
        console.log('Action : send message');
        this.parameter.sounds.play('swoosh1');
    }
}