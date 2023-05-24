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
            endPosition: new THREE.Vector2(-6, -14),
        });

        this.closingDoor.position.set(1.2, 0, 10);

        this.setRoomModel();

        // Hands
        const hands = this.resources.items['hands'].scene;
        const handsClips = this.resources.items['hands'].animations;
        // hands.position.set(4, 1, 4);
        this.handsClip = THREE.AnimationClip.findByName(handsClips, 'animation_0');
        this.handsAnimationMixer = new THREE.AnimationMixer(hands);
        this.props.push(hands);

        this.additionalEntranceActions = () => { this.initHandsAnimation(); }

    }

    update() {
        this.handsAnimationMixer.update(0.01);
        // this.animateAsh();
    }

    /**
     * Sets up the hands animation
     */
    initHandsAnimation() {
        // TODO: store action in object variable
        const action = this.handsAnimationMixer.clipAction(this.handsClip);
        action.play();
    }
}