import { BorderBox9,BorderBox1,BorderBox8, Charts, FullScreenContainer } from '@jiaminghi/data-view-react';
import React, { ReactNode } from 'react';
import { Column, ColumnIt, DataRow, DataSet, DBGrid } from 'autumn-ui';
import { excelData, Excel } from '../tool/Utils';
import "../tool/Summer.css";
import styles from './FrmPurchaseChart4.css';
import TextList, { listType } from "./TextList";
import TopHeader from './TopHeader';
import ViewMenu, { ViewMenuMap } from './ViewMenu';
import * as echarts from "echarts";
import { ids } from 'webpack';
import { AuiMath } from '../tool/Summer';
import {jsPlumb} from 'jsplumb'; 
import * as D3 from 'd3';
import { plugins } from '../../webpack.dev.config';

type stateType = {
 
}
type PropsType = {
    dataSet: DataSet,
    head: DataRow,
    backHref?: string,
    backTitle?: string,
    hideIt?: boolean,
}

export default class FrmPurchaseChart3 extends React.Component<PropsType, stateType>{
    private plumIns : any = jsPlumb.getInstance();
    constructor(props: PropsType) {
        super(props);
        
        this.state = {
          
        }
    }

    async initData() {
        var tree = {};
      const data = D3.hierarchy(tree);
    }

    componentDidMount() {
        this.plumIns.ready(()=>{
            this.plumIns.connect({
                source:'item-1',
                target:['item-2','item-4'],
                anchor:['Left','Right','Top','Bottom',[0.3,0,0,-1],[0.7,0,0,-1],[0.3,1,0,1],[0.7,1,0,1]],
                connector:['StateMachine'],
                endpoint:'Blank',
                overlays:[['Arrow',{width:8,length:8,location:1}]],
                paintStyle:{stroke:'#909399',strokeWidth:2},

            })
            this.plumIns.connect({
                source:'item-1',
                target:'item-4',
                anchor:['Left','Right','Top','Bottom',[0.3,0,0,-1],[0.7,0,0,-1],[0.3,1,0,1],[0.7,1,0,1]],
                connector:['StateMachine'],
                endpoint:'Blank',
                overlays:[['Arrow',{width:8,length:8,location:1}]],
                paintStyle:{stroke:'#909399',strokeWidth:2},

            })
            this.plumIns.connect({
                source:'item-5',
                target:'item-2',
                anchor:['Left','Right','Top','Bottom',[0.3,0,0,-1],[0.7,0,0,-1],[0.3,1,0,1],[0.7,1,0,1]],
                connector:['Bezier',{curviness:60}],
                endpoint:'Blank',
                overlays:[['Arrow',{width:8,length:8,location:1}]],
                paintStyle:{stroke:'#909399',strokeWidth:2},

            })
            this.plumIns.connect({
                source:'item-6',
                target:'item-2',
                anchor:['Left','Right','Top','Bottom',[0.3,0,0,-1],[0.7,0,0,-1],[0.3,1,0,1],[0.7,1,0,1]],
                connector:['StateMachine'],
                endpoint:'Blank',
                overlays:[['Arrow',{width:8,length:8,location:1}]],
                paintStyle:{
                    stroke:'#909399',
                    strokeWidth:2,
                    // outlineWidth:10,
                    // outlineStroke:'transparent'
                },

            })
            this.plumIns.connect({
                source:'item-1',
                target:'item-3',
                anchor:['Top',[0.3,0,0,-1],[0.7,0,0,-1],[0.3,1,0,1],[0.7,1,0,1]],
                connector:['StateMachine'],
                endpoint:'Blank',
                overlays:[['Arrow',{width:8,length:8,location:1}]],
                paintStyle:{stroke:'#909399',strokeWidth:2},

            })
        })
    }

    componentWillUnmount() {
    }

    render(): JSX.Element {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='采购数据管理中心' />
                    {/* <TopHeader title='采购数据管理中心' handleCick={this.titleClick.bind(this)} /> */}
                    <div className={styles.mainContent}>
                        <div id={styles.wrapper}>
                            <div className={styles.lineWrap} style={{'marginLeft':'70px'}}>
                                <div id="item-1" className={styles.stateItem}>State 1</div>
                                <div id="item-2" className={styles.stateItem}>State 2</div>
                                <div id="item-3" className={styles.stateItem}>State 3</div>
                            </div>
                            <div className={styles.lineWrap}>
                                <div id="item-4" className={styles.stateItem}>State 4</div>
                                <div id="item-5" className={styles.stateItem}>State 5</div>
                                <div id="item-6" className={styles.stateItem}>State 6</div>
                                <div id="item-7" className={styles.stateItem}>State 7</div>
                            </div>
                            <div className={styles.lineWrap} style={{'marginLeft':'215px'}}>
                                <div id="item-8" className={styles.stateItem}>State 8</div>
                                <div id="item-9" className={styles.stateItem}>State 9</div>
                            </div>
                        </div>
                    </div>
                </FullScreenContainer>
            </div>
        )
    }
}