import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { OnFieldChangedEvent } from "./DBEdit";
import { OnPageChanged } from "./MutiPage";
import WebControl from "./WebControl";
export declare type OnRowChangedEvent = (row: DataRow, field: string, oldValue: string) => void;
export declare type OnRowClickEvent = (row: DataRow, sender?: any) => void;
declare type DBGridProps = {
    dataSet: DataSet;
    readOnly?: boolean;
    onChanged?: OnRowChangedEvent;
    onRowClick?: OnRowClickEvent;
    dataJson?: string;
    openPage?: boolean;
    allowSort?: boolean;
    className?: string;
    onKeyDown?: Function;
    allowCheck?: boolean;
};
declare type sortType = 'desc' | 'asc';
declare type DBGridState = {
    allWidth: number;
    beginPoint: number;
    endPoint: number;
    sortData: {
        code: string;
        sortType: sortType;
    };
    direction: [number, number];
    allowInput: boolean;
    isInput: boolean;
};
export declare type OnDataRowChangedEvent = (recNo: number, field: string, value: string) => void;
export default class DBGrid extends WebControl<DBGridProps, DBGridState> {
    static defaultProps: {
        readOnly: boolean;
        openPage: boolean;
    };
    private self;
    private children;
    private allowChildren;
    private colunmMap;
    private allowMap;
    private size;
    constructor(props: DBGridProps);
    componentDidUpdate(prevProps: DBGridProps): void;
    initColumnMap(): void;
    render(): JSX.Element;
    getHead(): React.ReactNode[];
    getRows(): React.ReactNode[];
    onTrClick: (recNo: number, sender: any) => void;
    handleKeyDown(sender: any): void;
    getRow(dataRow: DataRow, recNo: number): React.ReactNode[];
    getChecked(key: React.Key, recNo: number): boolean;
    getAllowInput(key: React.Key, recNo: number): boolean;
    onChanged: OnDataRowChangedEvent;
    getNavigator(): React.ReactNode;
    onPageChanged: OnPageChanged;
    getAllWidth(): number;
    getWidth(width: string): string;
    componentWillUnmount(): void;
    bindInputEvent(): void;
    handleInputKeydown(e: any): void;
    initDataSet(input: HTMLInputElement, element: HTMLInputElement, index: number): void;
    setSort(code: string, sortString: string): void;
    resetDirection(): void;
    changeIsInput(bool: boolean): void;
}
export declare enum ColumnType {
    th = 0,
    td = 1,
    span = 2
}
export declare type ColumnPropsType = {
    tag?: ColumnType;
    dataRow?: DataRow;
    recNo?: number;
    code: string;
    name?: string;
    width: string;
    colSpan?: number;
    onChanged?: OnDataRowChangedEvent;
    onChangedOwner?: OnDataRowChangedEvent;
    textAlign?: "left" | "right" | "center";
    customText?: Function;
    customSort?: string;
    visible?: boolean;
    setSort?: Function;
    sortType?: sortType;
    allowCheck?: boolean;
    checked?: boolean;
    allowInput?: boolean;
    enterEvent?: Function;
    onChangeInput?: Function;
};
declare type ColumnStateType = {
    dataRow: DataRow;
};
export declare class Column extends WebControl<ColumnPropsType, ColumnStateType> {
    static className: string;
    private self;
    static defaultProps: {
        tag: ColumnType;
        colSpan: number;
    };
    constructor(props: ColumnPropsType);
    componentWillReceiveProps(): void;
    render(): JSX.Element;
    getTd(): JSX.Element;
    getValue(): React.ReactNode;
    getContent(): React.ReactElement<any, string | React.JSXElementConstructor<any>>[];
    onChanged: OnFieldChangedEvent;
    setSort(): void;
    getArrow(): JSX.Element;
    handleFocus(): void;
    handleBlur(e: any): void;
    handleClick(e: any): void;
}
declare type ChildRowPropsType = {
    dataRow?: DataRow;
    colSpan?: number;
    visible?: boolean;
    autoJudge?: boolean;
};
export declare class ChildRow extends React.Component<ChildRowPropsType> {
    render(): React.ReactNode[];
}
declare type MainRowTypeProps = {
    dataRow?: DataRow;
    dynamicClass?: (row: DataRow) => string;
    tag?: ColumnType;
    recNo?: number;
};
declare type MainRowTypeState = {
    allWidth: number;
};
export declare class MainRow extends React.Component<MainRowTypeProps, MainRowTypeState> {
    static className: string;
    constructor(props: MainRowTypeProps);
    render(): React.ReactNode[];
    getAllWidth(): number;
    getWidth(width: string): string;
}
export {};
