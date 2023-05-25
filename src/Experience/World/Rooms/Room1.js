import * as THREE from 'three'
import Room from "../Room";
import TriggerZone from '../TriggerZone'

export default class Room1 extends Room {
    constructor(_options) {
        super(_options)

        this.init();
    }

    init() {
        this.name = "room1";
        this.position = new THREE.Vector3(-0.45, 2.45, -19.8);
        this.spawnPosition = new THREE.Vector3(2.7, 3.5, -12);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(0, -23),
            endPosition: new THREE.Vector2(20, -12),
        });

        this.closingDoor.position.set(1.2, 2, 12);
        this.exitDoor.position.set(0, 2, 20);
        
        this.minScoreRequired = 0;

        this.setRoomModel();

        this.addExitDoor();

        // this.model.add(this.positionalAudioTrack)

        // this.props.push(this.resources.items['room1Props'].scene)

        if (this.debug.active) {
            this.addDebugOptions();
        }
    }

    update() {
        // Silence is golden...
    }
}