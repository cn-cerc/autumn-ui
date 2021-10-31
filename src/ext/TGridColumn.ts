import DataRow from "../db/DataRow";
import TComponent from "../ui/TComponent";
import TGrid from "./TGrid";
import TGridGroupChild from "./TGridGroupChild";
import TGridGroupMaster from "./TGridGroupMaster";

export default class TGridColumn extends TComponent {
    private _code: string;
    private _name: string;
    private _width: number = 0;
    private _align: string;
    private _export = true;
    public onRender: (column: TGridColumn, row: DataRow) => any;

    constructor(owner: TGrid | TGridGroupMaster | TGridGroupChild, code: string, name: string = null) {
        super(owner);
        this._code = code;
        this._name = name ? name : code;
    }

    get code(): string { return this._code }
    getCode() {
        return this._code;
    }

    get name() { return this._name }
    getName() {
        return this._name;
    }

    get colSpan(): number {
        let result = this.readProperty("colspan");
        return result ? Number.parseInt(result) : 1;
    }
    getColspan() {
        return this.readProperty("colspan");
    };
    setColspan(value: string) {
        this.writeProperty("colspan", value);
        return this;
    }

    set width(value: number) { this._width = value }
    get width(): number { return this._width }
    setWidth(value: number) {
        this._width = value;
        return this;
    }
    getWidth(): number {
        return this._width;
    }

    set align(value: string) { this._align = value }
    get align(): string { return this._align }
    setAlign(value: string) {
        this._align = value;
        return this;
    }
    getAlign() { return this._align }

    getExport(): boolean {
        return this._export;
    }

    setExport(value: boolean): TGridColumn {
        this._export = value;
        return this;
    }

}
