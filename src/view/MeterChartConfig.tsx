import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { ExampleState } from "./ColumnChartExample";
import MeterChart from "./MeterChart";
import ViewApi from "./ViewApi";

export default class MeterChartExample extends React.Component<any, ExampleState> {
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
        return <MeterChart echartData={this.state.echartData} id='exampleMeter' title='仪表盘示例' width='50%' height='600px' key={this.state.echartData.json} chartTitle='码速'></MeterChart>
    }
}