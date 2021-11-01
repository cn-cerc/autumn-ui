import TComponent from "../ui/TComponent";
import TDiv from "../ui/TDiv";

export default class TPage extends TDiv {
    private _title: string;

    constructor(owner: TComponent, props: any = null) {
        super(owner);
        if (!owner)
            this.setContainer('page');
        if (!this.id)
            this.setId('page');
        if (props && props.title) {
            this.title = props.title;
        }
    }

    set title(value: string) { this._title = value }
    get title(): string { return this._title }

}