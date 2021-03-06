import React, { MouseEventHandler } from "react";
import { BaseDialogPropsType, DataRow, DataSet, BaseDialogStateType, BaseDialog, DBEdit, DBCheckbox, DBGrid, ColumnIt, Column, ChildRow, OnFieldChangedEvent } from "autumn-ui";
import styles from './CusDialog.css';
import DialogApi from "./DialogApi";

type CusTypeProps = {
    title: string;
    addresseId: string;
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
        let dataOut: DataSet = await DialogApi.getCusInfos(this.state.dataIn);
        let ds = new DataSet();
        let objDs = new DataSet();
        dataOut.first();
        while (dataOut.fetch()) {
            if (!dataOut.getString("CorpNo_")) {
                objDs.append().copyRecord(dataOut.current, dataOut.fields);
            } else {
                ds.append().copyRecord(dataOut.current, dataOut.fields);
            }
        }
        this.setLoad(false);
        this.setState({
            dataSet: ds,
            objItems: objDs
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

                <DBGrid dataSet={this.state.dataSet} key={this.getKey()} onRowClick={this.isPhone ? '' : this.trClick.bind(this)} openPage={false}>
                    <ColumnIt width='1' />
                    <Column name='客户简称' code='ShortName_' width='8'></Column>
                    {this.state.dataIn.getValue('isName') ? <Column name='客户全称' code='Name_' width='8'></Column> : ''}
                    {this.isPhone ? '' : <Column name='联系人' code='Contact_' width='5'></Column>}
                    {this.isPhone ? '' : <Column name='联系人手机' code='Mobile_' width='5'></Column>}
                    {this.isPhone ? '' : <Column name='电话号码' code='Tel1_' width='5'></Column>}
                    {this.getAddress()}
                    <Column name='操作' code='opera' width={this.isPhone ? '5' : '3'} textAlign='center' customText={(row: DataRow) => {
                        return <span role='auiOpera' onClick={this.isPhone ? this.trClick.bind(this, row) : ''}>选择</span>
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
                    return <span>{row.getString('Address_')}</span>
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

    trClick(row: DataRow) {
        let inputIds = this.props.inputId.split(",");
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getValue('Code_');
        if (inputIds.length > 1) {
            let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
            input2.value = row.getValue('ShortName_');
        }
        
        if (this.props.addresseId) {
            let addresseIds = this.props.addresseId.split(",");
            if(addresseIds.length==4){
                //省市县区value
                let addressInput = document.getElementById(addresseIds[0]) as HTMLInputElement;
                //省市县区name
                let addressNameInput = document.getElementById(addresseIds[0] + "_name") as HTMLInputElement;
                //联系人名
                let contactInput = document.getElementById(addresseIds[1]) as HTMLInputElement;
                //手机号
                let mobileInput = document.getElementById(addresseIds[2]) as HTMLInputElement;
                //详细地址
                let addressDetailInput = document.getElementById(addresseIds[3]) as HTMLInputElement;
                let address = (row.getString('Area1_') || '未知') + '/' + (row.getString('Area2_') || '未知') + '/' + (row.getString('Area3_') || '未知');
                addressInput.value = address;
                addressNameInput.value = address;
                contactInput.value = row.getString('Contact_');
                mobileInput.value = row.getString('Mobile_');
                addressDetailInput.value = row.getString('Area4_') + row.getString('Area5_');
            }
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
