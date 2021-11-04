import { extend } from "jquery";
import React from "react";
import DataSet from "../db/DataSet";
import Control from "./Control";

type propsType = {
    dataSource: DataSet;
    readOnly?: boolean;
}

export default class DBBlock extends Control<propsType> {

    render() {
        return (
            <div className='DBBlock'>
                {React.Children.map(this.props.children, child => child)}
            </div>
        )
    }
}

export class Line extends Control {
    render() {
        return (
            <div>
                {React.Children.map(this.props.children, child => child)}
            </div>
        )
    }
}