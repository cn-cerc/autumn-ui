import * as echarts from "echarts";
import React from 'react';
import { AuiMath } from "../tool/Summer";

type PropsType = {
    eleId: string,
    pieTitle: string,
    price: number[],
    saleroom: number[],
    lineColor?: string[]
}
type stateType = {
    width: string,
    height: string,
}

export default class RadarChart extends React.Component<PropsType, stateType> {
    private timer: any = null;
    constructor(props: PropsType) {
        super(props);
        this.state = {
            width: '10rem',
            height: '10rem'
        }
    }

    componentDidMount(): void {
        this.initData();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return <div id={this.props.eleId} style={{ 'width': '100%', 'height': '100%' }}>

        </div>
    }

    initData() {
        this.initPieChart()
    }

    initPieChart() {
        if (this.props.price.length == 0)
            return
        let legendArray = ['一区', '二区', '三区', '四区', '五区', '六区'];
        let seriesData1: any[] = [];
        let seriesData_1: any[] = [];
        let seriesData2: any[] = [];
        let seriesData_2: any[] = [];
        let series1Max = 0;
        let series2Max = 0;
        let series1Sum = 0;
        let series2Sum = 0;
        legendArray.forEach((value, index) => {
            let data1 = this.props.price[index];
            let data2 = this.props.saleroom[index];
            series1Sum += data1;
            series2Sum += data2;
            seriesData1.push(data1);
            seriesData2.push(data2);
        })
        let math = new AuiMath();
        for (let i = 0; i < seriesData1.length; i++) {
            let data1 = math.toFixed(seriesData1[i] / series1Sum * 100, 2);
            let data2 = math.toFixed(seriesData2[i] / series2Sum * 100, 2);
            if (data1 > series1Max)
                series1Max = data1;
            if (data2 > series2Max)
                series2Max = data2;
            seriesData_1.push(data1)
            seriesData_2.push(data2)
        }
        let max = series1Max > series2Max ? series1Max + 5 : series2Max + 5;
        console.log(seriesData1)
        console.log(seriesData2)
        console.log(seriesData_1)
        console.log(seriesData_2)
        console.log(max)
        let radarOption: Object = {
            title: {
                text: this.props.pieTitle
            },
            legend: {

            },
            color: this.props.lineColor,
            radar: {
                // shape: 'circle',
                indicator: [
                    { name: '一区', max: max },
                    { name: '二区', max: max },
                    { name: '三区', max: max },
                    { name: '四区', max: max },
                    { name: '五区', max: max },
                    { name: '六区', max: max }
                ],
                radius: '60%'
            },
            series: [
                {
                    name: 'Budget vs spending',
                    type: 'radar',
                    data: [
                        {
                            value: seriesData_1,
                            name: '销售单价',
                            symbolSize: 6,
                            itemStyle: {
                                color: '#58BD72',
                            },
                            lineStyle: {
                                color: '#58BD72'
                            },
                            tooltip: {
                                formatter: function (params: any) {
                                    console.log(params);
                                    let str = '';
                                    legendArray.forEach((title, index) => {
                                        str += `${title}:${seriesData_1[index]}`
                                        if (index < legendArray.length - 1)
                                            str += `<br/>`
                                    })
                                    return `${params.name}：<br/>${str}<br/>`
                                }
                            }
                        },
                        {
                            value: seriesData_2,
                            name: '销售占比',
                            areaStyle: {
                                color: '#88C0ED'
                            }
                        }
                    ]
                }
            ],
            tooltip: {}
        }
        // if (this.props.lineColor) {
        //     //@ts-ignore
        //     pieOption['color'] = this.props.lineColor;
        // }
        let chart = document.getElementById(this.props.eleId) as HTMLDivElement;
        let myChart = echarts.init(chart);
        myChart.setOption(radarOption);
    }
}
