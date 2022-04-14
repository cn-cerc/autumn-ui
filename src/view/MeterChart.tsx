import DataSet from "../db/DataSet";
import ViewConfig, { ViewTypeProps } from "./ViewConfig";

type MeterChartTypeProps = {
    chartTitle?: string
} & Partial<ViewTypeProps>

export default class MeterChart extends ViewConfig<MeterChartTypeProps> {
    constructor(props: MeterChartTypeProps) {
        super(props);
    }

    initEchart(): void {
        let dataSet = new DataSet();
        dataSet.appendDataSet(this.props.echartData);
        dataSet.first();
        
        //@ts-ignore
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
            // 内容区域位置
            grid: {
                left: '10',
                right: '10',
                bottom: '10',
                containLabel: true
            },
            tooltip: {
                formatter: '{a} <br/>{b} : {c}%'
            },
            series: [
                {
                    name: this.props.chartTitle,
                    type: 'gauge',
                    progress: {
                        show: true
                    },
                    detail: {
                        //@ts-ignore
                        valueAnimation: true,
                        formatter: '{value}',
                        color: '#fff'
                    },
                    data: [
                        {
                            value: 50,
                            detail: {
                                color: '#fff'
                            },
                            name: 'SCORE',
                        }
                    ],
                    fontStyle: {
                        color: '#fff'
                    }
                }
            ],
            axisLabel: {
                fontStyle: {
                    color: '#fff'
                }
            }
        })
    }
}