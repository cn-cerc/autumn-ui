import HtmlWriter from "./HtmlWriter";
import TComponent from "./TComponent";
import TText from "./TText";

export default class TCustomComponent extends TComponent {
    private _content: TText;
    private _history: string[] = [];

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this._content = new TText(this);
    }

    beginOutput(html: HtmlWriter) {
        this._content.text = this.html().trim();
        this._history = [];
        //设置全局css样式
        let css = this.css().trim();
        if (css.length > 0 && this._history.length == 0) {
            for (let line of css.split('\n')) {
                let str = line.trim();
                if (str) {
                    this._history.push(str);
                    this.cssHead.push(str);
                }
            }
        }
        super.beginOutput(html);
    }

    html(): string {
        return (
            `<div>content not define</div>`
        )
    }

    css(): string {
        return (``)
    }
}

