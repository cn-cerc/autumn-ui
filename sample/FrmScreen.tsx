import React from "react";
import { FullScreenContainer } from '@jiaminghi/data-view-react'
import TopHeader from '../src/datav/TopHeader'
import DigitalFlop from '../src/datav/DigitalFlop'
import RankingBoard from '../src/datav/RankingBoard'
import RoseChart from '../src/datav/RoseChart'
import WaterLevelChart from '../src/datav/WaterLevelChart'
import ScrollBoard from '../src/datav/ScrollBoard'
import Cards from "../src/datav/Cards";
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
            <div id="data-view">
                <FullScreenContainer>
                    {/* <TopHeader />

                    <div className="main-content">
                        <DigitalFlop />

                        <div className="block-left-right-content">
                            <RankingBoard />

                            <div className="block-top-bottom-content">
                                <div className="block-top-content">
                                    <RoseChart />

                                    <WaterLevelChart />

                                    <ScrollBoard />
                                </div>

                                <Cards />
                            </div>
                        </div>
                    </div> */}
                    <Cards />
                </FullScreenContainer>
            </div>
        )
    }
}
