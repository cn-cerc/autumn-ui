import React from "react";
import DataSet from "../src/db/DataSet";
import "./DBNavigator.css";

type PropsType = {
    dataSet: DataSet;
}

export default class DBNavigator extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props)
    }

    render(){
        return (
            <div className='DBNavigator'>
                <button id='first'/>
                <button id='prior'/>
                <button id='next'/>
                <button id='last'/>
            </div>
        );
    }
}