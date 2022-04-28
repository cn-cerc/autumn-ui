import React, { ReactNode } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
declare type PropsType = {
    dataSet: DataSet;
    onNavigator?: (row: DataRow) => void;
    children?: ReactNode | undefined;
};
export default class DBNavigator extends React.Component<PropsType> {
    constructor(props: PropsType);
    render(): JSX.Element;
    onClick: (el: any) => void;
}
export {};
