import DataSet from "../db/DataSet";
import ViewConfig, { ViewTypeProps } from "./ViewConfig";

export default class PoleChart extends ViewConfig {
    constructor(props: ViewTypeProps) {
        super(props);
    }
    
    initEchart(): void {
        let dataSet = new DataSet();
        dataSet.appendDataSet(this.props.echartData);
        let names = [];
        let datas = [];
        let max = 0;
        dataSet.first();
        while (dataSet.fetch()) {
            names.push(dataSet.getString('Date_').slice(-5));
            let number = dataSet.getDouble('Timer3_') || 0;
            if(number > max)
                max = number
            datas.push(dataSet.getString('Timer3_') || 0)
        }
        this.state.myEchart.setOption({
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
            polar: {
                radius: [10, '80%']
            },
            backgroundColor: '#100C2A',
            color: ['#6AACFC', '#A9DF96', '#F6868A', '#8FD5F3'],
            textStyle: {
                color: '#fff'
            },
            angleAxis: {
                max: max, // 最大值
                startAngle: 90 // 起始位置的角度值
            },
            radiusAxis: {
                type: 'category',
                data: names
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'horizontal',
                left: 'center',
                width: '30%'
            },
            series: [
                {
                    type: 'bar',
                    data: datas,
                    coordinateSystem: 'polar',
                    label: {
                        show: true,
                        position: 'middle',
                        formatter: '{b}: {c}'
                    },
                }
            ]
        })
    }
}