import TButton from "./TButton";
import TTabControl from "./TTabControl";

export default class TTabSheet extends TButton {
    private _data: any;

    constructor(owner: TTabControl, props: any = null) {
        super(owner, props);
    }

    set data(value: any) { this._data = value }
    get data(): any { return this._data }

}