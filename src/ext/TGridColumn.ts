import TComponent from "../ui/TComponent";
import TGrid from "./TGrid";
import TGridGroupChild from "./TGridGroupChild";
import TGridGroupMaster from "./TGridGroupMaster";

export default class TGridColumn extends TComponent {
    private code: string;
    private name: string;
    private width: number = 0;
    private align: string;
    private _export = true;

    constructor(owner: TGrid | TGridGroupMaster | TGridGroupChild, code: string, name: string = null) {
        super(owner);
        this.code = code;
        this.name = name ? name : code;
    }

    getCode() {
        return this.code;
    }

    getName() {
        return this.name;
    }

    getColspan() {
        return this.readProperty("colspan");
    };

    setColspan(value: string) {
        this.writeProperty("colspan", value);
        return this;
    }

    getWidth(): number {
        return this.width;
    };

    setWidth(value: number) {
        this.width = value;
        return this;
    }

    setAlign(align: string) {
        this.align = align;
        return this;
    }

    getAlign() {
        return this.align;
    }

    getExport(): boolean {
        return this._export;
    }

    setExport(value: boolean): TGridColumn {
        this._export = value;
        return this;
    }

}
