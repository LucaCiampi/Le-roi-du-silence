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

        this.init();
    }

    init() {
        console.log('init room2')

        this.name = "room2";
        this.position = new THREE.Vector3(-14, 0, -28);
        this.spawnPosition = new THREE.Vector3(-12, 0, -26);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(-12, -22),
            endPosition: new THREE.Vector2(-6, -14),
            zoneEvent: () => this.zoneEvent("zone 2")
        });

        this.additionalEntranceActions = () => {this.animateHands();}

        this.setRoomModel();

        // Test cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(2, 2, -6);
        // this.props.push(cube);

        // Hands
        const hands = this.resources.items['hands'].scene;
        hands.position.set(4, 2, -7);
        console.log(hands.animations)
        this.props.push(hands);
        
        this.addPropsToScene();
    }

    update() {
        console.log('update room 2');

        this.animateHands();
    }

    animateHands() {
        console.log('animate hands')
    }
}