import TComponent from "./TComponent";

export default class TDiv extends TComponent {

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.setRootLabel('div');
    }

}
