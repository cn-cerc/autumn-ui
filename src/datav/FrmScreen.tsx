import React from "react";
import { FullScreenContainer } from '@jiaminghi/data-view-react'
import TopHeader from './TopHeader'
import DigitalFlop from './DigitalFlop'
import RankingBoard from './RankingBoard'
import RoseChart from './RoseChart'
import WaterLevelChart from './WaterLevelChart'
import ScrollBoard from './ScrollBoard'
import Cards from "./Cards"
import styles from './FrmScreen.css'
type stateType = {
}
type PropsType = {
}

export default class FrmScreen extends React.Component<PropsType, stateType> {
    constructor(props: PropsType) {
        super(props);
    }

    render() {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='采购数据管理中心' />
                    <div className={styles.mainContent}>
                        <DigitalFlop />
                        <div className={styles.blockLeftRightContent}>
                            <RankingBoard />
                            <div className={styles.blockTopBottomContent}>
                                <div className={styles.blockTopContent}>
                                    <RoseChart />
                                    <WaterLevelChart />
                                    <ScrollBoard />
                                </div>
                                <Cards />
                            </div>
                        </div>
                    </div>
                </FullScreenContainer>
            </div>
        )
    }
}
