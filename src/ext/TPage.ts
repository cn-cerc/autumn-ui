import { TDiv } from "../SummerCI";
import TComponent from "../ui/TComponent";

export default class TPage extends TDiv {

    constructor(owner: TComponent, props: any = null) {
        super(owner);
        if (!owner)
            this.setContainer('page');
        if (!this.getId())
            this.setId('page');
        this.setCssStyle('height:100vh;display:flex;flex-direction: column;')
    }

    run() {
        this.render();
    }
}