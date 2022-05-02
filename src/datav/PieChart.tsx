import React from 'react';
import DataRow from '../db/DataRow';
import styles from './PieChart.css';
import * as echarts from "echarts";

type PropsType = {
  eleId: string
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
    // this.timer = setInterval(() => {
    //   this.initData()
    // }, 30000);
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
    let pieOption: Object = {
      legend: {
        data: [
          '一区',
          '二区',
          '三区',
          '四区',
          '五区',
          '六区',
        ],
        textStyle: {
          fontSize: 12,
          color: '#fff'
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '40%'],
          center:['50%', '55%'],
          label: {
            position: 'inner',
            formatter: '{c}',
            fontSize: 14
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 4825, name: '一区' },
            { value: 4720, name: '二区' },
            { value: 4800, name: '三区' },
            { value: 4768, name: '四区' },
            { value: 4620, name: '五区' },
            { value: 4835, name: '六区' }
          ]
        },
        {
          name: "per",
          type: 'pie',
          radius: ['45%', '80%'],
          center:['50%', '55%'],
          labelLine: {
            length: 30
          },
          label: {
            position: 'inner',
            // formatter: '{b}：{d}%',
            formatter: '{d}%',
          },
          data: [
            { value: 482500, name: '一区' },
            { value: 377600, name: '二区' },
            { value: 120000, name: '三区' },
            { value: 534016, name: '四区' },
            { value: 831600, name: '五区' },
            { value: 241750, name: '六区' },
          ],
        }
      ]
    }

    let myChart = echarts.init(document.getElementById(this.props.eleId));
    myChart.setOption(pieOption);
  }
}
