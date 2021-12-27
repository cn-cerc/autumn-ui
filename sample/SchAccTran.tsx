import React, { MouseEventHandler } from "react";
import AccCodeLists from "../AccCodeLists";
import DataRow from "../src/db/DataRow";
import DataSet from "../src/db/DataSet";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "../src/diteng/CustomForm";
import MainMenu from "../src/diteng/MainMenu";
import Block, { Line } from "../src/rcc/Block";
import DBEdit from "../src/rcc/DBEdit";
import DBGrid, { Column } from "../src/rcc/DBGrid";
import MenuItem from "../src/rcc/MenuItem";
import SearchPanel, { SearchPanelOnExecute } from "../src/rcc/SearchPanel";
import StatusBar from "../src/rcc/StatusBar";
import ToolPanel from "../src/rcc/ToolPanel";
import styles from "./SchAccTran.css";

type stateType = {
    headIn: DataRow;
    dataOut: DataSet;
    message: string;
} & Partial<CustomFormStateType>

export default class SchAccTran extends CustomForm<CustomFormPropsType, stateType> {
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
        return '会计凭证维护'
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
                <SearchPanel dataRow={this.state.headIn} onExecute={this.btnSearch}>
                    <DBEdit dataField='code' dataName='凭证编号' >
                    </DBEdit>
                    <DBEdit dataField='tbDate' dataName='凭证日期' >
                    </DBEdit>
                    <DBEdit dataField='name' dataName='凭证摘要' ></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataOut} readOnly>
                    <Column code='code_' name='会计科目' width='10'>
                    </Column>
                    <Column code='name_' name='科目名称' width='20' >
                    </Column>
                    <Column code='subject_' name='摘要' width='30' >
                    </Column>
                    <Column code='drAmount_' name='借方金额' width='10' >
                    </Column>
                    <Column code='crAmount_' name='贷方金额' width='10' >
                    </Column>
                    <Column code='remark_' name='备注' width='50' >
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
                <button className={styles.operaButton} onClick={this.btnAppend}>创建新的凭证</button>
                <StatusBar>
                </StatusBar>
            </React.Fragment>
        )
    }

    btnSearch: SearchPanelOnExecute = (row: DataRow) => {
        console.log(row.json);
    }

    btnAppend: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        window.location.href = "FrmAccTran";
    }
}