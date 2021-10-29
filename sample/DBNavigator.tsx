import React from "react";
import DataSet from "../src/db/DataSet";

type PropsType = {
    dataSet: DataSet;
}

export default class DBNavigator extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props)
    }

    render(){
        return (
            <div>
                <button id='first'/>
                <button id='prior'/>
                <button id='next'/>
                <button id='last'/>
            </div>
        );
    }
}