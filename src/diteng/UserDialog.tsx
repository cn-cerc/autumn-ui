import React, { ChangeEventHandler, MouseEventHandler } from "react";
import DataSet from "../db/DataSet";
import FieldDefs from "../db/FieldDefs";
import QueryService from "../db/QueryService";

type propsType = {
    token: string;
    inputId: string;
    viewId: string;
    title: string;
}

type stateType = {
    searchText: string;
    dataOut: DataSet;
}

export default class UserDialog extends React.Component<propsType, stateType> {
    private _dataSet: DataSet;

    constructor(props: propsType) {
        super(props);
        this._dataSet = new DataSet();
        this.state = { searchText: '', dataOut: this._dataSet };
    }

    buttonClick: MouseEventHandler<HTMLInputElement> = (sender: any) => {
        sender.preventDefault();
        let query = new QueryService(this.props);
        query.dataIn.head.setValue('Enabled_', 1);
        query.dataIn.head.setValue('SearchText_', this.state.searchText);
        query.add('select Code_,Name_ from TAppUserInfo.userList');
        query.open().then(dataOut => {
            console.log(dataOut);
            this.setState({ ...this.state, dataOut })
        })
    }

    searchTextChange: ChangeEventHandler<HTMLInputElement> = (sender: any) => {
        let el: HTMLInputElement = sender.target;
        this.setState({ ...this.state, searchText: el.value });
    }

    selectItem: MouseEventHandler<HTMLTableRowElement> = (sender: any) => {
        let el: HTMLElement = sender.target.parentElement;
        let userCode = el.children[0].innerHTML;
        let userName = el.children[1].innerHTML;
        console.log(userCode, userName)

        var inputIds = this.props.inputId.split(",");
        $("#" + inputIds[0], parent.document).val(userCode);
        $("#" + inputIds[1], parent.document).val(userName);
        this.closeDialog();
    }

    closeDialog = () => {
        //@ts-ignore
        top.deleteDialog(this.props.viewId);
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
                        <input type="text" id="searchText" placeholder='请输入查询条件' name="searchText" 
                        value={this.state.searchText} onChange={this.searchTextChange} autoFocus style={{height: '1.75rem'}}/>
                        <input type="submit" name="submit" onClick={this.buttonClick} value="查询" style={{height: '1.75rem'}}/>
                    </form>
                    <table className="dbgrid">
                        <tbody><tr>
                            <th>帐号</th>
                            <th>姓名</th>
                            <th>操作</th>
                        </tr>
                            {this.state.dataOut.records.map(row => {
                                return (
                                    <tr key={row.dataSet.recNo} onClick={this.selectItem}>
                                        <td>{row.getString('Code_')}</td>
                                        <td>{row.getString('Name_')}</td>
                                        <td align="center" style={{ color: '#015bad' }}>选择</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody></table>
                </div>
            </React.Fragment>
        )
    }
}
