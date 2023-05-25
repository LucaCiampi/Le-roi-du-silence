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
        this.position = new THREE.Vector3(-7, -1, -19.9);
        this.spawnPosition = new THREE.Vector3(-8, 0, -21);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(-12, -22),
            endPosition: new THREE.Vector2(-7.5, -14),
        });

        this.closingDoor.position.set(1.2, 0, 10);
        this.exitDoor.position.set(0, 0, 20);

        this.minScoreRequired = 4;

        this.triggerZones = [
            // Cellphones
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                name: 'cellphones',
                startPosition: new THREE.Vector2(-15, -26),
                endPosition: new THREE.Vector2(-14, -24),
            }),
            // The TV's
            new TriggerZone({
                debug: this.debug,
                scene: this.scene,
                name: 'tvs',
                startPosition: new THREE.Vector2(-17, -24),
                endPosition: new THREE.Vector2(-14, -22),
                color: 0x00ffff
            }),
        ]

        this.setRoomModel();

        this.addExitDoor();

        // Hands
        const hands = this.resources.items['hands'].scene;
        const handsClips = this.resources.items['hands'].animations;
        // hands.position.set(4, 1, 4);
        this.handsClip = THREE.AnimationClip.findByName(handsClips, 'animation_0');
        this.handsAnimationMixer = new THREE.AnimationMixer(hands);
        this.props.push(hands);

        this.additionalEntranceActions = () => { this.initHandsAnimation(); }

        // --------- Positional audio ---------
        // --- 1
        const tvPositionalAudioTrack = new THREE.PositionalAudio(this.camera.audioListener);
        tvPositionalAudioTrack.setBuffer(this.resources.items['tvbzz']);
        tvPositionalAudioTrack.setRefDistance(2);
        tvPositionalAudioTrack.setLoop(true);

        // create an object for the sound to play from
        const audioSphere = new THREE.SphereGeometry(1, 32, 16);
        const audioMaterial = new THREE.MeshPhongMaterial({ color: 0xff2200 });
        const tvAudioMesh = new THREE.Mesh(audioSphere, audioMaterial);
        tvAudioMesh.position.set(4, 10, 4);

        // finally add the sound to the mesh
        tvAudioMesh.add(this.tvPositionalAudioTrack);

        this.positionalAudioTracks.push(tvPositionalAudioTrack)
        this.model.add(tvAudioMesh)

        // --- 2
        const ewwPositionalAudioTrack = new THREE.PositionalAudio(this.camera.audioListener);
        ewwPositionalAudioTrack.setBuffer(this.resources.items['eww']);
        ewwPositionalAudioTrack.setRefDistance(2);
        ewwPositionalAudioTrack.setLoop(true);
        
        // create an object for the sound to play from
        const ewwAudioMesh = new THREE.Mesh(audioSphere, audioMaterial);
        ewwAudioMesh.position.set(4, 20, 4);

        // finally add the sound to the mesh
        ewwAudioMesh.add(this.ewwPositionalAudioTrack);

        this.positionalAudioTracks.push(ewwPositionalAudioTrack)
        this.model.add(ewwAudioMesh)
    }

    update() {
        this.handsAnimationMixer.update(0.01);
    }

    /**
     * Sets up the hands animation
     */
    initHandsAnimation() {
        const action = this.handsAnimationMixer.clipAction(this.handsClip);
        action.play();
    }
}