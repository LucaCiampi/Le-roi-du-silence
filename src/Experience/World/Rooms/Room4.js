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

        this.gameOverZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(-31, -26),
            endPosition: new THREE.Vector2(-26, -21),
            color: 0x22ff66
        });
        this.hasEnteredGameOverZone = false;

        const note = this.resources.items['tel'].scene;
        note.position.set(0, 1.7, -17.8);
        this.props.push(note);

        if (this.debug.active) {
            this.addDebugOptions();
        }
    }

    update() {
        if (!this.hasEnteredGameOverZone) {
            this.checkGameOverZone();
        }
        else if (!this.parameter.modalOpen) {
            setTimeout(() => {
                console.log('end');
                this.parameter.endGame();
            }, 2000);
        }
    }

    /**
     * Checks if the player has entered the game over zone
     */
    checkGameOverZone() {
        if (this.gameOverZone.hasPlayerInZone(this.parameter.playerPosition)) {
            console.log('end')
            this.hasEnteredGameOverZone = true;
            this.world.userInterface.showUserInterfaceModal('./Interface/lettre-intro.png')
        }
    }

    updateFogDistance() {
        this.scene.fog.far = 24;
    }
}