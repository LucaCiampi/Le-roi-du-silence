import TriggerZone from './TriggerZone'

export default class Room {
    constructor(_options) {
        this.parameter = _options.parameter;
        this.debug = _options.debug;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.position = _options.position;
        this.name = _options.name;

        this.model = null;
        this.entranceTriggerZone = null;
        // this.props = null;
        this.props = [];

        this.init();
    }

    init() {
        this.model = this.resources.items[this.name].scene;
        this.model.position.set(this.position.x, this.position.y, this.position.z)

        // this.props = [];

        this.entranceTriggerZone = new TriggerZone({

        })

        this.scene.add(this.model)
    }

    destroy() {
        console.log('Room destroy()')
        this.props = null;
    }
}