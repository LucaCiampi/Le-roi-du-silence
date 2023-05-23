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
        this.position = new THREE.Vector3(1, 2, -18);
        this.spawnPosition = new THREE.Vector3(2, 2, -14);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(0, -20),
            endPosition: new THREE.Vector2(10, -7),
        });

        this.setRoomModel();

        // Hands
        const hands = this.resources.items['hands'].scene;
        const handsClips = this.resources.items['hands'].animations;
        hands.position.set(4, 1, 4);
        this.handsClip = THREE.AnimationClip.findByName(handsClips, 'anim_bras');
        this.handsAnimationMixer = new THREE.AnimationMixer(hands);
        this.props.push(hands);

        this.additionalEntranceActions = () => { this.initHandsAnimation(); }

        this.model.add(this.positionalAudioTrack)
    }

    update() {
        this.handsAnimationMixer.update(0.01);
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