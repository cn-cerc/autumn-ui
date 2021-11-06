import React from "react";
import DataRow from "../src/db/DataRow";
import DataSet from "../src/db/DataSet";
import QueryService from "../src/db/QueryService";
import TButton from "../src/ext/TButton";
import TChildForm from "../src/ext/TChildForm";
import TDBGrid from "../src/ext/TDBGrid";
import MainMenu from "../src/ext/MainMenu";
import TMenuItem from "../src/ext/MenuItem";
import TSearchPanel from "../src/ext/TSearchPanel";
import TStringField from "../src/ext/TStringField";

type stateType = { dataSet: DataSet, record: DataRow }

export default class FrmDept extends React.Component<any, stateType> {

    constructor(props: any) {
        super(props);
        this.state = { dataSet: new DataSet(), record: new DataRow() };
    }

    render() {
        return <TChildForm>
            <MainMenu>
                <TMenuItem id="mnuOpen" name="打开文件" />
                <TMenuItem id="mnuSave" name="保存文件" />
            </MainMenu>
            <TSearchPanel dataSource={this.state.record}>
                <TStringField code="code_" name="代码" />
                <TStringField code="name_" name="姓名" />
                <TButton onClick={this.btnExecQuery}>查询</TButton>
            </TSearchPanel>
            <TDBGrid dataSource={this.state.dataSet}>
                <TStringField code="code_" name="代码" />
                <TStringField code="name_" name="姓名" />
                <TStringField code="remark_" name="备注" />
            </TDBGrid>
        </TChildForm >
    }

    btnExecQuery(sender: any) {
        let query = new QueryService(null);
        query.add('select * from db.dept');
        query.open().then(dataSet => this.setState({ dataSet }));
    }
}
