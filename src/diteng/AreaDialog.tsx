import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogStateType } from "../rcc/BaseDialog";
import DBEdit from "../rcc/DBEdit";
import SearchPanel from "../rcc/SearchPanel";
import styles from "./BaseAreaDialog.css";
import DialogApi from './DialogApi';
import { showMsg } from "./Summer";

type BaseAreaProps = {
    status: number,
    inputId: string,
    baseArea: string,
} & Partial<BaseDialogStateType>

type BaseAreaState = {
    dataIn: DataRow,
    areaData1: DataSet,
    areaData2: DataSet,
    areaData3: DataSet,
    areaList: DataSet,
    area1: string,
    area2: string,
    area3: string,
} & Partial<BaseDialogStateType>

export default class AreaDialog extends BaseDialog<BaseAreaProps, BaseAreaState> {
    constructor(props: BaseAreaProps) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('Status_', this.props.status);
        this.state = {
            ...this.state,
            areaData1: new DataSet(),
            areaData2: new DataSet(),
            areaData3: new DataSet(),
            areaList: new DataSet(),
            dataIn,
            area1: 'Area1',
            width: '50rem',
        }
        this.setTitle('请选择地址')
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let areaData1 = await DialogApi.getCusArea(new DataRow())
        if (areaData1.state <= 0) {
            showMsg(areaData1.message);
        } else {
            this.setState({
                ...this.state,
                areaData1,
                areaList: new DataSet(),
            })
        }
        if (this.props.baseArea) {
            let areaArr = this.props.baseArea.split('/');
            if (areaArr[0])
                await this.handleArea1(areaArr[0]);
            if (areaArr[1])
                await this.handleArea2(areaArr[1]);
            if (areaArr[2]) {
                this.state.area3 = areaArr[2]
                this.setState({
                    ...this.state,
                })
            }
        }
    }

    content() {
        return (
            <div className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.search.bind(this)}>
                    <DBEdit dataName='查询条件' dataField='SearchText_'></DBEdit>
                </SearchPanel>
                <div className={styles.content}>
                    <Cascade dataSet={this.state.areaList} filed='Area_' handleClick={this.handleAreaList.bind(this)} defaultVal={this.state.area1} />
                    <Cascade dataSet={this.state.areaData1} filed='Area1_' handleClick={this.handleArea1.bind(this)} defaultVal={this.state.area1} />
                    <Cascade title='请选择' dataSet={this.state.areaData2} filed='Area2_' handleClick={this.handleArea2.bind(this)} defaultVal={this.state.area2} />
                    <Cascade title='请选择' dataSet={this.state.areaData3} filed='Area3_' handleClick={this.handleArea3.bind(this)} defaultVal={this.state.area3} />
                </div>
                <div className={styles.submit} onClick={this.handleSubmit.bind(this)}>确认</div>
            </div>
        )
    }
    async search(): Promise<void> {
        this.setLoad(true)
        try {
            if (!this.state.dataIn.getValue('SearchText_')) {
                if (this.state.areaList.size == 0)
                    showMsg('请输入查询条件');
                else {
                    this.init()
                }
                return;
            }
            let areaList = await DialogApi.getSearchCusArea(this.state.dataIn)
            if (areaList.state <= 0) {
                showMsg(areaList.message);
            } else {
                this.state.area1 = '';
                this.state.area2 = '';
                this.state.area3 = '';
                this.setState({
                    ...this.state,
                    areaList,
                    areaData1: new DataSet(),
                    areaData2: new DataSet(),
                    areaData3: new DataSet(),
                })
            }
        } finally {
            this.setLoad(false)
        }
    }

    async handleAreaList(area: string): Promise<void> {
        this.state.area1 = area;
        this.state.area2 = '';
        this.state.area3 = '';
        this.setState({
            ...this.state,
        }, () => {
            this.handleSubmit()
        })
    }

    async handleArea1(area: string): Promise<void> {
        this.state.area1 = area;
        this.state.area2 = '';
        this.state.area3 = '';
        let dataIn = new DataRow();
        dataIn.setValue('Area1_', this.state.area1);
        dataIn.setValue('Area2_', this.state.area2);
        dataIn.setValue('Area3_', this.state.area3);
        let areaData2 = await DialogApi.getCusArea(dataIn)
        this.setState({
            ...this.state,
            areaData2,
            areaData3: new DataSet(),
        })
    }
    async handleArea2(area: string): Promise<void> {
        if (!area) return
        this.state.area2 = area;
        this.state.area3 = '';
        let dataIn = new DataRow();
        dataIn.setValue('Area1_', this.state.area1);
        dataIn.setValue('Area2_', this.state.area2);
        dataIn.setValue('Area3_', this.state.area3);
        let areaData3 = await DialogApi.getCusArea(dataIn)
        this.setState({
            ...this.state,
            areaData3,
        })
    }
    async handleArea3(area: string): Promise<void> {
        if (!area) return
        this.state.area3 = area;
        this.setState({
            ...this.state,
            area3: area,
        }, () => {
            this.handleSubmit()
        })
    }

    handleSubmit() {
        let val: string = this.state.area1;
        if (this.state.area2)
            val += `/${this.state.area2}`
        if (this.state.area3)
            val += `/${this.state.area3}`
        let areaInput = document.getElementById(this.props.inputId) as HTMLInputElement;
        areaInput.value = val;
        this.handleClose();
    }
}

type CascadeTypeProps = {
    dataSet: DataSet,
    title?: string,
    filed: string,
    handleClick: Function,
    defaultVal: string
}

class Cascade extends React.Component<CascadeTypeProps>{
    constructor(props: CascadeTypeProps) {
        super(props);
    }
    render() {
        return (
            <ul className={this.props.dataSet.size == 0 ? styles.hidePartClass : styles.caseCard} >
                {
                    this.props.title ? <li onClick={() => this.props.handleClick('')} className={'' == this.props.defaultVal ? styles.selected : ''}>{this.props.title}</li> : ''
                }
                {
                    this.props.dataSet.records.map((row: DataRow, index: number) => {
                        let name = row.getString(this.props.filed);
                        return (
                            <li key={index} onClick={() => this.props.handleClick(name)}
                                className={name == this.props.defaultVal ? styles.selected : ''}>
                                {name}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}