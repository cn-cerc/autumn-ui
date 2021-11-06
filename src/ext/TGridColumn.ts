import React from "react";
import DataRow from "../db/DataRow";
import GridColumns from "../rcc/GridConfig";
import TComponent from "../ui/TComponent";
import TGrid from "./TGrid";
import { TGridGroupChild, TGridGroupMaster } from "./TGridGroup";

interface onRenderType {
    (column: TGridColumn, row: DataRow): React.ReactNode;
}

export default class TGridColumn extends TComponent {
    private _code: string;
    private _name: string;
    private _width: number = 0;
    private _align: string;
    private _export = true;
    private _onRender: onRenderType;

    constructor(owner: TGrid | TGridGroupMaster | TGridGroupChild | GridColumns, code: string, name: string = null) {
        super(owner);
        this._code = code;
        this._name = name ? name : code;
    }

    get code(): string { return this._code }

    get name() { return this._name }

    get colSpan(): string { return this.readProperty("colspan"); }
    setColSpan(value: string): TGridColumn {
        this.writeProperty("colspan", value);
        return this;
    }

    get width(): number { return this._width }
    setWidth(value: number): TGridColumn {
        this._width = value;
        return this;
    }

    get align(): string { return this._align }
    setAlign(value: string) {
        this._align = value;
        return this;
    }

    get export(): boolean { return this._export; }
    setExport(value: boolean): TGridColumn {
        this._export = value;
        return this;
    }

    get onRender(): onRenderType { return this._onRender }
    setOnRender(value: onRenderType) { this._onRender = value; return this; }

}
