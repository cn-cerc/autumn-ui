import { TDiv } from "../SummerCI";
import TComponent from "../ui/TComponent";

export default class TPage extends TDiv {

    constructor(owner: TComponent) {
        super(owner);
        if (!owner)
            this.setContainer('page');
        this.setCssStyle('height:100vh;display:flex;flex-direction: column;')
    }

    run() {
        this.render();
    }
}