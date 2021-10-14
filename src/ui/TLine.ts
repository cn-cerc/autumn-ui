import TComponent from "./TComponent";

export default class TLine extends TComponent {
    constructor(owner) {
        super(owner);
        this.setRootLabel('hr');
    }

    output(html){
        html.print("<hr/>")
    }
}