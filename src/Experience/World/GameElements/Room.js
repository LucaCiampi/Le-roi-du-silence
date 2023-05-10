export default class Room {
    constructor(_options) {
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;
        this.name = _options.name;

        this.model = null;
        this.props = null;

        this.init();
    }

    init() {
        this.model = this.resources.items[this.name].scene;
        this.model.position.set(0, -2, 0)

        this.scene.add(this.model)
    }

    destroy() {
        console.log('Room destroy()')
        this.props = null;
    }
}