import React from "react";
import "../tool/Summer.css";
import { Excel, excelData } from '../tool/Utils';
import styles from './FrmPurchaseChart2.css';
type stateType = {
    arr: number[]
}
type PropsType = {
    name?: string,
    age: string | number
}

export default class FrmPurchaseChart2 extends React.Component<PropsType, stateType> {
    private timer: any = null;
    constructor(props: PropsType) {
        super(props);
        this.state = {
            arr: [1, 2, 3, 4, 5]
        }
    }

    componentDidMount(): void {
        this.initData();
        this.timer = setInterval(() => {
            this.initData()
        }, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    getRandom(num: number) {
        return Math.floor(Math.random() * num);
    }

    async initData() {
        let dataList: excelData[] = [];
        await fetch('./kanban1.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            console.log(data)
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
            console.log(dataList)
        })

    }

    render(): JSX.Element {
        return (
            <React.Fragment>
                <div className={styles.dataView}>
                    {/* <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='采购数据管理中心' />
                    <div className={styles.mainContent}>
                        <div className={styles.block1}></div>
                        <div className={styles.block2}></div>
                        <div className={styles.block3}></div>
                        <div className={styles.block4}></div>
                    </div>
                </FullScreenContainer> */}
                    {this.getList()}
                </div>
                <div></div>
            </React.Fragment>
        )
    }

    getList() {
        let list = this.state.arr.map((data: number, index: number) => {
            return <li key={index} onClick={this.handleClick.bind(this, index)}>{data}</li>
        })
        return <ul>{list}</ul>
    }

    handleClick(num: number) {
        console.log(num)
    }
}
