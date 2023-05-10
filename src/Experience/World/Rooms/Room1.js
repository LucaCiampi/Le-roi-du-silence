import Room from "../GameElements/Room";

export default class Room1 extends Room {
    constructor(_options) {
        super()

        this.init();
    }

    init() {
        console.log('init room1')

        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 2, -10)
        this.props.add(cube)
    }
}