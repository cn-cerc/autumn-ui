import React from 'react'

import { BorderBox11, DigitalFlop } from '@jiaminghi/data-view-react'
import DataRow from '../db/DataRow'
import styles from './TextList.css'
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
    return (
      <BorderBox11 title={this.props.title}>
        <ul className={styles.content}>
          <li>年度采购数量：{this.props.date.getString('purchase')}</li>
          <li>年度入库数量：{this.props.date.getString('storage')}</li>
          <li>当前在途数量：{this.props.date.getString('onOrder')}</li>
          <li>当前在库数量：{this.props.date.getString('inStock')}</li>
          <li>当前在库数量：
            <DigitalFlop config={{
              number: [this.state.num],
              content: '{nt}',
              animationCurve: 'easeInQuart',
              animationFrame: 50
            }} style={{ width: '200px', height: '50px' }} />
          </li>
        </ul>
      </BorderBox11>
    )
  }
}
