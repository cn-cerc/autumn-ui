import React from "react";
import DataSet from "../src/db/DataSet";
// import "./DBNavigator.css";

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
                <button id='first'>第一笔</button>
                <button id='prior'>上笔</button>
                <button id='next'>下笔</button>
                <button id='last'>最后一笔</button>
            </div>
        );
    }
}