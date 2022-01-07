import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import DBDrop from "../rcc/DBDrop";
import DBEdit from "../rcc/DBEdit";
import DBGrid, { Column } from "../rcc/DBGrid";
import SearchPanel from "../rcc/SearchPanel";
import styles from "./StaffDialog.css";
import DialogApi from './DialogApi';
import { showMsg } from "./Summer";
import { ColumnIt } from "../rcc/ColumnIt";

type SaleCurrentNumTypeProps = {
    partCode: string,
    ym: string,
    applyCode: string,
    forecastTeam: string,
    userCode: string
} & Partial<BaseDialogPropsType>

type SaleCurrentNumTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class SaleCurrentNumDialog extends BaseDialog<SaleCurrentNumTypeProps, SaleCurrentNumTypeState> {
    constructor(props: SaleCurrentNumTypeProps) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('showOther', true);
        dataIn.setValue('PartCode_', this.props.partCode);
        dataIn.setValue('YM_', this.props.ym);
        dataIn.setValue('ApplyCode_', this.props.applyCode);
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            width: '45rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
        this.setTitle('请选择借调对象');
    }

    componentWillMount() {
        this.init();
    }

    content(): JSX.Element {
        return (
            <div className={styles.main} role='content'>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataName='年月' dataField='YM_' readOnly={true}></DBEdit>
                    <DBEdit dataName='商品编号' dataField='PartCode_' readOnly={true}></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)} openPage={false}>
                    {this.isPhone ? '' : <ColumnIt width='8' />}
                    <Column name='主责业务' textAlign='center' code='SalesName_' width='25'></Column>
                    {this.props.forecastTeam == 'true' ? <Column name='成本中心' textAlign='center' code='CostTypeName' width='25'></Column> : ''}
                    <Column name='当月预售量' textAlign='right' code='CurrentNum' width='30'></Column>
                    {this.props.forecastTeam == 'true' ? <Column name='可用量' textAlign='right' code='AvaiNum_' width='20'></Column> : ''}
                    {this.props.forecastTeam != 'true' ? <Column name='当月出货量' textAlign='right' code='OutNum_' width='20'></Column> : ''}
                    {this.props.forecastTeam != 'true' ? <Column name='借调预售量' textAlign='right' code='AdjustNum_' width='20'></Column> : ''}
                    {this.props.forecastTeam != 'true' ? <Column name='剩余预售' textAlign='right' code='RemainCurrentNum' width='20'></Column> : ''}
                    <Column name='选择' textAlign='center' code='opera' width={this.isPhone ? '15' : '10'} customText={(row: DataRow) => {
                        return <span role={row.getString('SalesCode_') != this.props.userCode ? 'opera' : ''}>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    async init() {
        let dataSet = await this.getSaleCurrentNum();
        if (dataSet.state <= 0) {
            showMsg(dataSet.message)
        } else {
            if (this.props.forecastTeam == 'true')
                dataSet.setSort('AvaiNum_ DESC')
            else
                dataSet.setSort('RemainCurrentNum DESC')
            this.setState({
                dataSet
            })
        }
    }

    async getSaleCurrentNum(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DialogApi.getSaleCurrentNum(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement
        if (row.getString('SalesCode_') != this.props.userCode) {
            input1.value = row.getString('SalesCode_');
            let input2 = document.getElementById(inputIds[1]) as HTMLInputElement
            input2.value = row.getString('SalesName_');
            this.handleSelect();
        }
    }
}