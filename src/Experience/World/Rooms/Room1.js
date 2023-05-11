import * as THREE from 'three'
import Room from "../Room";
import TriggerZone from '../TriggerZone'

export default class Room1 extends Room {
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
        this.name = "room1";
        this.position = new THREE.Vector3(1, 2, -18);
        this.spawnPosition = new THREE.Vector3(2, 2, -14);
        this.entranceTriggerZone = new TriggerZone({
            debug: this.debug,
            scene: this.scene,
            startPosition: new THREE.Vector2(0, -20),
            endPosition: new THREE.Vector2(10, -7),
            zoneEvent: () => this.zoneEvent("green zone")
        });

        this.setRoomModel();

        // Hands
        const hands = this.resources.items['hands'].scene;
        const handsAnimations = this.resources.items['hands'].animations;
        hands.position.set(4, 2, -7);
        // console.log(handsAnimations)
        this.props.push(hands);

        // Soldier
        const soldier = this.resources.items['soldier'].scene;
        const handsClips = this.resources.items['soldier'].animations;
        this.handsClip = THREE.AnimationClip.findByName(handsClips, 'Run');
        soldier.position.set(4, 2, -7);
        this.props.push(soldier);
        this.handsAnimationMixer = new THREE.AnimationMixer(soldier);

        this.addPropsToScene();

        this.additionalEntranceActions = () => { this.animateHands(); }
    }

    update() {
        console.log('update room 1')
        this.handsAnimationMixer.update(0.01);
    }

    animateHands() {
        console.log('animate hands')
        const action = this.handsAnimationMixer.clipAction(this.handsClip);
        action.play();
    }
}