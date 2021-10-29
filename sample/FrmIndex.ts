import TPage from "../src/ext/TPage";
import TComponent from "../src/ui/TComponent";
import Header from "./Header";

export default class FrmIndex extends TPage {

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.title = 'index';

        new Header(this, { title: '首页' });
    }

}