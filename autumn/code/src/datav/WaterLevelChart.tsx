import React from 'react'

import { WaterLevelPond } from '@jiaminghi/data-view-react'

import styles from './WaterLevelChart.css'

const config = {
  data: [45],
  shape: 'round',
  waveHeight: 25,
  waveNum: 2,
}

export default () => {
  return (
    <div id={styles.waterLevelChart}>
      <div className={styles.waterLevelChartTitle}>计划资金累计完成情况</div>

      <div className={styles.waterLevelChartDetails}>
        累计完成<span>235,680</span>元
      </div>

      <div className={styles.chartContainer}>
        <WaterLevelPond className={styles.dvWaterPondLevel} config={config} />
      </div>
    </div>
  )
}
