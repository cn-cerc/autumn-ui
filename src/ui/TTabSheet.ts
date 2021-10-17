import TButton from "./TButton";
import TTabControl from "./TTabControl";

export default class TTabSheet extends TButton {
    private _object: any;

    constructor(owner: TTabControl, props: any = null) {
        super(owner, props);
    }

    setObject(value: any): TButton {
        this._object = value;
        return this;
    }
    getObject(): any {
        return this._object;
    }

}