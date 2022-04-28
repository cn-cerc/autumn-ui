import React, { MouseEventHandler, ReactNode } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { OnFieldChangedEvent } from "./DBEdit";
import { OnRowClickEvent } from "./DBGrid";
import { OnSelectDataRowEvent } from "./DialogComponent";
declare type PropsType = {
    dataRow?: DataRow;
    dataField: string;
    dataName?: string;
    placeholder?: string;
    onChanged?: OnFieldChangedEvent;
    autoFocus?: boolean;
    children?: ReactNode | undefined;
};
export declare type ClientSite = {
    left: number;
    top: number;
};
declare type ComboBoxState = {
    dataRow: DataRow;
    filterText: string;
    site: ClientSite;
    showTable: boolean;
};
export default class ComboBox extends React.Component<PropsType, ComboBoxState> {
    constructor(props: PropsType);
    render(): JSX.Element;
    inputOnChange: (sender: any) => void;
    onListSelect: OnSelectDataRowEvent;
    handleFocus(): void;
    componentDidMount(): void;
}
export declare type OnListFilterEvent = (row: DataRow) => boolean;
declare type ListGridProps = {
    dataSet: DataSet;
    readOnly?: boolean;
    onFilter: OnListFilterEvent;
    onRowClick?: OnRowClickEvent;
    children?: ReactNode | undefined;
};
declare type ListGridState = {
    dataSet: DataSet;
};
export declare class ListGrid extends React.Component<ListGridProps, ListGridState> {
    static defaultProps: {
        readOnly: boolean;
    };
    constructor(props: ListGridProps);
    render(): JSX.Element;
    getRows(): React.ReactNode[];
    onTrClick: MouseEventHandler<HTMLTableRowElement>;
    getRow(dataRow: DataRow, recNo: number): React.ReactNode[];
}
export {};
