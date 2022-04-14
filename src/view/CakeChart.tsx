import DataSet from "../db/DataSet";
import ViewConfig, { seriesName, ViewTypeProps, xColumns, xPointName } from "./ViewConfig";

export default class CakeChart extends ViewConfig {
    constructor(props: ViewTypeProps) {
        super(props);
    }

    initEchart(): void {
        if (this.props.echartData.size) {
            let dataSet = new DataSet();
            dataSet.appendDataSet(this.props.echartData);
            let columns: [] = dataSet.head.getValue(xColumns);
            let names: [] = dataSet.head.getValue(seriesName);
            let series: any[] = [];
            columns.forEach((str, index) => {
                series.push({
                    name: names[index],
                    type: 'pie',
                    radius: '50%',
                    data: []
                })
            })
            dataSet.first();
            while (dataSet.fetch()) {
                for (let i = 0; i < columns.length; i++) {
                    series[i].data.push({
                        value: dataSet.getString(columns[i]),
                        name: dataSet.getString(xPointName)
                    })
                }
            }
            this.state.myEchart.setOption({
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
                    color: '#ffffff'
                },
                // 图例
                legend: {
                    orient: 'horizontal',
                    left: 'center',
                    width: '30%',
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
            });
        }
    }
}