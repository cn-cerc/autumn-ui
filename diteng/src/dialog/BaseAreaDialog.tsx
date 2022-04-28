import React from "react";
import styles from "./BaseAreaDialog.css";
import DialogApi from './DialogApi';
import { showMsg } from "../tool/Summer";
import { BaseDialogStateType, DataRow, DataSet, BaseDialog } from "autumn-ui";

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
    areaData4: DataSet,
    area1: string,
    area2: string,
    area3: string,
    area4: string,
} & Partial<BaseDialogStateType>

export default class BaseAreaDialog extends BaseDialog<BaseAreaProps, BaseAreaState> {
    constructor(props: BaseAreaProps) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('Status_', this.props.status);
        this.state = {
            ...this.state,
            areaData1: new DataSet(),
            areaData2: new DataSet(),
            areaData3: new DataSet(),
            areaData4: new DataSet(),
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
            })
        }
        if (this.props.baseArea) {
            let areaArr = this.props.baseArea.split('->');
            if (areaArr[0])
                await this.handleArea1(areaArr[0]);
            if (areaArr[1])
                await this.handleArea2(areaArr[1]);
            if (areaArr[2])
                await this.handleArea3(areaArr[2]);
            if (areaArr[3]) {
                this.state.area4 = areaArr[3]
                this.setState({
                    ...this.state,
                })
            }
        }
    }

    content() {
        return (
            <div className={styles.main}>
                <div className={styles.content}>
                    <Cascade title='请选择' dataSet={this.state.areaData1} filed='Area1_' handleClick={this.handleArea1.bind(this)} defaultVal={this.state.area1} />
                    <Cascade title='请选择' dataSet={this.state.areaData2} filed='Area2_' handleClick={this.handleArea2.bind(this)} defaultVal={this.state.area2} />
                    <Cascade title='请选择' dataSet={this.state.areaData3} filed='Area3_' handleClick={this.handleArea3.bind(this)} defaultVal={this.state.area3} />
                    <Cascade title='请选择' dataSet={this.state.areaData4} filed='Area4_' handleClick={this.handleArea4.bind(this)} defaultVal={this.state.area4} />
                </div>
                <div className={styles.submit} onClick={this.handleSubmit.bind(this)}>确认</div>
            </div>
        )
    }

    async handleArea1(area: string): Promise<void> {
        this.state.area1 = area;
        this.state.area2 = '';
        this.state.area3 = '';
        this.state.area4 = '';
        if (!area) {
            this.handleSubmit()
            return
        }
        let dataIn = new DataRow();
        dataIn.setValue('Area1_', this.state.area1);
        dataIn.setValue('Area2_', this.state.area2);
        dataIn.setValue('Area3_', this.state.area3);
        let areaData2 = await DialogApi.getCusArea(dataIn)
        this.setState({
            ...this.state,
            areaData2,
            areaData3: new DataSet(),
            areaData4: new DataSet(),
        })
    }
    async handleArea2(area: string): Promise<void> {
        this.state.area2 = area;
        this.state.area3 = '';
        this.state.area4 = '';
        if (!area) {
            this.handleSubmit()
            return
        }
        let dataIn = new DataRow();
        dataIn.setValue('Area1_', this.state.area1);
        dataIn.setValue('Area2_', this.state.area2);
        dataIn.setValue('Area3_', this.state.area3);
        let areaData3 = await DialogApi.getCusArea(dataIn)
        this.setState({
            ...this.state,
            areaData3,
            areaData4: new DataSet(),
        })
    }
    async handleArea3(area: string): Promise<void> {
        this.state.area3 = area;
        this.state.area4 = '';
        if (!area) {
            this.handleSubmit()
            return
        }
        let dataIn = new DataRow();
        dataIn.setValue('Area1_', this.state.area1);
        dataIn.setValue('Area2_', this.state.area2);
        dataIn.setValue('Area3_', this.state.area3);
        let areaData4 = await DialogApi.getCusArea(dataIn)
        this.setState({
            ...this.state,
            areaData4,
        })
    }
    async handleArea4(area: string): Promise<void> {
        this.state.area4 = area;
        this.setState({
            ...this.state,
            area4: area,
        }, () => {
            this.handleSubmit()
        })
    }

    handleSubmit() {
        let val: string = this.state.area1;
        if (this.state.area2)
            val += `->${this.state.area2}`
        if (this.state.area3)
            val += `->${this.state.area3}`
        if (this.state.area4)
            val += `->${this.state.area4}`
        let areaInput = document.getElementById(this.props.inputId) as HTMLInputElement;
        areaInput.value = val;
        this.handleClose();
    }
}

type CascadeTypeProps = {
    dataSet: DataSet,
    title: string,
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
                <li onClick={() => this.props.handleClick('')} className={'' == this.props.defaultVal ? styles.selected : ''}>{this.props.title}</li>
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