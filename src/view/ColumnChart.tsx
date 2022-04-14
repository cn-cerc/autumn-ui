import DataSet from "../db/DataSet";
import ViewConfig, { seriesName, ViewTypeProps, ViewTypeState, xColumns, xPointName } from "./ViewConfig";

type ColumnChartTypeProps = {
    horizontal?: boolean
} & Partial<ViewTypeProps>

export default class ColumnChart extends ViewConfig<ColumnChartTypeProps, ViewTypeState> {
    constructor(props: ColumnChartTypeProps) {
        super(props);
    }

    initEchart(): void {
        if (this.props.echartData.size) {
            let dataSet = new DataSet();
            dataSet.appendDataSet(this.props.echartData);
            let axis = [];
            let columns: [] = dataSet.head.getValue(xColumns);
            let names: [] = dataSet.head.getValue(seriesName);
            let series: any[] = [];
            columns.forEach((str, index) => {
                series.push({
                    name: names[index],
                    type: 'bar',
                    data: []
                })
            })
            dataSet.first();
            while (dataSet.fetch()) {
                axis.push(dataSet.getString(xPointName));
                for (let i = 0; i < columns.length; i++) {
                    series[i].data.push(dataSet.getString(columns[i]))
                }
            }
            let option = {
                // 标题
                title: [
                  {
                    text: this.props.title,
                    textStyle: {
                        color: '#fff'
                    },
                    top: '10',
                    left: '10'
                  }
                ],
                backgroundColor: '#100C2A',
                color: ['#6AACFC', '#A9DF96', '#F6868A', '#8FD5F3'],
                textStyle: {
                    color: '#fff'
                },
                // 图例
                legend: {
                    textStyle: {
                        color: '#fff'
                    },
                    top: '10',
                },
                tooltip: {},
                // 内容区域位置
                grid: {
                    left: '10',
                    right: '10',
                    bottom: '10',
                    containLabel: true
                },
                xAxis: {},
                yAxis: {},
                series: series
            }
            // 设置横向还是纵向排版
            if (this.props.horizontal)
                option.yAxis = {
                    data: axis
                };
            else {
                option.xAxis = {
                    data: axis
                }
            }
            this.state.myEchart.setOption(option)
        }
    }
}