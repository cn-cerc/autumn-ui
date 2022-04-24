import React, { MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import DataSource from "../db/DataSource";
export declare type OnSelectDataSetEvent = (values: DataSet) => void;
declare type DialogFormProps = {
    title: string;
    style?: object;
    dataSource?: DataSource;
    onSelect?: OnSelectDataSetEvent;
    active: () => boolean;
    setActive: (active: boolean) => void;
};
declare type stateType = {
    active: () => boolean;
    move: any;
    site: {
        x: number;
        y: number;
    };
};
export declare class DialogForm extends React.Component<DialogFormProps, stateType> {
    constructor(props: DialogFormProps);
    render(): JSX.Element;
    componentDidMount(): void;
    onSelect: (values: DataRow) => void;
    btnShow: any;
    btnClose: any;
    handleMouseDown: MouseEventHandler<HTMLDivElement>;
    handleMouseMove: any;
    handleMouseUp: any;
    getStyle(): any;
}
export {};
