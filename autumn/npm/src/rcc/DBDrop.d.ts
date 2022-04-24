import React from "react";
import DataRow from "../db/DataRow";
import { OnFieldChangedEvent } from "./DBEdit";
declare type PropsType = {
    dataRow?: DataRow;
    options?: Map<string, any>;
    dataName?: string;
    dataField: string;
    onChanged?: OnFieldChangedEvent;
    className?: string;
    disabled?: boolean;
};
export default class DBDrop extends React.Component<PropsType> {
    constructor(props: PropsType);
    render(): JSX.Element;
    getOptions(): any[];
    handleChange: (sender: any) => void;
}
export {};
