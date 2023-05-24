import * as THREE from 'three'
import Room from "../Room";
import TriggerZone from '../TriggerZone'

export default class Room4 extends Room {
    constructor(_options) {
        super(_options)

        this.init();
    }

    init() {
        this.name = "room4";
        this.position = new THREE.Vector3(-4, 2, -41);
        this.spawnPosition = new THREE.Vector3(-4, 2, -50);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(-12, -44),
            endPosition: new THREE.Vector2(-8, -41),
        });
        
        this.setRoomModel();
    }

    update() {
        // Silence is golden...
    }
}