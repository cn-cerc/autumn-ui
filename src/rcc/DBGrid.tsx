import React from "react";
import { DataSet } from "../Autumn-UI";

type propsType = {
    dataSource: DataSet;
    readOnly?: boolean;
}

export default class DBGrid extends React.Component<propsType> {

    constructor(props: propsType) {
        super(props)
    }

    render() {
        return (
            <div className='dbGrid'></div>
        )
    }
}

export enum ColumnType {
    th, td, span
}

type ColumnPropsType = {
    code: string;
    width: string;
    tag?: ColumnType;
}

export class Column extends React.Component<ColumnPropsType> {
    static defaultProps = {
        tag: ColumnType.td
    }

    constructor(props: ColumnPropsType) {
        super(props)
    }

    render() {
        return (
            <div className='column'></div>
        )
    }
}
