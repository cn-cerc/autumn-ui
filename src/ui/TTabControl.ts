import DataControl from "../db/DataControl";
import { app } from "../ext/TApplication";
import { TApplication, TPage, TSpan } from "../SummerCI";
import HtmlWriter from "./HtmlWriter";
import TComponent from "./TComponent";
import TDiv from "./TDiv";
import TTabSheet from "./TTabSheet";

export default class TTabControl extends TDiv implements DataControl {
    private _items: Map<TPage, TTabSheet> = new Map<TPage, TTabSheet>();

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        if (owner instanceof TApplication)
            app.registerBind(this, true);
    }

    beginOutput(html: HtmlWriter) {
        if (this.owner instanceof TApplication) {
            let app = this.owner as TApplication;
            if (app.getPages().length > 1) {
                let it = 0;
                for (let page of app.getPages()) {
                    if (this._items.get(page) == undefined) {
                        let span = new TTabSheet(this);
                        span.text = page.title ? page.title : page.getUid();
                        span.data = it;
                        span.addEventListener('click', () => {
                            app.pageNo = span.data;
                        })
                        this._items.set(page, span);
                    }
                    it++;
                }
            } else {
                this._items.clear();
            }
        }
        super.beginOutput(html);
    }

    doChange(content: any = undefined): void {
        this.render();
    }

}