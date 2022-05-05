import React from 'react'

import { BorderBox11 } from '@jiaminghi/data-view-react'
import DataRow from '../db/DataRow'
import styles from './TextList.css'
type stateType = {

}
type PropsType = {
  title: string,
  date: DataRow
}
export default class Polyline extends React.Component<PropsType, stateType> {
  constructor(props: PropsType) {
    super(props);
  }
  render() {
    return (
      <BorderBox11 title={this.props.title}>
        <ul className={styles.content}>
          <li>年度采购数量：{this.props.date.getString('purchase')}</li>
          <li>年度入库数量：{this.props.date.getString('storage')}</li>
          <li>当前在途数量：{this.props.date.getString('onOrder')}</li>
          <li>当前在库数量：{this.props.date.getString('inStock')}</li>
        </ul>
      </BorderBox11>
    )
  }
}
