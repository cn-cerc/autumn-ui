import Header from "./sample/Header";
import { TComponent, TPage } from "./src/SummerCI";

export default class FrmIndex extends TPage {

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.title = 'index';

        new Header(this, { title: '首页' });
    }

}