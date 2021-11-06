import React, { ChangeEventHandler, MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import QueryService from "../db/QueryService";
import DBCheckbox from "../rcc/DBCheckbox";
import DBEdit, { OnChangedEvent } from "../rcc/DBEdit";
import DialogGrid, { OnTrClickEvent } from "../rcc/DialogGrid";
import GridConfig from "../rcc/GridConfig";
import { showMsg } from "./Summer";
import './CusDialog.css'
import TGridColumn from "../ext/TGridColumn";

type propsType = {
    token: string;
    inputId: string;
    viewId: string;
    title: string;
}

type stateType = {
    dataIn: DataRow;
    config: GridConfig;
    objItems: DataSet;
    cusNameColumn: TGridColumn;
    child: GridConfig;
}

export default class CusDialog extends React.Component<propsType, stateType> {
    constructor(props: propsType) {
        super(props);
        let isObjType: boolean = localStorage.getItem('EnableObjType-Cus') == 'true';
        let isName: boolean = localStorage.getItem('EnableName-Cus') == 'true';
        let isAddress: boolean = localStorage.getItem('EnableAddress-Cus') == 'true';
        let config = new GridConfig();
        config.setDataSet(new DataSet());

        new TGridColumn(config, "sn_", "序").setWidth(1).setAlign("center");
        new TGridColumn(config, "ShortName_", "客户简称").setWidth(8);
        let cusNameColumn = new TGridColumn(config, "Name_", "客户全称").setWidth(8);
        cusNameColumn.setVisible(isName);
        new TGridColumn(config, "Contact_", "联系人").setWidth(5);
        new TGridColumn(config, "Opera", "操作").setWidth(3).setAlign("center").setOnRender((column, row) => {
            return (<span style={{ color: '#3273F4' }}>选择</span>)
        });
        let child = config.newChild();
        child.setVisible(isAddress);
        new TGridColumn(child, "Address_", "地址");

        let dataIn = new DataRow();
        dataIn.setValue('MaxRecord_', 100);
        dataIn.setValue('isObjType', isObjType);
        dataIn.setValue('isName', isName);
        dataIn.setValue('isAddress', isAddress);
        dataIn.setValue('ObjType_', isObjType ? '1001' : '');
        this.state = { dataIn, config, objItems: new DataSet(), cusNameColumn, child };
        this.buttonClick(null);
    }

    render() {
        let ds = this.state.config.dataSet;
        while (ds.fetch())
            ds.setValue("sn_", ds.recNo);

        return (
            <React.Fragment>
                <div className="dialogClose" style={{ display: 'none' }}>
                    {this.props.title}
                    <span>
                        <a onClick={this.closeDialog} href='#'><b>×</b></a>
                    </span>
                </div>
                <div className="window">
                    <form method="post" className="search" style={{ minHeight: '4em' }}>
                        <div className='left'>
                            <DBEdit dataSource={this.state.dataIn} dataField={'SearchText_'} dataName='查询条件'
                                onChanged={this.updateDataIn} placeholder='请输入查询条件' autoFocus={true} />

                            <DBEdit dataSource={this.state.dataIn} dataField={'MaxRecord_'} dataName='载入笔数'
                                onChanged={this.updateDataIn} placeholder='请输载入笔数' />
                        </div>
                        <input type="submit" name="submit" onClick={this.buttonClick} value="查询" style={{ height: '1.75rem' }} />
                        <DBCheckbox dataSource={this.state.dataIn} dataField={'isObjType'} dataName='客户分类'
                            onChanged={this.updateObjType} />

                        <DBCheckbox dataSource={this.state.dataIn} dataField={'isName'} dataName='客户全称'
                            onChanged={this.updateDataIn} />

                        <DBCheckbox dataSource={this.state.dataIn} dataField={'isAddress'} dataName='客户地址'
                            onChanged={this.updateDataIn} />

                        <section className="operction">
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

                    <DialogGrid config={this.state.config} onTrClick={this.trClick} />
                </div>
            </React.Fragment>
        )
    }

    buttonClick: MouseEventHandler<HTMLInputElement> = (sender: any) => {
        if (sender && !sender.code)
            sender.preventDefault();

        let query = new QueryService(this.props);
        query.dataIn.head.copyValues(this.state.dataIn.current);
        query.dataIn.head.setValue('Disable_', false);
        query.dataIn.head.setValue('ShowCusOrd', false);
        query.dataIn.head.setValue('Final_', true);

        query.add('select ShortName_,Code_,Name_,Contact_,Address_,CorpNo_ from TAppCusInfo.Download');
        query.open().then((dataOut: DataSet) => {
            this.state.objItems.clear();
            let ds = new DataSet();
            let objDs = new DataSet();
            dataOut.first();
            while (dataOut.fetch()) {
                if (!dataOut.getString("CorpNo_")) {
                    objDs.append().copyRecord(dataOut.current, dataOut.fieldDefs);
                } else {
                    ds.append().copyRecord(dataOut.current, dataOut.fieldDefs);
                }
            }
            this.state.config.setDataSet(ds);
            this.state.objItems.appendDataSet(objDs);
            this.setState(this.state);
            showMsg(dataOut.message);
        }).catch((dataOut: DataSet) => {
            showMsg(dataOut.message);
        })
    }

    updateDataIn: OnChangedEvent = (sender: any) => {
        let isName = this.state.dataIn.getBoolean('isName');
        let isAddress = this.state.dataIn.getBoolean('isAddress');
        localStorage.setItem('EnableName-Cus', isName + '');
        localStorage.setItem('EnableAddress-Cus', isAddress + '');
        this.state.cusNameColumn.setVisible(isName);
        this.state.child.setVisible(isAddress);
        this.setState(this.state);
    }

    updateObjType: OnChangedEvent = (sender: any) => {
        let isObjType = this.state.dataIn.getBoolean('isObjType');
        this.state.dataIn.setValue('ObjType_', isObjType ? '1001' : '');
        let objType = localStorage.getItem('EnableObjType-Cus') == 'true';
        if (isObjType) {
            this.state.objItems.clear();
        }
        this.setState(this.state);
        if (objType != isObjType) {
            this.buttonClick(sender);
            localStorage.setItem('EnableObjType-Cus', isObjType + '');
        }
    }

    closeDialog = () => {
        //@ts-ignore
        top.deleteDialog(this.props.viewId);
    }

    trClick: OnTrClickEvent = (row: DataRow) => {
        let userCode = row.getValue('Code_');
        let userName = row.getValue('ShortName_');

        var inputIds = this.props.inputId.split(",");
        $("#" + inputIds[0], parent.document).val(userCode);
        $("#" + inputIds[1], parent.document).val(userName);
        this.closeDialog();
    }

    objTypeClick: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        let le: HTMLButtonElement = sender.target;
        if (le.value)
            this.state.dataIn.setValue('ObjType_', le.value);
        this.buttonClick(sender);
    }
}
