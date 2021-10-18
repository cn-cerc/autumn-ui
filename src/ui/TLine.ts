import HtmlWriter from "./HtmlWriter";
import TComponent from "./TComponent";

export default class TLine extends TComponent {
    
    constructor(owner: TComponent) {
        super(owner);
        this.rootLabel = 'hr';
    }

    output(html: HtmlWriter) {
        html.print("<hr/>")
    }
}