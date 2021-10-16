import { TDiv } from "../SummerCI";
import TComponent from "../ui/TComponent";

export default class TPage extends TDiv {

    constructor(owner: TComponent) {
        super(owner);
        if (!owner)
            this.setContainer('page');
    }

    run() {
        this.render();
    }
}