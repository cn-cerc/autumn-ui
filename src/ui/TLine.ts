import HtmlWriter from "./HtmlWriter";
import TComponent from "./TComponent";

export default class TLine extends TComponent {

    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('hr');
    }

    output(html: HtmlWriter) {
        html.print("<hr/>")
    }
}