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
        this.position = new THREE.Vector3(-29, -9, -14.2);
        this.spawnPosition = new THREE.Vector3(-22.5, 2, -41.5);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(-12, -44),
            endPosition: new THREE.Vector2(-8, -41),
        });

        this.closingDoor.position.set(1.2, 0, 10);

        this.minScoreRequired = 12;
        
        this.setRoomModel();

        if (this.debug.active) {
            this.addDebugOptions();
        }
    }

    update() {
        // Silence is golden...
    }
}