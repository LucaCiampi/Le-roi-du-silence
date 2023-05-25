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

        // this.props.push(this.resources.items['room1Props'].scene)

        if (this.debug.active) {
            this.addDebugOptions();
        }

        // --------- Positional audio ---------
        this.positionalAudioTrack = new THREE.PositionalAudio(this.camera.audioListener);
        // this.positionalAudioTrack = new THREE.Audio(this.camera.audioListener);
        // this.positionalAudioTrack = new THREE.Audio(this.camera.instance.children[0]);
        this.positionalAudioTrack.setBuffer(this.resources.items['eww']);
        // this.positionalAudioTrack.setMediaElementSource(document.getElementById("test_audio"))
        this.positionalAudioTrack.setRefDistance(2);
        this.positionalAudioTrack.setLoop(true);

        // create an object for the sound to play from
        const audioSphere = new THREE.SphereGeometry(1, 32, 16);
        const audioMaterial = new THREE.MeshPhongMaterial({ color: 0xff2200 });
        const audioMesh = new THREE.Mesh(audioSphere, audioMaterial);
        audioMesh.position.set(4, 10, 4);

        // finally add the sound to the mesh
        audioMesh.add(this.positionalAudioTrack);

        this.model.add(audioMesh)
    }

    update() {
        // Silence is golden...
    }
}