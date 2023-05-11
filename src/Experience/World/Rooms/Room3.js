import * as THREE from 'three'
import Room from "../Room";
import TriggerZone from '../TriggerZone'

export default class Room3 extends Room {
    constructor(_options) {
        super(_options)

        this.init();
    }

    init() {
        this.name = "room3";
        this.position = new THREE.Vector3(-19, 2, -40);
        this.spawnPosition = new THREE.Vector3(-19, 2, -40);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(-22, -44),
            endPosition: new THREE.Vector2(-18, -30),
        });
        
        this.setRoomModel();

        this.addPropsToScene();
    }

    update() {
        console.log('update room 3')
    }
}