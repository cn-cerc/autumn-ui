import React, { LegacyRef, MouseEventHandler } from "react";
import DataRow from "../src/db/DataRow";
import DataSet from "../src/db/DataSet";
import QueryService from "../src/db/QueryService";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "../src/diteng/CustomForm";
import MainMenu from "../src/diteng/MainMenu";
import Block, { Line } from "../src/rcc/Block";
import DateDialog from "../src/rcc/DateDialog";
import DBEdit, { ISelectDialog, OnSelectedEvent } from "../src/rcc/DBEdit";
import DBGrid, { ChildRow, Column, OnDataSetChangedEvvent } from "../src/rcc/DBGrid";
import MenuItem from "../src/rcc/MenuItem";
import SearchPanel from "../src/rcc/SearchPanel";
import StatusBar from "../src/rcc/StatusBar";
import ToolPanel, { ToolItem } from "../src/rcc/ToolPanel";
import "./FrmAccTran.css";

type stateType = {
    headIn: DataRow;
    dataOut: DataSet;
    title?: string;
    message: string;
} & Partial<CustomFormStateType>

export default class FrmAccTran extends CustomForm<CustomFormPropsType, stateType> {
    constructor(props: CustomFormPropsType) {
        super(props);
        let dataOut = new DataSet();
        dataOut.append().setValue('code_', 'a1').setValue('name_', 'jason1');
        dataOut.append().setValue('code_', 'a2').setValue('name_', 'jason2');
        dataOut.append().setValue('code_', 'a3').setValue('name_', 'jason3').setValue('remark_', 'abc');
        this.state = { headIn: new DataRow(), dataOut, message: '' }
    }

    render() {
        return (
            <CustomForm title='会计凭证维护'>
                <MenuItem code='acc' name='财务总帐' />
                <ToolPanel>
                    <MainMenu />
                    {/* <ToolItem title='操作提示'>
                        <div>（这里是操作提示）</div>
                        <div>（这里是操作提示）</div>
                        <div>（这里是操作提示）</div>
                        </ToolItem>
                        <ToolItem title='相关操作'>
                        <div>（这里是相关操作） </div>
                    </ToolItem> */}
                </ToolPanel>
                <SearchPanel dataSource={this.state.headIn} onExecute={this.btnSearch}>
                    <DBEdit dataField='code' dataName='代码' />
                    <DBEdit dataField='name' dataName='名称' ></DBEdit>
                    <DBEdit dataField='tbDate' dataName='日期'><DateDialog /></DBEdit>
                </SearchPanel>
                <DBGrid dataSource={this.state.dataOut} readOnly={false} onChanged={this.onChanged}>
                    <Column code='code_' name='代码' width='10' />
                    <Column code='name_' name='名称' width='20' >
                        <DBEdit dataField='code_' >
                            <SelectAccCode></SelectAccCode>
                        </DBEdit>
                        <DBEdit dataField='name_' />
                    </Column>
                    <ChildRow>
                        <Column code='remark_' name='备注' width='50' />
                    </ChildRow>
                </DBGrid>
                <Block dataSource={this.state.dataOut}>
                    <Line>
                        <Column code='code_' name='代码' width='10' />
                        <Column code='name_' name='名称' width='20' />
                    </Line>
                    <Line>
                        <Column code='remark_' name='备注' width='50' />
                    </Line>
                </Block>
                <button onClick={this.btnAppend}>添加</button>
                <StatusBar>
                </StatusBar>
            </CustomForm>
        )
    }

    btnSearch = (row: DataRow) => {
        let query = new QueryService(this.props);
        query.dataIn.head.copyValues(row);
        query.add('select * from db.Account');
        query.open().then(dataOut => {
            this.setState({ ...this.state, dataOut });
        }).catch(dataOut => {
            this.setState({ ...this.state, dataOut, message: dataOut.message })
        })
    }

    onChanged: OnDataSetChangedEvvent = (dataSet: DataSet) => {
        console.log(dataSet.jsonString);
    }

    btnAppend: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        this.state.dataOut.append();
        this.setState(this.state);
    }

}

type SelectAccCodeState = {
    active: boolean;
}

export class SelectAccCode extends React.Component<any, SelectAccCodeState> implements ISelectDialog {
    dialog: HTMLDivElement;

    constructor(props: any) {
        super(props)
        this.state = { active: false }
    }

    render() {
        return (<div className='selectDialog'>
            <button onClick={this.btnShow}>...</button>
            <div className='dialog' style={{ display: this.state.active ? 'inline' : 'none' }}
                ref={this.setDialog}>
                <div><span>选择会计科目</span><span className='closeDialog' onClick={this.btnClose}>X</span></div>
                <div>
                </div>
            </div>
        </div >)
    }

    setDialog: LegacyRef<HTMLDivElement> = (sender: HTMLDivElement) => {
        this.dialog = sender;
    }

    btnShow: any = (sender: any) => {
        this.setState({ ...this.state, active: !this.state.active })
    }

    btnClose: any = (sender: any) => {
        this.setState({ ...this.state, active: false })
    }

    select(value: string) {
        alert('ok')
    }

}