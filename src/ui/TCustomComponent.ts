import HtmlWriter from "./HtmlWriter";
import TComponent from "./TComponent";

export default class TCustomComponent extends TComponent {

    public output(html: HtmlWriter) {
        html.print(this.html());
    }

    html(): string {
        return (
            `<div>not create</div>`
        )
    }
}

