import { TComponent, TPage } from "../src/SummerCI";
import Header from "./Header";

export default class FrmIndex extends TPage {

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.title = 'index';

        new Header(this, { title: '首页' });
    }

}