import React, { MouseEventHandler } from "react";
import DataRow from "../src/db/DataRow";
import DataSet from "../src/db/DataSet";
// import "./DBNavigator.css";

type PropsType = {
    dataSet: DataSet;
    onNavigator?: (row: DataRow) => void;
}

export default class DBNavigator extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props)
    }

    render() {
        return (
            <div className='DBNavigator'>
                <button id='first' onClick={this.onClick}>第一笔</button>
                <button id='prior' onClick={this.onClick}>上笔</button>
                <button id='next' onClick={this.onClick}>下笔</button>
                <button id='last' onClick={this.onClick}>最后一笔</button>
            </div>
        );
    }

    onClick = (el: any) => {
        switch (el.target.id) {
            case 'first':
                this.props.dataSet.first();
                break;
            case 'prior':
                this.props.dataSet.prior();
                break;
            case 'next':
                this.props.dataSet.next();
                break;
            case 'last':
                this.props.dataSet.last();
                break;
            default:
                alert('error');
        }
        let row = this.props.dataSet.getCurrent();
        if (this.props.onNavigator && row != null)
            this.props.onNavigator(row);
    }
}