import TButton from "./TButton";
import TTabControl from "./TTabControl";

export default class TTabSheet extends TButton {
    private _data: any;

    constructor(owner: TTabControl, props: any = null) {
        super(owner, props);
    }

    get data(): any { return this._data }
    setData(value: any): TTabSheet { this._data = value; return this; }

}