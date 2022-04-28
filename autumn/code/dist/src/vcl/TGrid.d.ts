/// <reference types="react" />
import DataControl from '../db/DataControl';
import DataRow from '../db/DataRow';
import DataSet from '../db/DataSet';
import FieldDefs from '../db/FieldDefs';
import KeyValue from '../db/KeyValue';
import TComponent, { HtmlWriter } from './TComponent';
import TTable from './TTable';
export default class TGrid extends TTable implements DataControl {
    private _dataSet;
    private _groups;
    constructor(owner: TComponent, props?: any);
    get dataSet(): DataSet;
    setDataSet(dataSet: DataSet): TGrid;
    output(html: HtmlWriter): void;
    addColumns(fields: FieldDefs): void;
    addComponent(child: TComponent): TGrid;
    getGroup(index: number): TGridGroup;
    getColumn(columnCode: string): TGridColumn;
    clear(): void;
    /**
     * 将dataSet与后台交换生成excel文件
     * @param exportUrl 后台excel转换网址
     * @param filename  要导出的文件名称
     */
    exportExcel(exportUrl: string, filename: string): void;
    /**
     * 输出纯文本的csv格式
     */
    exportText(fileName: string): void;
    /**
     *  构建下载链接
     *
     * @param fileName 文件名称（自带后缀名）
     * @param blob 大数据快
     */
    private static download;
    doChange(content?: any): void;
}
interface onRenderType {
    (column: TGridColumn, row: DataRow): React.ReactNode;
}
export declare class TGridColumn extends TComponent {
    private _code;
    private _name;
    private _width;
    private _align;
    private _export;
    private _onRender;
    constructor(owner: TGrid | TGridGroupMaster | TGridGroupChild | TGridConfig, code: string, name?: string);
    get code(): string;
    get name(): string;
    get colSpan(): string;
    setColSpan(value: string): TGridColumn;
    get width(): number;
    setWidth(value: number): TGridColumn;
    get align(): string;
    setAlign(value: string): this;
    get export(): boolean;
    setExport(value: boolean): TGridColumn;
    get onRender(): onRenderType;
    setOnRender(value: onRenderType): this;
}
interface IGroupOnOutput {
    (child: TGridGroup, display: KeyValue): void;
}
export declare class TGridGroup extends TComponent {
    private _titleVisiable;
    private _current;
    private _master;
    private _onOutput;
    constructor(owner: TComponent);
    get current(): DataRow;
    setCurrent(row: DataRow): void;
    get titleVisiable(): boolean;
    setTitleVisiable(value: boolean): TGridGroup;
    getTotalWidth(): number;
    get columns(): TGridColumn[];
    getColumnCount(): number;
    getColumn(columnCode: string): TGridColumn;
    forEach(fn: (column: TGridColumn) => void): void;
    get master(): TGridGroup;
    setMaster(value: TGridGroup): TGridGroup;
    get onOutput(): IGroupOnOutput;
    setOnOutput(value: IGroupOnOutput): TGridGroup;
    outputOfGridTitle(html: HtmlWriter): void;
}
export declare class TGridGroupChild extends TGridGroup {
    constructor(owner: TComponent);
    output(html: HtmlWriter): void;
}
export declare class TGridGroupMaster extends TGridGroup {
    constructor(owner: TComponent);
    output(html: HtmlWriter): void;
}
interface IOnOutput {
    (child: TGridConfig, display: KeyValue): void;
}
export declare class TGridConfig extends TComponent {
    private _dataSet;
    private _titleVisiable;
    private _current;
    private _children;
    private _onOutput;
    constructor(owner?: TGridConfig);
    get current(): DataRow;
    setCurrent(row: DataRow): void;
    get titleVisiable(): boolean;
    setTitleVisiable(value: boolean): TGridConfig;
    getTotalWidth(): number;
    get columns(): TGridColumn[];
    getColumn(columnCode: string): TGridColumn;
    get master(): TGridConfig;
    newChild(): TGridConfig;
    get children(): TGridConfig[];
    get onOutput(): IOnOutput;
    setOnOutput(value: IOnOutput): TGridConfig;
    get dataSet(): DataSet;
    setDataSet(value: DataSet): TGridConfig;
}
interface onRenderType {
    (column: GridColumn, row: DataRow): React.ReactNode;
}
export declare class GridColumn extends TComponent {
    private _code;
    private _name;
    private _width;
    private _align;
    private _export;
    private _onRender;
    constructor(owner: TGridConfig, code: string, name?: string);
    get code(): string;
    get name(): string;
    get colSpan(): string;
    setColSpan(value: string): GridColumn;
    get width(): number;
    setWidth(value: number): GridColumn;
    get align(): string;
    setAlign(value: string): this;
    get export(): boolean;
    setExport(value: boolean): GridColumn;
    get onRender(): onRenderType;
    setOnRender(value: onRenderType): this;
}
export {};
