import React from "react";
import { ColumnIt, DataSet, DBGrid } from "hhctest";
import { Column } from "hhctest/src/rcc/DBGrid";
import 'hhctest/assets/autumn-ui.css'
import styles from './ceshi.css';

type CeshiTypeProps = {

}

type CeshiTypeState = {
    dataSet: DataSet
}

export default class Ceshi extends React.Component<CeshiTypeProps, CeshiTypeState> {
    constructor(props: CeshiTypeProps) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('A1', '张三').setValue('A2', '男').setValue('A3', 18);
        dataSet.append().setValue('A1', '李四').setValue('A2', '女').setValue('A3', 22);
        dataSet.append().setValue('A1', '王五').setValue('A2', '男').setValue('A3', 25);
        this.state = {
            dataSet
        }
    }
    render(): React.ReactNode {
        return <React.Fragment>
            <DBGrid dataSet={this.state.dataSet}>
                <ColumnIt></ColumnIt>
                <Column code='A1' width='10' name='姓名'></Column>
                <Column code='A2' width='10' name='性别'></Column>
                <Column code='A3' width='10' name='年龄'></Column>
            </DBGrid>
            <div className={styles.box}></div>
        </React.Fragment>
    }
}