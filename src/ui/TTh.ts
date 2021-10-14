import TComponent from './TComponent';

export default class TTh extends TComponent {
    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel("th");
    }
}