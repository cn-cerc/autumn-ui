import React from 'react';
import { BorderBox11, DigitalFlop } from '@jiaminghi/data-view-react';
import DataRow from '../db/DataRow';
import styles from './TextList.css';

type stateType = {
  num: number
}

type PropsType = {
  title: string,
  date: DataRow
}

export default class TextList extends React.Component<PropsType, stateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      num: 1000
    }
    this.time();
  }
  time() {
    setInterval(() => {
      this.setState({ ...this.state, num: Math.random() * 1000 });
    }, 2000)
  }
  render() {
    return <div className={styles.main}>
      <BorderBox11 title={this.props.title}>
        <ul className={styles.content}>
          <li>
            <span>年度采购数量：</span>
            <DigitalFlop config={{
              number: [this.props.date.getDouble('purchase')],
              content: '{nt}',
              animationCurve: 'easeInQuart',
              animationFrame: 50,
              style: {
                fill: '#50CDE5',
                fontSize: 24,
                textAlign: 'left',
                translate: [-10, -10]
              }
            }} className={styles.flop} />
          </li>
          <li>
            <span>年度入库数量：</span>
            <DigitalFlop config={{
              number: [this.props.date.getDouble('storage')],
              content: '{nt}',
              animationCurve: 'easeInQuart',
              animationFrame: 50,
              style: {
                fill: '#50CDE5',
                fontSize: 24
              }
            }} className={styles.flop} />
          </li>
          <li>
            <span>当前在途数量：</span>
            <DigitalFlop config={{
              number: [this.props.date.getDouble('onOrder')],
              content: '{nt}',
              animationCurve: 'easeInQuart',
              animationFrame: 50,
              style: {
                fill: '#50CDE5',
                fontSize: 24
              }
            }} className={styles.flop} />
          </li>
          <li>
            <span>当前在库数量：</span>
            <DigitalFlop config={{
              number: [this.props.date.getDouble('inStock')],
              content: '{nt}',
              animationCurve: 'easeInQuart',
              animationFrame: 50,
              style: {
                fill: '#50CDE5',
                fontSize: 24
              }
            }} className={styles.flop} style={{ 'color': '#fff' }} />
          </li>
        </ul>
      </BorderBox11>
    </div>
  }
}
