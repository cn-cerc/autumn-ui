import React, { MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
// import "./DBNavigator.css";

type PropsType = {
    dataSet: DataSet;
    onNavigator?: (row: DataRow) => void;
}

const divStyle = {
    padding: '0.25rem'
}

export default class DBNavigator extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props)
    }

    render() {
        return (
            <div style={divStyle}>
                <button id='first' onClick={this.onClick}>第一笔</button>
                <button id='prior' onClick={this.onClick}>上笔</button>
                <button id='next' onClick={this.onClick}>下笔</button>
                <button id='last' onClick={this.onClick}>最后一笔</button>
            </div>
        );
    }

    onClick = (el: any) => {
        console.log(this.props.dataSet.recNo);
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
        console.log(this.props.dataSet.recNo);
        
        let row = this.props.dataSet.current;
        if (this.props.onNavigator && row != null)
            this.props.onNavigator(row);
    }
}