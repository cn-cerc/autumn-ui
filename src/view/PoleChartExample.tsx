import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { ExampleState } from "./ColumnChartExample";
import PoleChart from "./PoleChart";
import ViewApi from "./ViewApi";

export default class PoleChartExample extends React.Component<any, ExampleState> {
    constructor(props: any) {
        super(props);
        this.state = {
            echartData: new DataSet()
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let dataRow = new DataRow();
        dataRow.setValue('Project_', 'diteng-app');
        let echartData = await ViewApi.getTimoutSummary('', dataRow);
        this.setState({
            echartData
        })
    }

    render(): React.ReactNode {
        return <PoleChart echartData={this.state.echartData} id='examplePole' title='极坐标图示例' width='50%' height='600px' key={this.state.echartData.json}></PoleChart>
    }
}