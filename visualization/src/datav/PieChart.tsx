import * as echarts from "echarts";
import React from 'react';
import styles from './PieChart.css';

type PropsType = {
  eleId: string,
  pieTitle: string,
  price: number[],
  saleroom: number[],
  lineColor?:string[]
}
type stateType = {
  width: string,
  height: string,
}

export default class PieChart extends React.Component<PropsType, stateType> {
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
    return <div className={styles.main} id={this.props.eleId} >

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
    let seriesData2: any[] = [];
    legendArray.forEach((value, index) => {
      seriesData1.push({ value: this.props.price[index], name: value });
      seriesData2.push({ value: this.props.saleroom[index], name: value });
    })
    let pieOption: Object = {
      title: {
        text: this.props.pieTitle,
        left: 'center',
        textStyle: {
          fontSize: 16,
          color: '#fff'
        },
      },
      legend: {
        data: legendArray,
        textStyle: {
          fontSize: 12,
          color: '#fff'
        },
        bottom: 30,
        itemWidth: 14
      },
      series: [
        {
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '40%'],
          center: ['50%', '45%'],
          label: {
            position: 'inner',
            formatter: '{c}',
            fontSize: 14,
            color: '#fff'
          },
          labelLine: {
            show: false
          },
          data: seriesData1
        },
        {
          name: "per",
          type: 'pie',
          radius: ['41%', '55%'],
          center: ['50%', '45%'],
          label: {
            formatter: '{d}%',
            color:'#fff'
          },
          data: seriesData2,
        }
      ]
    }
    if (this.props.lineColor) {
      //@ts-ignore
      pieOption['color'] = this.props.lineColor;
    }
    let chart = document.getElementById(this.props.eleId) as HTMLDivElement;
    let myChart = echarts.init(chart);
    myChart.setOption(pieOption);
  }
}
