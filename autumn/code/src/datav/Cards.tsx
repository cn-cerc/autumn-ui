import React from 'react'

import { Charts, DigitalFlop } from '@jiaminghi/data-view-react'

import styles from './Cards.css'

function getData() {
  return new Array(5).fill(0).map((foo, i) => ({
    title: '测试路段' + (i + i),
    total: {
      number: [randomExtend(9000, 10000)],
      content: '{nt}',
      textAlign: 'right',
      style: {
        fill: '#ea6027',
        fontWeight: 'bold',
      },
    },
    num: {
      number: [randomExtend(30, 60)],
      content: '{nt}',
      textAlign: 'right',
      style: {
        fill: '#26fcd8',
        fontWeight: 'bold',
      },
    },
    ring: {
      series: [
        {
          type: 'gauge',
          startAngle: -Math.PI / 2,
          endAngle: Math.PI * 1.5,
          arcLineWidth: 13,
          radius: '80%',
          data: [{ name: '资金占比', value: randomExtend(40, 60) }],
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          pointer: {
            show: false,
          },
          backgroundArc: {
            style: {
              stroke: '#224590',
            },
          },
          details: {
            show: true,
            formatter: '资金占比{value}%',
            style: {
              fill: '#1ed3e5',
              fontSize: 20,
            },
          },
        },
      ],
      color: ['#03d3ec'],
    },
  }))
}

function randomExtend(minNum: number, maxNum: number) {
  if (arguments.length === 1) {
    return parseInt((Math.random() * minNum + 1) + '', 10)
  } else {
    return parseInt((Math.random() * (maxNum - minNum + 1) + minNum) + '', 10)
  }
}

type stateType = {
  cards: Array<any>
}
type PropsType = {
}

export default class Cards extends React.Component<PropsType, stateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { cards: getData() }
  }
  render() {
    return (
      <div id={styles.cards} >
        {
          this.state.cards.map((card, i) => (
            <div className={styles.cardItem} key={card.title}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>{card.title}</div>
                <div className={styles.cardHeaderRight}>{'0' + (i + 1)}</div>
              </div>
              <Charts className={styles.ringCharts} option={card.ring} />
              <div className={styles.cardFooter}>
                <div className={styles.cardFooterItem}>
                  <div className={styles.footerTitle}>累计金额</div>
                  <div className={styles.footerDetail}>
                    <DigitalFlop config={card.total} style={{ width: '70%', height: '35px' }} />元
                  </div>
                </div>
                <div className={styles.cardFooterItem}>
                  <div className={styles.footerTitle}>巡查病害</div>
                  <div className={styles.footerDetail}>
                    <DigitalFlop config={card.num} style={{ width: '70%', height: '35px' }} />处
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}
