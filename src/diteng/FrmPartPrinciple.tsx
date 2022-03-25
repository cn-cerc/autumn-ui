import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { ColumnIt } from "../rcc/ColumnIt";
import DBGrid, { Column } from "../rcc/DBGrid";
import DialogApi from "./DialogApi";
import styles from "./FrmPartPrinciple.css";

type titleType = {
    text: string,
    data?: any
}

type FrmPartPrincipleTypeProps = {

}

type FrmPartPrincipleTypeState = {
    titleList: titleType[],
    titleIn: number,
    dataSet1: DataSet,
    dataSet2: DataSet,
    dataSet3: DataSet
}

export default class FrmPartPrinciple extends React.Component<FrmPartPrincipleTypeProps, FrmPartPrincipleTypeState> {
    constructor(props: FrmPartPrincipleTypeProps) {
        super(props);
        this.state = {
            titleList: [{
                text: '大类'
            }],
            titleIn: 0,
            dataSet1: new DataSet(),
            dataSet2: new DataSet(),
            dataSet3: new DataSet()
        }
    }

    componentWillMount() {
        this.init();
    }

    render(): React.ReactNode {
        return <React.Fragment>
            <div className={styles.stock1}>
                {this.getPageTitle()}
                {this.getTable()}
                <div></div>
            </div>
            <div className={styles.stock2}>这是第二块内容</div>
        </React.Fragment>
    }

    async init() {
        let dataSet1 = await DialogApi.getCodeClass();
        this.setState({
            dataSet1
        })
    }

    getPageTitle() {
        let titleList = this.state.titleList.map((title: titleType, key: number) => {
            return <li key={key} className={key == this.state.titleIn ? styles.titleIn : ''} onClick={() => this.setState({ titleIn: key })}>{title.text}</li>
        })
        return <ul>{titleList}</ul>
    }

    getTable() {
        switch (this.state.titleIn) {
            case 0:
                return <DBGrid dataSet={this.state.dataSet1} key={this.state.dataSet1.json}>
                    <ColumnIt></ColumnIt>
                    <Column code='Code_' name='大类代码' width='10'></Column>
                    <Column code='Name_' name='名称' width='20'></Column>
                    <Column code='opera' name='操作' textAlign='center' width='10' customText={(row: DataRow) => {
                        return <span className={styles.link} onClick={this.selectClass.bind(this, row)}>选择</span>
                    }}></Column>
                </DBGrid>
            case 1:
                return <DBGrid dataSet={this.state.dataSet2} key={this.state.dataSet2.json}>
                    <ColumnIt width='10'></ColumnIt>
                    <Column code='ClassCode_' name='大类代码' width='20'></Column>
                    <Column code='Code_' name='类别代码' width='20'></Column>
                    <Column code='Name_' name='类别名称' width='20'></Column>
                    <Column code='Rule_' name='编码规格' width='30'></Column>
                    <Column code='CodeDesc_' name='编码描述' width='40'></Column>
                    <Column code='opera' name='操作' textAlign='center' width='15' customText={(row: DataRow) => {
                        return <span className={styles.link} onClick={this.selectClass2.bind(this, row)}>选择</span>
                    }}></Column>
                </DBGrid>
            default:
                return <DBGrid dataSet={this.state.dataSet3}>
                    <ColumnIt width='10'></ColumnIt>
                    <Column code='Name_' name='代码' width='20'></Column>
                    <Column code='Rule_' name='描述' width='30'></Column>
                    <Column code='CodeDesc_' name='备注' width='40'></Column>
                    <Column code='opera' name='操作' textAlign='center' width='15' customText={(row: DataRow) => {
                        return <span className={styles.link} onClick={this.selectClass3.bind(this, row)}>选择</span>
                    }}></Column>
                </DBGrid>
        }
    }

    async selectClass(row: DataRow) {
        let dataRow = new DataRow();
        dataRow.setValue('ClassCode_', row.getValue('Code_'))
        let dataSet2 = await DialogApi.getPartPrincipleSearch(dataRow);
        this.setState({
            titleList: [{
                text: '大类'
            }, {
                text: '中类'
            }],
            titleIn: 1,
            dataSet2
        });
    }

    async selectClass2(row: DataRow) {
        let dataRow = new DataRow();
        dataRow.setValue('Code_', row.getValue('Code_'));
        let dataOut = await DialogApi.getPartPrincipleDownload(dataRow);
        let titleList: titleType[] = [{
            text: '大类'
        }, {
            text: '中类'
        }];
        let dataSet3: DataSet;
        let isFirst = false;
        console.log(dataOut)
        dataOut.first();
        while (dataOut.fetch()) {
            if (dataOut.getDouble('Type_') == 0) {
                titleList.push({
                    text: dataOut.getString('SpecName_'),
                    data: dataOut.current
                })
                if(!isFirst) {
                    isFirst = true;
                    let dataIn = new DataRow();
                    dataIn.setValue('Code_', encodeURIComponent(dataOut.getString('SpecCode_')));
                    dataIn.setValue('Select', encodeURIComponent(dataOut.getString('SpecName_')));
                    dataIn.setValue('specCode', encodeURIComponent(dataOut.getString('SpecCode_')));
                    console.log(dataIn)
                    dataSet3 = await DialogApi.getPartPrincipleDownload(dataIn);
                }
            }
        }
        console.log(dataSet3)
        this.setState({
            titleList,
            titleIn: 2,
            dataSet3
        })
    }

    async selectClass3(row: DataRow) {
        let dataRow = new DataRow();
        dataRow.setValue('Code_', row.getValue('Code_'));
    }
}