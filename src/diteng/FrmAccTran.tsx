import React from "react";
import { DataRow, DataSet, DBEdit, QueryService } from "../Autumn-UI";
import DBBlock, { Line } from "../rcc/DBBlock";
import DateDialog from "../rcc/DateDialog";
import DBGrid, { Column } from "../rcc/DBGrid";
import MenuItem from "../rcc/MenuItem";
import SearchPanel from "../rcc/SearchPanel";
import StatusBar from "../rcc/StatusBar";
import ToolPanel, { ToolItem as ToolItem } from "../rcc/ToolPanel";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "./CustomForm";
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
        this.state = { headIn: new DataRow, dataOut: new DataSet, message: '' }
    }

    render() {
        return (
            <CustomForm title='会计凭证维护'>
                <MenuItem code='acc' name='财务总帐' />
                <ToolPanel>
                    <ToolItem title='操作提示'>
                        <div>（无）</div>
                    </ToolItem>
                    <ToolItem title='相关操作'>
                        <div>（无） </div>
                    </ToolItem>
                </ToolPanel>
                <SearchPanel dataSource={this.state.headIn} onExecute={this.serachExecute}>
                    <DBEdit dataField='code' dataName='代码' />
                    <DBEdit dataField='name' dataName='名称' ></DBEdit>
                    <DBEdit dataField='tbDate' dataName='日期'><DateDialog /></DBEdit>
                </SearchPanel>
                <DBGrid dataSource={this.state.dataOut}>
                    <Column code='code_' width='10'>代码</Column>
                    <Column code='name_' width='20'>名称</Column>
                    <Column code='remark_' width='50'>备注</Column>
                </DBGrid>
                <DBBlock dataSource={this.state.dataOut}>
                    <Line>
                        <Column code='code_' width='2'></Column>
                        <Column code='name_' width='8'>名称</Column>
                    </Line>
                    <Line>
                        <Column code='remark_' width='50'>备注</Column>
                    </Line>
                </DBBlock>
                <StatusBar>
                    <button>添加</button>
                    <button>添加</button>
                </StatusBar>
            </CustomForm>
        )
    }

    serachExecute = (row: DataRow) => {
        let query = new QueryService(this.props);
        query.dataIn.head.copyValues(this.state.headIn);
        query.add('select * from db.Account');
        query.open().then(dataOut => {
            this.setState({ ...this.state, dataOut });
        }).catch(dataOut => {
            this.setState({ ...this.state, dataOut, message: dataOut.message })
        })
    }
}