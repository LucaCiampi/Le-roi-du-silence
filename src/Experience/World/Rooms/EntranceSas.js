import * as THREE from 'three'
import Room from "../Room";
import TriggerZone from '../TriggerZone'

export default class EntranceSas extends Room {
    constructor(_options) {
        super(_options)

        this.init();
    }

    init() {
        this.name = "sas";
        this.position = new THREE.Vector3(0, 0, 0);
        
        this.setRoomModel();        
    }

    update() {
        // Silence is golden...
    }
}