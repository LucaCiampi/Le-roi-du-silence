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
        this.position = new THREE.Vector3(-0.45, 1.85, -22.4);
        this.spawnPosition = new THREE.Vector3(2.7, 3.5, -12);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(0, -23),
            endPosition: new THREE.Vector2(20, -12),
            color: 0xff0000
        });

        this.closingDoor.position.set(1.15, 0.5, 11.65);
        this.exitDoor.position.set(0.2, 0.5, 2.5);
        this.exitDoor.rotation.set(0, 1.6, 0);

        this.minScoreRequired = 0;

        this.triggerZones = [
            // In the corner on the left
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                name: 'zone 1',
                startPosition: new THREE.Vector2(0, -18),
                endPosition: new THREE.Vector2(1, -16),
            }),
            // Near the lockers on the left
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                name: 'zone 2',
                startPosition: new THREE.Vector2(-3, -17),
                endPosition: new THREE.Vector2(-2, -14),
            }),
            // Next to the door open on the right
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                name: 'zone 3',
                startPosition: new THREE.Vector2(4, -20),
                endPosition: new THREE.Vector2(6, -18),
            }),
            // At the end of the corridor
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                name: 'zone 4',
                startPosition: new THREE.Vector2(2, -24),
                endPosition: new THREE.Vector2(4, -22),
            })
        ]

        this.setRoomModel();

        this.addExitDoor();

        this.addPositionalAudioTrack('room1Kids', 4, 4, 3, 4, true, 1);

        if (this.debug.active) {
            this.addDebugOptions();
        }
    }

    update() {
        // Silence is golden...
    }
}