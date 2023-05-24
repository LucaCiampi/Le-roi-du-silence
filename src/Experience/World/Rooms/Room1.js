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
        this.position = new THREE.Vector3(-0.45, 1.85, -22.2);
        this.spawnPosition = new THREE.Vector3(0, 2, -23);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(0, -23),
            endPosition: new THREE.Vector2(20, -12),
        });
        this.closingDoor.position.set(1.2, 2, 12);

        this.setRoomModel();

        this.model.add(this.positionalAudioTrack)

        // const cmcube = this.resources.items['hands'].scene
        // const mmcube = this.resources.items['cube_mm'].scene

        // console.log(cmcube)

        // cmcube.position.set(0, 2, -10)
        // mmcube.position.set(0, 1, -10)

        // this.props.push(cmcube)
        // this.props.push(mmcube)

        // const geometry = new THREE.BoxGeometry(10, 10, 10);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // const cube = new THREE.Mesh(geometry, material);
        // cube.position.set(0, 2, -10)
        // this.props.push(cube)
    }

    update() {
        // Silence is golden...
    }
}