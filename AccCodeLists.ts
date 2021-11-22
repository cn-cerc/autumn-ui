import DataSet from "./src/db/DataSet";

export default class AccCodeLists {
    private _dataSet: DataSet;

    constructor() {
        let dataSet = new DataSet();
        dataSet.append().setValue('code_', '1001').setValue('name_', '固定资产');
        dataSet.append().setValue('code_', '1001-001').setValue('name_', '固定资产-办公设备');
        dataSet.append().setValue('code_', '1002').setValue('name_', '流动资产');
        dataSet.append().setValue('code_', '1002-001').setValue('name_', '流动资产-现金');
        dataSet.append().setValue('code_', '1002-002').setValue('name_', '流动资产-银行存款');
        dataSet.append().setValue('code_', '1002-003').setValue('name_', '流动资产-银行存款');
        dataSet.append().setValue('code_', '1002-004').setValue('name_', '流动资产-银行存款');
        dataSet.append().setValue('code_', '1002-005').setValue('name_', '流动资产-银行存款');
        dataSet.append().setValue('code_', '1002-006').setValue('name_', '流动资产-银行存款');
        dataSet.append().setValue('code_', '1002-007').setValue('name_', '流动资产-银行存款');
        dataSet.append().setValue('code_', '1002-008').setValue('name_', '流动资产-银行存款');
        dataSet.append().setValue('code_', '1002-009').setValue('name_', '流动资产-银行存款');
        dataSet.append().setValue('code_', '1002-010').setValue('name_', '流动资产-银行存款');
        this._dataSet = dataSet;
    }

    get dataSet(): DataSet { return this._dataSet }


    getAccNameByCode(accCode: string) {
        return this._dataSet.locate('code_', accCode) ? this._dataSet.getString('name_') : null
    }

}