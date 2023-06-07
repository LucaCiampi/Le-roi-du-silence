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

        this.closingDoor.position.set(1.18, 0.55, 11.65);
        this.exitDoor.position.set(0.2, 0.55, 2.65);
        this.exitDoor.rotation.set(0, 1.6, 0);

        this.minScoreRequired = 0;

        this.triggerZones = [
            // In the corner on the left
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                resources: this.resources, 
                name: 'zone 1',
                startPosition: new THREE.Vector2(0, -18),
                endPosition: new THREE.Vector2(1, -16),
                hasIndicator: true,
            }),
            // Near the lockers on the left
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                resources: this.resources, 
                name: 'zone 2',
                startPosition: new THREE.Vector2(-3, -17),
                endPosition: new THREE.Vector2(-2, -14),
                hasIndicator: true,
            }),
            // Next to the door open on the right
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                resources: this.resources, 
                name: 'zone 3',
                startPosition: new THREE.Vector2(4, -20),
                endPosition: new THREE.Vector2(6, -18),
                hasIndicator: true,
            }),
            // At the end of the corridor
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                resources: this.resources, 
                name: 'zone 4',
                startPosition: new THREE.Vector2(2, -24),
                endPosition: new THREE.Vector2(4, -22),
                hasIndicator: true,
            })
        ]

        this.setRoomModel();

        this.addExitDoor();

        this.props.push(this.resources.items['room1Props'].scene);

        const godRays = this.resources.items['room1Godrays'].scene;
        godRays.children[0].children[0].material.opacity = 0.3;
        godRays.children[0].children[0].material.transparent = true;
        this.props.push(godRays);

        const highlights = this.resources.items['room1Highlights'].scene;
        highlights.children.forEach(prop => {
            prop.material = new THREE.MeshPhongMaterial({
                color: 0xffff00
            })
        });
        this.props.push(highlights);
        console.log(highlights);

        this.addPositionalAudioTrack('room1Kids', 4, 4, 3, 4, true, 1);

        this.additionalEntranceActions = () => { this.world.userInterface.hideOnboarding(); }

        if (this.debug.active) {
            this.addDebugOptions();
        }
    }

    update() {
        // Silence is golden...
    }
}