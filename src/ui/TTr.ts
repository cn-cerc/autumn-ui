import TComponent from './TComponent';

export default class TTr extends TComponent {

    constructor(owner: TComponent = null) {
        super(owner);
        this.setRootLabel("tr");
    }

}