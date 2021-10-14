import TComponent from "../ui/TComponent";
import TGrid from "./TGrid";
import TGridGroup from "./TGridGroup";

export default class TGridColumn extends TComponent {
    private code: string;
    private name: string;
    private width: number = 0;
    private align: string;
    private _export = true;
    private _visible = true;

    constructor(owner: TGrid | TGridGroup, code: string, name: string = null) {
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

    getCols() {
        return this.readProperty("cols");
    };

    setCols(value: string) {
        this.writerProperty("cols", value);
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

    getVisible(): boolean {
        return this._visible;
    }

    setVisible(value: boolean): TGridColumn {
        this._visible = value;
        return this;
    }

}
