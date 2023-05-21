import * as THREE from 'three'
import Room from "../Room";
import TriggerZone from '../TriggerZone'

export default class Room2 extends Room {
    constructor(_options) {
        super(_options)

        this.init();
    }

    init() {
        this.name = "room2";
        this.position = new THREE.Vector3(-14, 0, -28);
        this.spawnPosition = new THREE.Vector3(-12, 0, -26);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(-12, -22),
            endPosition: new THREE.Vector2(-6, -14),
        });

        this.setRoomModel();

        // Test cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(2, 2, -6);
        // this.props.push(cube);
    }

    update() {
        // Silence is golden...
    }
}