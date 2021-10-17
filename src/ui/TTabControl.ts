import DataControl from "../db/DataControl";
import { app } from "../ext/TApplication";
import { TApplication, TPage, TSpan } from "../SummerCI";
import HtmlWriter from "./HtmlWriter";
import TComponent from "./TComponent";
import TDiv from "./TDiv";
import TTabSheet from "./TTabSheet";

export default class TTabControl extends TDiv implements DataControl {
    private items: Map<TPage, TTabSheet> = new Map<TPage, TTabSheet>();

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        if (owner instanceof TApplication)
            app.registerBind(this, true);
    }

    beginOutput(html: HtmlWriter) {
        if (this.getOwner() instanceof TApplication) {
            let app = this.getOwner() as TApplication;
            if (app.getPages().length > 1) {
                let it = 0;
                for (let page of app.getPages()) {
                    if (this.items.get(page) == undefined) {
                        let span = new TTabSheet(this).setText(page.getTitle() ? page.getTitle() : page.getUid());
                        span.setObject(it);
                        span.addEventListener('click', () => {
                            app.setPageNo(span.getObject());
                        })
                        this.items.set(page, span);
                    }
                    it++;
                }
            } else {
                this.items.clear();
            }
        }
        super.beginOutput(html);
    }

    doChange(content: any = undefined): void {
        this.render();
    }

}