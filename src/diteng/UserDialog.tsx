import React, { ChangeEventHandler, MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import QueryService from "../db/QueryService";
import DBEdit, { OnChangedEvent } from "../rcc/DBEdit";
import DialogGrid, { OnTrClickEvent } from "../rcc/DialogGrid";
import { TGridColumn, TGridConfig } from "../vcl/TGrid";
import { showMsg } from "./Summer";
import './UserDialog.css';

type propsType = {
    token: string;
    inputId: string;
    viewId: string;
    title: string;
}

type stateType = {
    dataIn: DataRow;
    config: TGridConfig;
}

export default class UserDialog extends React.Component<propsType, stateType> {
    private _dataSet: DataSet;

    constructor(props: propsType) {
        super(props);
        this._dataSet = new DataSet();

        let config = new TGridConfig();
        new TGridColumn(config, "Code_", "账号").setWidth(5);
        new TGridColumn(config, "Name_", "姓名").setWidth(10);
        new TGridColumn(config, "Opera", "操作").setWidth(3).setAlign("center").setOnRender((column, row) => {
            return (<span style={{ color: '#3273F4' }}>选择</span>)
        });

        config.setDataSet(this._dataSet);
        this.state = { dataIn: new DataRow(), config };
        this.buttonClick(null);
    }

    render() {
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
                        <DBEdit dataSource={this.state.dataIn} dataField={'SearchText_'} dataName=''
                            onChanged={this.update} placeholder='请输入查询条件' autoFocus={true} />
                        <input type="submit" name="submit" onClick={this.buttonClick} value="查询" style={{ height: '1.75rem' }} />
                    </form>
                    <DialogGrid config={this.state.config} onTrClick={this.trClick} />
                </div>
            </React.Fragment>
        )
    }

    buttonClick: MouseEventHandler<HTMLInputElement> = (sender: any) => {
        if (sender)
            sender.preventDefault();

        let query = new QueryService(this.props);
        query.dataIn.head.copyValues(this.state.dataIn.current);
        query.dataIn.head.setValue('Enabled_', 1);
        query.add('select Code_,Name_ from TAppUserInfo.userList');
        query.open().then((dataOut: DataSet) => {
            this.state.config.setDataSet(dataOut);
            this.setState({ ...this.state });
            showMsg(dataOut.message);
        }).catch((dataOut: DataSet) => {
            showMsg(dataOut.message);
        })
    }

    update: OnChangedEvent = (sender: any) => {
        this.setState(this.state);
        console.log(this.state.dataIn.current.jsonString);
    }

    closeDialog = () => {
        //@ts-ignore
        top.deleteDialog(this.props.viewId);
    }

    trClick: OnTrClickEvent = (row: DataRow) => {
        let userCode = row.getValue('Code_');
        let userName = row.getValue('Name_');

        var inputIds = this.props.inputId.split(",");
        $("#" + inputIds[0], parent.document).val(userCode);
        $("#" + inputIds[1], parent.document).val(userName);
        this.closeDialog();
    }
}
