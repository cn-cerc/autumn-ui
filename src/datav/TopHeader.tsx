import React from 'react'

import { Decoration5, Decoration8 } from '@jiaminghi/data-view-react'

import styles from './TopHeader.css'

export default class Cards extends React.Component {
  render() {
    return (
      <div id={styles.topHeader}>
        <Decoration8 className={styles.headerLeftDecoration} />
        <Decoration5 className={styles.headerCenterDecoration} />
        <Decoration8 className={styles.headerRightDecoration} reverse={true} />
        <div className={styles.centerTitle}>采购数据管理中心</div>
      </div>
    )
  }
}
