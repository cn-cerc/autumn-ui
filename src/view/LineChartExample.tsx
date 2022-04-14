import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { ExampleState } from "./ColumnChartExample";
import LineChart from "./LineChart";
import ViewApi from "./ViewApi";
import { seriesName, xColumns, xPointName } from "./ViewConfig";

export default class LineChartExample extends React.Component<any, ExampleState> {
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
        echartData.first();
        echartData.head.setValue(xColumns, ['Timer3_', 'Timer6_', 'Timer9_']);
        echartData.head.setValue(seriesName, ['1≤v<3', '3≤v<6', '6≤v<9']);
        while (echartData.fetch()) {
            echartData.setValue(xPointName, echartData.getString('Date_').slice(-5));
        }
        this.setState({
            echartData
        })
    }

    render(): React.ReactNode {
        return <LineChart echartData={this.state.echartData} id='exampleLine' title='折线图示例' width='50%' height='600px' key={this.state.echartData.json}></LineChart>
    }
}