import React from "react";
import DataRow from "../src/db/DataRow";
import DataSet from "../src/db/DataSet";
import QueryService from "../src/db/QueryService";
import TButton from "../src/rcc/TButton";
import TChildForm from "../src/rcc/TChildForm";
import DBGrid1, { StringField } from "../src/rcc/DBGrid1";
import TSearchPanel from "../src/rcc/SearchPanel1";
import MainMenu from "../src/diteng/MainMenu";
import MenuItem from "../src/rcc/MenuItem";

type stateType = { dataSet: DataSet, record: DataRow }

export default class FrmDept extends React.Component<any, stateType> {

    constructor(props: any) {
        super(props);
        this.state = { dataSet: new DataSet(), record: new DataRow() };
    }

    render() {
        return <TChildForm>
            <MainMenu>
                <MenuItem code="mnuOpen" name="打开文件" />
                <MenuItem code="mnuSave" name="保存文件" />
            </MainMenu>
            <TSearchPanel dataSource={this.state.record}>
                <StringField code="code_" name="代码" />
                <StringField code="name_" name="姓名" />
                <TButton onClick={this.btnExecQuery}>查询</TButton>
            </TSearchPanel>
            <DBGrid1 dataSource={this.state.dataSet}>
                <StringField code="code_" name="代码" />
                <StringField code="name_" name="姓名" />
                <StringField code="remark_" name="备注" />
            </DBGrid1>
        </TChildForm >
    }

    btnExecQuery(sender: any) {
        let query = new QueryService(null);
        query.add('select * from db.dept');
        query.open().then(dataSet => this.setState({ dataSet }));
    }
}