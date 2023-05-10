import * as THREE from 'three'
import Room from "../Room";
import TriggerZone from '../TriggerZone'

export default class Room2 extends Room {
    constructor(_options) {
        super(_options)

        this.parameter = _options.parameter;
        this.debug = _options.debug;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.zoneEvent = _options.zoneEvent;

        this.name = "room2";
        this.position = new THREE.Vector3(-14, 0, -28);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(-12, -22),
            endPosition: new THREE.Vector2(-6, -14),
            zoneEvent: () => this.zoneEvent("zone 2")
        });

        this.monActionRoom2 = null;
        this.init();
    }

    init() {
        this.props = [];
        console.log('init room2')
        this.monActionRoom2 = "action room 2";

        this.model = this.resources.items['room2'].scene;
        this.model.position.set(this.position.x, this.position.y, this.position.z)

        // this.props = [];

        // this.entranceTriggerZone = new TriggerZone({

        // })

        this.model.traverse((child, key) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial();

                child.material.map = this.resources.items['wood'];
                child.material.needsUpdate = true;
            }
        })

        this.scene.add(this.model)

        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(2, 2, -6)
        this.props.push(cube)
    }

    update() {
        console.log('update room 2');
    }

    destroy() {
        this.dispose(this.model)
        this.model = null;
    }
}