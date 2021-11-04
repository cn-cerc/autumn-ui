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

type ColumnPropsType = {
    code: string;
}

export class Column extends React.Component<ColumnPropsType> {

    constructor(props: ColumnPropsType) {
        super(props)
    }

    render() {
        return (
            <div className='column'></div>
        )
    }
}
