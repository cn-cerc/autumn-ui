import React, { MouseEventHandler } from "react";
import AccCodeLists from "../AccCodeLists";
import DataRow from "../src/db/DataRow";
import DataSet from "../src/db/DataSet";
import QueryService from "../src/db/QueryService";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "../src/diteng/CustomForm";
import ListAccCode from "../src/diteng/ListAccCode";
import MainMenu from "../src/diteng/MainMenu";
import SelectAccCode from "../src/diteng/SelectAccCode";
import Block, { Line } from "../src/rcc/Block";
import ComboBox from "../src/rcc/ComboBox";
import DBEdit from "../src/rcc/DBEdit";
import DBGrid, { Column, OnDataRowChangedEvent, OnRowChangedEvent } from "../src/rcc/DBGrid";
import MenuItem from "../src/rcc/MenuItem";
import ModifyPanel, { ModifyOnExecute } from "../src/rcc/ModifyPanel";
import StatusBar from "../src/rcc/StatusBar";
import ToolPanel from "../src/rcc/ToolPanel";
import YearDialog from "../src/rcc/YearDialog";
import styles from "./FrmAccTran.css";

type stateType = {
    headIn: DataRow;
    dataOut: DataSet;
    title?: string;
    message: string;
} & Partial<CustomFormStateType>

export default class FrmAccTran extends CustomForm<CustomFormPropsType, stateType> {
    accCodeLists = new AccCodeLists();
    constructor(props: CustomFormPropsType) {
        super(props);
        let dataOut = new DataSet();
        dataOut.append().setValue('code_', '1001');
        dataOut.setValue('name_', this.accCodeLists.getAccNameByCode(dataOut.getString('code_')));
        dataOut.setValue('drAmount_', 100);
        dataOut.append().setValue('code_', '1001');
        dataOut.setValue('name_', this.accCodeLists.getAccNameByCode(dataOut.getString('code_')));
        dataOut.setValue('drAmount_', 100);
        dataOut.append().setValue('code_', '1002-001');
        dataOut.setValue('name_', this.accCodeLists.getAccNameByCode(dataOut.getString('code_')));
        dataOut.setValue('remark_', 'abc');
        dataOut.setValue('crAmount_', 200);
        console.log(dataOut);
        this.state = { headIn: new DataRow(), dataOut, message: '' }
    }

    get pageTitle(): string {
        return '会计凭证维护';
    }

    content(): JSX.Element {
        return (
            <React.Fragment>
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
                <ModifyPanel dataRow={this.state.headIn} onExecute={this.btnSearch}>
                    <DBEdit dataField='code' dataName='凭证编号' >
                        <SelectAccCode style={{ width: '60%', height: '50%' }} />
                    </DBEdit>
                    <DBEdit dataField='tbDate' dataName='凭证日期' >
                        <YearDialog style={{ width: '20rem', height: '10rem' }} />
                    </DBEdit>
                    <DBEdit dataField='name' dataName='凭证摘要' ></DBEdit>
                </ModifyPanel>
                <DBGrid dataSet={this.state.dataOut} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='code_' name='会计科目' width='10' onChanged={this.onChangedByCode}>
                        <ComboBox dataField='code_' >
                            <ListAccCode />
                        </ComboBox>
                    </Column>
                    <Column code='name_' name='科目名称' width='20' >
                    </Column>
                    <Column code='subject_' name='摘要' width='30' >
                        <DBEdit dataField='subject_' />
                    </Column>
                    <Column code='drAmount_' name='借方金额' width='10' >
                        <DBEdit dataField='drAmount_' />
                    </Column>
                    <Column code='crAmount_' name='贷方金额' width='10' >
                        <DBEdit dataField='crAmount_' />
                    </Column>
                    <Column code='remark_' name='备注' width='50'>
                        <DBEdit dataField='remark_' />
                    </Column>
                </DBGrid>
                <Block dataSet={this.state.dataOut}>
                    <Line>
                        <Column code='code_' name='代码' width='10' />
                        <Column code='name_' name='名称' width='20' />
                    </Line>
                    <Line>
                        <Column code='remark_' name='备注' width='50' />
                    </Line>
                </Block>
                <button className={styles.operaButton} onClick={this.btnAppend}>添加</button>
                <StatusBar>
                </StatusBar>
            </React.Fragment>
        )
    }

    btnSearch: ModifyOnExecute = (row: DataRow, opera: string) => {
        console.log(opera);
        let query = new QueryService(this.props);
        query.dataIn.head.copyValues(row);
        query.add('select * from db.Account');
        query.open().then(dataOut => {
            this.setState({ ...this.state, dataOut });
        }).catch(dataOut => {
            this.setState({ ...this.state, dataOut, message: dataOut.message })
        })
    }

    btnAppend: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        this.state.dataOut.append();
        this.setState(this.state);
    }

    onRowChanged: OnRowChangedEvent = (row: DataRow, field: string, oldValue: string) => {
        console.log(row, field, oldValue)
        this.setState({ ...this.state });
    }

    onChangedByCode: OnDataRowChangedEvent = (recNo: number, field: string, value: string) => {
        if (field == 'code_') {
            let accName = this.accCodeLists.getAccNameByCode(value);
            if (accName != null) {
                let ds = this.state.dataOut;
                let row = ds.records[recNo - 1];
                row.setValue('name_', accName);
                this.setState(this.state);
            }
        }
    }
}
