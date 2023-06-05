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
        this.position = new THREE.Vector3(-24.8, 1, -41);
        this.spawnPosition = new THREE.Vector3(-25, 2, -39.9);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(-27, -40),
            endPosition: new THREE.Vector2(-24, -38),
            color: 0xff00ff
        });

        this.minScoreRequired = 12;

        this.setRoomModel();

        this.additionalEntranceActions = () => { this.updateFogDistance(); }

        if (this.debug.active) {
            this.addDebugOptions();
        }

        this.gameOverZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(-32, -29),
            endPosition: new THREE.Vector2(-23, -27),
            color: 0x22ff66
        })
    }

    update() {
        // Silence is golden...
    }

    hasEnteredGameOverZone(playerPosition) {
        if (this.gameOverZone.hasPlayerInZone(playerPosition)) {
            return true;
        }
    }

    updateFogDistance() {
        this.scene.fog.far = 24;
    }
}