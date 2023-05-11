import * as THREE from 'three'
import Room from "../Room";
import TriggerZone from '../TriggerZone'

export default class Room3 extends Room {
    constructor(_options) {
        super(_options)

        this.parameter = _options.parameter;
        this.debug = _options.debug;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.zoneEvent = _options.zoneEvent;

        this.name = null;
        this.position = null;
        this.spawnPosition = null;
        this.entranceTriggerZone = null;
        this.model = null;

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
            zoneEvent: () => this.zoneEvent("room 3")
        });

        this.props = [];
        console.log('init room3')

        
        this.model = this.resources.items['room3'].scene;
        this.model.position.set(this.position.x, this.position.y, this.position.z)
        
        // this.props = [];

        // this.entranceTriggerZone = new TriggerZone({

        // })

        this.model.traverse((child, key) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial();

                child.material.map = this.resources.items['wood'];
                child.material.needsUpdate = true;

                // child.material.map = sprite;
            }
        })

        this.scene.add(this.model)

        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(2, 2, -2)
        // this.props.add(cube)
        this.props = cube
    }

    update() {
        console.log('update room 3')
    }

    destroy() {
        this.dispose(this.model)
        this.model = null;
    }
}