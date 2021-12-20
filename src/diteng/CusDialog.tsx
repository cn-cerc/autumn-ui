import React, { MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import QueryService from "../db/QueryService";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from '../rcc/BaseDialog';
import { ColumnIt } from "../rcc/ColumnIt";
import DBCheckbox from "../rcc/DBCheckbox";
import DBEdit, { OnFieldChangedEvent } from "../rcc/DBEdit";
import DBGrid, { ChildRow, Column } from "../rcc/DBGrid";
import { OnTrClickEvent } from "../rcc/DialogGrid";
import { TGridColumn, TGridConfig } from "../vcl/TGrid";
import styles from './CusDialog.css';
import DialogApi from "./DialogApi";
import { showMsg } from "./Summer";

type CusTypeProps = {
    title: string;
} & Partial<BaseDialogPropsType>

type CusTypeState = {
    dataIn: DataRow;
    objItems: DataSet;
    dataSet: DataSet;
} & Partial<BaseDialogStateType>

export default class CusDialog extends BaseDialog<CusTypeProps, CusTypeState> {
    constructor(props: CusTypeProps) {
        super(props);
        let isObjType: boolean = localStorage.getItem('EnableObjType-Cus') == 'true';
        let isName: boolean = localStorage.getItem('EnableName-Cus') == 'true';
        let isAddress: boolean = localStorage.getItem('EnableAddress-Cus') == 'true';
        let dataIn = new DataRow();
        dataIn.setValue('MaxRecord_', 100);
        dataIn.setValue('isObjType', isObjType);
        dataIn.setValue('isName', isName);
        dataIn.setValue('isAddress', isAddress);
        dataIn.setValue('ObjType_', isObjType ? '1001' : '');
        dataIn.setValue('Disable_', false);
        dataIn.setValue('ShowCusOrd', false);
        dataIn.setValue('Final_', true);
        this.setTitle('请选择客户');
        this.state = {
            ...this.state,
            dataIn,
            objItems: new DataSet(),
            dataSet: new DataSet(),
            width: '62rem'
        };
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await DialogApi.getCusInfos(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div className={styles.main}>
                <form method="post" className={styles.search}>
                    <div className={styles.left}>
                        <DBEdit dataRow={this.state.dataIn} dataField={'SearchText_'} dataName='查询条件'
                            onChanged={this.updateDataIn} placeholder='请输入查询条件' autoFocus />

                        <DBEdit dataRow={this.state.dataIn} dataField={'MaxRecord_'} dataName='载入笔数'
                            onChanged={this.updateDataIn} placeholder='请输载入笔数' />
                    </div>
                    <input type="submit" name="submit" onClick={this.buttonClick.bind(this)} value="查询" style={{ height: '1.75rem' }} />
                    <DBCheckbox dataRow={this.state.dataIn} dataField={'isObjType'} dataName='客户分类'
                        onChanged={this.updateObjType} />

                    <DBCheckbox dataRow={this.state.dataIn} dataField={'isName'} dataName='客户全称'
                        onChanged={this.updateDataIn} />

                    <DBCheckbox dataRow={this.state.dataIn} dataField={'isAddress'} dataName='客户地址'
                        onChanged={this.updateDataIn} />

                    <section className={styles.operction}>
                        {
                            this.state.objItems.records.map((row: DataRow) => {
                                return (
                                    <button name="objType" value={row.getString('Code_')} onClick={this.objTypeClick}>{row.getString('ShortName_')}</button>
                                )
                            })
                        }
                        {
                            this.state.objItems.records.length == 0 && this.state.dataIn.getBoolean('isObjType') ?
                                (<button name="objType" value='1001' onClick={this.objTypeClick}>返回第一层</button>) : ''
                        }
                    </section>
                </form>

                <DBGrid dataSet={this.state.dataSet} key={this.getKey()} onRowClick={this.isPhone ? '' : this.trClick.bind(this)}>
                    <ColumnIt width='1' />
                    <Column name='客户简称' code='ShortName_' width='8'></Column>
                    {this.state.dataIn.getValue('isName') ? <Column name='客户全称' code='Name_' width='8'></Column> : ''}
                    {this.isPhone ? '' : <Column name='联系人' code='Contact_' width='5'></Column>}
                    {this.isPhone ? '' : <Column name='联系人手机' code='Mobile_' width='5'></Column>}
                    {this.isPhone ? '' : <Column name='电话号码' code='Tel1_' width='5'></Column>}
                    {this.getAddress()}
                    <Column name='操作' code='opera' width={this.isPhone ? '5' : '3'} textAlign='center' customText={(row: DataRow) => {
                        return <span role='opera' onClick={this.isPhone ? this.trClick.bind(this, row) : ''}>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    getKey() {
        let str = '1';
        str += this.state.dataIn.getValue('isName') ? '1' : '0';
        str += this.state.dataIn.getValue('isAddress') ? '1' : '0';
        return str;
    }

    getAddress() {
        if (this.isPhone) {
            return (
                <ChildRow visible={!this.state.dataIn.getValue('isAddress')} colSpan={7}>
                    <Column name='地址' code='Address_' width='100' customText={(row: DataRow) => {
                        return <span>地址：{row.getString('Address_')}</span>
                    }}></Column>
                </ChildRow>
            )
        } else {
            return (
                <Column name='地址' code='Address_' width='8' visible={!this.state.dataIn.getValue('isAddress')} customText={(row: DataRow) => {
                    return <span>地址：{row.getString('Address_')}</span>
                }}></Column>
            )
        }
    }

    buttonClick: MouseEventHandler<HTMLInputElement> = (sender: any) => {
        if (sender && !sender.code)
            sender.preventDefault();
        this.init();
    }

    updateDataIn: OnFieldChangedEvent = (sender: any) => {
        let isName = this.state.dataIn.getBoolean('isName');
        let isAddress = this.state.dataIn.getBoolean('isAddress');
        localStorage.setItem('EnableName-Cus', isName + '');
        localStorage.setItem('EnableAddress-Cus', isAddress + '');
        this.setState(this.state);
    }

    updateObjType: OnFieldChangedEvent = (sender: any) => {
        let isObjType = this.state.dataIn.getBoolean('isObjType');
        this.state.dataIn.setValue('ObjType_', isObjType ? '1001' : '');
        let objType = localStorage.getItem('EnableObjType-Cus') == 'true';
        if (isObjType) {
            this.state.objItems.clear();
        }
        this.setState(this.state);
        if (objType != isObjType) {
            localStorage.setItem('EnableObjType-Cus', isObjType + '');
            this.buttonClick(sender);
        }
    }

    trClick: OnTrClickEvent = (row: DataRow) => {
        let inputIds = this.props.inputId.split(",");
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getValue('Code_');
        if (inputIds.length > 1) {
            let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
            input2.value = row.getValue('ShortName_');
        }
        this.handleSelect();
    }

    objTypeClick: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        let le: HTMLButtonElement = sender.target;
        if (le.value)
            this.state.dataIn.setValue('ObjType_', le.value);
        this.buttonClick(sender);
    }
}
