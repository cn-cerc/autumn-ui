import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { ColumnIt } from "../rcc/ColumnIt";
import DBEdit from "../rcc/DBEdit";
import DBGrid, { Column, MainRow } from "../rcc/DBGrid";
import SearchPanel from "../rcc/SearchPanel";
import BrandDialog from "./BrandDialog";
import DialogApi from "./DialogApi";
import styles from "./FrmPartPrinciple.css";
import ProductClassDialog from "./ProductClassDialog";
import iconfontCss from "../iconfont/iconfont.css"
import { showMsg } from "./Summer";

type titleType = {
    text: string,
    data?: DataRow,
    isSelect?: boolean,
    showAdd?: boolean
}

type descType = {
    index: number,
    desc: string
}

type FrmPartPrincipleTypeProps = {

}

type FrmPartPrincipleTypeState = {
    titleList: titleType[],
    descList: descType[],
    titleIn: number,
    dataSet1: DataSet,
    dataSet2: DataSet,
    dataSet3: DataSet,
    _dataSet3: DataSet,
    codeSchemeData: DataSet,
    specCodeData: DataSet,
    dataRow: DataRow,
    searchRow: DataRow,
    addRowList: DataRow[],
    code: string,
    specCode: string,
    isNew: boolean,
    isSelect: boolean,
    showLoad: boolean,
    noDesc: boolean,
    loadText: string,
    descListWidth: number,
    descNumber: number,
    descLeft: number
}

export default class FrmPartPrinciple extends React.Component<FrmPartPrincipleTypeProps, FrmPartPrincipleTypeState> {
    private class2: DBEdit;
    private class3: DBEdit;
    private partCode: string = '';
    constructor(props: FrmPartPrincipleTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue('PartSource_', '0');
        this.state = {
            titleList: [{
                text: '大类'
            }],
            descList: [],
            titleIn: 0,
            dataSet1: new DataSet(),
            dataSet2: new DataSet(),
            dataSet3: new DataSet(),
            _dataSet3: new DataSet(),
            codeSchemeData: new DataSet(), // codeScheme
            specCodeData: new DataSet(), // specCodeStr
            dataRow,
            searchRow: new DataRow(),
            addRowList: [],
            code: '',
            specCode: '',
            isNew: false,
            isSelect: false,
            showLoad: false,
            noDesc: false,
            loadText: '系统正在检测中，请稍后...',
            descListWidth: 0,
            descNumber: 0,
            descLeft: 0
        }
    }

    componentWillMount() {
        this.init();
    }

    render(): React.ReactNode {
        return <React.Fragment>
            <div className={styles.stock1}>
                {this.getPageTitle()}
                {this.getTable()}
            </div>
            <div className={styles.stock2}>{this.getPageForm()}</div>
            {this.getLoad()}
        </React.Fragment>
    }

    async init() {
        let dataSet1 = await DialogApi.getCodeClass();
        this.setState({
            dataSet1
        })
    }

    getPageTitle() {
        let titleList: React.ReactNode[] = [];
        let titleList2: React.ReactNode[] = [];
        this.state.titleList.forEach((title: titleType, key: number) => {
            if (key < 2 || this.state.noDesc) {
                titleList.push(
                    <li key={key} className={key == this.state.titleIn ? styles.titleIn : ''} onClick={this.handleClick.bind(this, key)}>{title.text}</li>
                )
            } else {
                titleList2.push(
                    <li key={key} className={key == this.state.titleIn ? styles.titleIn : ''} onClick={this.handleClick.bind(this, key)}>{title.text}</li>
                )
            }
        })
        if (this.state.titleList.length > 2 && !this.state.noDesc) {
            return <ul>
                {titleList}
                <li className={styles.descBox}>
                    <div className={`${styles.iconfont} ${iconfontCss.iconfont} ${iconfontCss.iconPrincipleLeft}`} onClick={this.descListMoveLeft.bind(this)} />
                    <div className={styles.descList}>
                        <ul style={{ 'left': `-${this.state.descLeft}px` }}>
                            {titleList2}
                        </ul>
                    </div>
                    <div className={`${styles.iconfont} ${iconfontCss.iconfont} ${iconfontCss.iconPrincipleRight}`} onClick={this.descListMoveRight.bind(this)} />
                </li>
            </ul>
        } else {
            return <ul>{titleList}</ul>
        }

    }

    getTable() {
        switch (this.state.titleIn) {
            case 0:
                return <DBGrid dataSet={this.state.dataSet1} key={this.state.dataSet1.json}>
                    <ColumnIt></ColumnIt>
                    <Column code='Code_' name='大类代码' width='10'></Column>
                    <Column code='Name_' name='名称' width='20'></Column>
                    <Column code='opera' name='操作' textAlign='center' width='10' customText={(row: DataRow) => {
                        return <span className={styles.link} onClick={this.selectClass.bind(this, row)}>选择</span>
                    }}></Column>
                </DBGrid>
            case 1:
                return <DBGrid dataSet={this.state.dataSet2} key={this.state.dataSet2.json}>
                    <ColumnIt width='10'></ColumnIt>
                    <Column code='ClassCode_' name='大类代码' width='20'></Column>
                    <Column code='Code_' name='类别代码' width='20'></Column>
                    <Column code='Name_' name='类别名称' width='20'></Column>
                    <Column code='Rule_' name='编码规格' width='30'></Column>
                    <Column code='CodeDesc_' name='编码描述' width='40'></Column>
                    <Column code='opera' name='操作' textAlign='center' width='15' customText={(row: DataRow) => {
                        return <span className={styles.link} onClick={this.selectClass2.bind(this, row)}>选择</span>
                    }}></Column>
                </DBGrid>
            default:
                return this.getDescTable()
        }
    }

    getPageForm() {
        return <React.Fragment>
            <ul className={styles.pageForm} key={this.state.dataRow.json}>
                <li className={styles.line100}>
                    <DBEdit dataField='PartCode_' dataName='料号' dataRow={this.state.dataRow} readOnly={true}></DBEdit>
                </li>
                <li className={styles.line50}>
                    <DBEdit dataField='Desc_' dataName='品名' dataRow={this.state.dataRow} readOnly></DBEdit>
                </li>
                <li className={styles.line50}>
                    <DBEdit dataField='EnDesc_' dataName='英文品名' dataRow={this.state.dataRow}></DBEdit>
                </li>
                <li className={styles.line50}>
                    <DBEdit dataField='Spec_' dataName='规格' dataRow={this.state.dataRow} readOnly></DBEdit>
                </li>
                <li className={styles.line50}>
                    <DBEdit dataField='EnSpec_' dataName='英文规格' dataRow={this.state.dataRow}></DBEdit>
                </li>
                <li className={styles.line25}>
                    <DBEdit dataField='Brand_' dataName='品牌' dataRow={this.state.dataRow} readOnly>
                        <BrandDialog isChild={true} inputId='Brand_'></BrandDialog>
                    </DBEdit>
                </li>
                <li className={styles.line25}>
                    <DBEdit dataField='Class1_' dataName='大类' dataRow={this.state.dataRow} onChanged={this.handleChangeClass.bind(this)} readOnly>
                        <ProductClassDialog isChild={true} productClass={""} brand={""} inputId='Class1_,Class2_,Class3_'></ProductClassDialog>
                    </DBEdit>
                </li>
                <li className={styles.line25}>
                    <DBEdit dataField='Class2_' dataName='中类' dataRow={this.state.dataRow} ref={self => this.class2 = self}></DBEdit>
                </li>
                <li className={styles.line25}>
                    <DBEdit dataField='Class3_' dataName='系列' dataRow={this.state.dataRow} ref={self => this.class3 = self}></DBEdit>
                </li>
                <li className={styles.line25}>
                    <DBEdit dataField='Unit_' dataName='单位' dataRow={this.state.dataRow}></DBEdit>
                </li>
                <li className={styles.line25}>
                    <DBEdit dataField='Remark_' dataName='备注' dataRow={this.state.dataRow}></DBEdit>
                </li>
            </ul>
            {this.getPageSubmit()}
        </React.Fragment>
    }

    getDescTable() {
        if (this.state.noDesc) {
            return <div className={styles.noDesc}>暂无可供选择的规格，请维护好对应的编码原则。</div>
        } else if (this.state.titleList[this.state.titleIn - 2].showAdd) {
            return <React.Fragment>
                <div className={styles.addTable}>
                    <form className={styles.inputs} onSubmit={this.addDescSubmit.bind(this)}>
                        <DBEdit dataRow={this.state.addRowList[this.state.titleIn - 2]} dataField='SpecCode_' dataName='代码' autoFocus></DBEdit>
                        <DBEdit dataRow={this.state.addRowList[this.state.titleIn - 2]} dataField='Description_' dataName='描述'></DBEdit>
                        <DBEdit dataRow={this.state.addRowList[this.state.titleIn - 2]} dataField='Remark_' dataName='备注'></DBEdit>
                        <button style={{ 'display': 'none' }}></button>
                    </form>
                    <button onClick={this.addDesc.bind(this)}>添加</button>
                    <button onClick={this.backSelect.bind(this)}>返回选择</button>
                </div>
                <DBGrid dataSet={this.state._dataSet3}>
                    <MainRow dynamicClass={this.dynamicClass.bind(this)}>
                        <ColumnIt width='2'></ColumnIt>
                        <Column code='SpecCode_' name='代码' width='6'></Column>
                        <Column code='Description_' name='描述' width='10'></Column>
                        <Column code='Remark_' name='备注' width='15'></Column>
                    </MainRow>
                </DBGrid>
            </React.Fragment>
        } else {
            return <React.Fragment>
                <div className={styles.searchLine}>
                    <SearchPanel dataRow={this.state.searchRow} onExecute={this.filterDataSet3.bind(this)} key={this.state.searchRow.json}>
                        <DBEdit dataField='Name_' dataName='当前选择' readOnly></DBEdit>
                        <DBEdit dataField='SpecCode_' dataName='规格代码' autoFocus></DBEdit>
                        <DBEdit dataField='Description_' dataName='规格描述'></DBEdit>
                    </SearchPanel>
                    <button onClick={this.showAdd.bind(this)}>新增</button>
                </div>
                <DBGrid dataSet={this.state._dataSet3}>
                    <MainRow dynamicClass={this.dynamicClass.bind(this)}>
                        <ColumnIt width='2'></ColumnIt>
                        <Column code='SpecCode_' name='代码' width='6'></Column>
                        <Column code='Description_' name='描述' width='10'></Column>
                        <Column code='Remark_' name='备注' width='15'></Column>
                        <Column code='opera' name='操作' textAlign='center' width='3' customText={(row: DataRow) => {
                            return <span className={styles.link} onClick={this.selectClass3.bind(this, row)}>选择</span>
                        }}></Column>
                    </MainRow>
                </DBGrid>
            </React.Fragment>
        }
    }

    getPageSubmit() {
        return <div>
            <button onClick={this.handleSubmit.bind(this)} className={this.state.isNew ? '' : styles.disabled}>新增</button>
            <button onClick={this.addDetail.bind(this)} className={this.state.isSelect ? '' : styles.disabled}>选择</button>
        </div>

    }

    dynamicClass(row: DataRow) {
        let recNo = row.dataSet.recNo;
        let className = '';
        if (recNo == this.state.descList[this.state.titleIn - 2].index) {
            className = styles.lineSelect
        }
        return className;
    }

    async handleClick(key: number) {
        if (key > 1)
            this.choseClass3(key);
        else
            this.setState({ titleIn: key });
    }

    async selectClass(row: DataRow) {
        let dataRow = new DataRow();
        dataRow.setValue('PartSource_', '0');
        let dataRow2 = new DataRow();
        dataRow2.setValue('ClassCode_', row.getValue('Code_'))
        let dataSet2 = await DialogApi.getPartPrincipleSearch(dataRow2);
        this.setState({
            titleList: [{
                text: '大类'
            }, {
                text: '中类'
            }],
            titleIn: 1,
            dataSet2,
            dataRow,
            isNew: false,
            isSelect: false
        });
    }

    async selectClass2(row: DataRow) {
        let dataRow = new DataRow();
        let code = row.getString('Code_')
        dataRow.setValue('Code_', code);
        let codeSchemeData = await DialogApi.getPartPrincipleDownload(dataRow);
        if (codeSchemeData.size) {
            this.state.dataRow.setValue('Brand_', codeSchemeData.head.getValue('Brand_'));
            this.state.dataRow.setValue('Class1_', codeSchemeData.head.getValue('Class1_'));
            this.state.dataRow.setValue('Class2_', codeSchemeData.head.getValue('Class2_'));
            this.state.dataRow.setValue('Class3_', codeSchemeData.head.getValue('Class3_'));
            this.state.dataRow.setValue('Unit_', codeSchemeData.head.getValue('Unit_'));
            this.state.dataRow.setValue('PartCode_', '');
            this.state.dataRow.setValue('Desc_', '');
            this.state.dataRow.setValue('Spec_', '');
            let titleList: titleType[] = [{
                text: '大类'
            }, {
                text: '中类'
            }];
            let descList = [];
            let addRowList = [];
            let dataSet3: DataSet;
            let _dataSet3 = new DataSet();
            let specCode = '';
            let isFirst = false;
            codeSchemeData.first();
            while (codeSchemeData.fetch()) {
                if (codeSchemeData.getDouble('Type_') == 0) {
                    titleList.push({
                        text: codeSchemeData.getString('SpecName_') || '未知',
                        data: codeSchemeData.current,
                        isSelect: false,
                        showAdd: false
                    })
                    addRowList.push(new DataRow());
                    descList.push({
                        index: 0,
                        desc: codeSchemeData.getString('SpecName_')
                    });
                    if (!isFirst) {
                        isFirst = true;
                        let dataIn = new DataRow();
                        dataIn.setValue('Code_', codeSchemeData.getString('SpecCode_'));
                        dataIn.setValue('Select', codeSchemeData.getString('SpecName_'));
                        dataIn.setValue('specCode', codeSchemeData.getString('SpecCode_'));
                        specCode = codeSchemeData.getString('SpecCode_')
                        dataSet3 = await DialogApi.getPartSpecDownload(dataIn);
                        _dataSet3.appendDataSet(dataSet3);
                    }
                }
            }
            let searchRow = new DataRow();
            searchRow.setValue('Name_', titleList[2].text);
            this.setState({
                titleList,
                descList,
                addRowList,
                titleIn: 2,
                dataSet3,
                _dataSet3,
                searchRow,
                codeSchemeData,
                specCode,
                code,
                isNew: false,
                isSelect: false,
                descNumber: 0,
                descLeft: 0,
                noDesc: false
            }, () => {
                let descListDom: HTMLDivElement = document.querySelector(`.${styles.descList}`);
                let descListWidth = descListDom ? descListDom.offsetWidth : 0;
                this.setState({ descListWidth });
            })
        } else {
            this.setState({
                titleList: [{
                    text: '大类'
                }, {
                    text: '中类'
                }, {
                    text: '无规格'
                }],
                addRowList: [],
                titleIn: 2,
                noDesc: true
            })
        }
    }

    async choseClass3(key: number, specCodeData?: DataSet) {
        let dataRow = this.state.titleList[key].data;
        let dataIn = new DataRow();
        let specCode = dataRow.getValue('SpecCode_');
        dataIn.setValue('Code_', specCode);
        dataIn.setValue('Select', dataRow.getString('SpecName_'));
        dataIn.setValue('specCode', specCode);
        let dataSet3 = await DialogApi.getPartSpecDownload(dataIn);
        let _dataSet3 = new DataSet();
        _dataSet3.appendDataSet(dataSet3);
        let searchRow = new DataRow();
        searchRow.setValue('Name_', this.state.titleList[key].text);

        let descLeft = 0;
        let descNumber = this.state.descNumber;
        let hasLeft = 0;
        let shouldLeft = 0;
        let descList: NodeListOf<HTMLLIElement> = document.querySelectorAll(`.${styles.descList} li`);
        for (let i = 0; i < this.state.titleList.length - 2; i++) {
            let descDom: HTMLLIElement = descList[i];
            if (i < this.state.descNumber) {
                hasLeft += descDom.offsetWidth;
            }
            if (i <= key - 2) {
                shouldLeft += descDom.offsetWidth;
            }
        }
        if (shouldLeft - hasLeft > this.state.descListWidth) {
            let resertWidth = 0;
            descNumber++;
            for (let j = this.state.descNumber; j < this.state.titleList.length - 2; j++) {
                let descDom2: HTMLLIElement = descList[j];
                resertWidth += descDom2.offsetWidth;
                if (resertWidth < shouldLeft - hasLeft - this.state.descListWidth)
                    descNumber++;
            }
        }
        descList.forEach((descDom: HTMLLIElement, index: number) => {
            if (index < descNumber) {
                descLeft += descDom.offsetWidth;
            }
        });
        if (descLeft != this.state.descLeft) {
            $(`.${styles.descList} ul`).stop().animate({
                'left': `-${descLeft}px`
            }, 200, () => {
                this.setState({
                    titleIn: key,
                    descNumber,
                    dataSet3,
                    _dataSet3,
                    searchRow,
                    specCode,
                    specCodeData: specCodeData || this.state.specCodeData
                })
            })
        } else {
            this.setState({
                titleIn: key,
                descNumber,
                dataSet3,
                _dataSet3,
                searchRow,
                specCode,
                specCodeData: specCodeData || this.state.specCodeData
            })
        }
    }

    async selectClass3(row: DataRow) {
        let partCode = '';
        let spec = '';
        let desc = '';
        let recNo = 0;
        for (let i = 0; i < this.state.dataSet3.records.length; i++) {
            if (this.state.dataSet3.records[i].getDouble('UID_') == row.getDouble('UID_')) {
                recNo = i + 1;
                break;
            }
        }
        this.state.descList[this.state.titleIn - 2].index = recNo;
        let description = row.getString('Description_');
        this.state.titleList[this.state.titleIn].text = `${this.state.descList[this.state.titleIn - 2].desc}(${description})`;
        let liList: NodeListOf<HTMLLIElement> = document.querySelectorAll(`.${styles.descList} li`);
        liList[this.state.titleIn - 2].innerText = `${this.state.descList[this.state.titleIn - 2].desc}(${description})`;
        this.state.titleList[this.state.titleIn].isSelect = true;
        let ds1 = new DataSet();
        ds1.appendDataSet(this.state.codeSchemeData);
        let ds2 = new DataSet();
        if (this.state.specCodeData.size) {
            ds2.setJson(this.state.specCodeData.json)
        }
        if (!ds2.locate("specCode", this.state.specCode)) {
            ds2.append();
        } else {
            ds2.edit();
        }
        ds2.setValue('specCode', this.state.specCode)
        ds2.setValue("specName", row.getString('SpecCode_') + "`" + row.getString('Description_'));
        while (ds1.fetch()) {
            if (ds1.getDouble('Type_') == 1 && ds1.getBoolean('IsPartCode_')) {
                partCode = ds1.getString("SpecCode_");
                break;
            }
        }
        ds1.first();
        ds2.first();
        while (ds1.fetch()) {
            if (ds1.getBoolean("IsPartCode_")) {
                if (ds2.locate("specCode", ds1.getString("SpecCode_"))) {
                    partCode += ds2.getString("specName").split("`")[0];
                }
                if (ds1.getDouble("Type_") == 2) {
                    partCode += "-";
                }
                if (ds1.getDouble("Type_") == 3) {
                    let lastNo = ds1.head.getInt("LastNo_") + 1;
                    let flowLen = ds1.head.getInt("FlowLen_");
                    if (flowLen > 0) {
                        let str = "000000000" + lastNo;
                        partCode += str.substring(str.length - flowLen);
                    }
                }
            }
        }
        // 生成品名
        ds1.setSort("SpecNameIt_");
        ds1.first();
        while (ds1.fetch()) {
            if (ds1.getDouble("Type_") == 1 && ds1.getBoolean("IsDescName_")) {
                desc += ds1.getString("SpecName_") + ",";
            }
        }
        desc = desc.substring(0, desc.length - 1);
        ds1.first();
        ds2.first();
        while (ds1.fetch()) {
            if (ds1.getBoolean("IsDescName_")) {
                if (ds2.locate("specCode", ds1.getString("SpecCode_"))) {
                    if (ds2.getString("specName").split("`").length > 1) {
                        desc += ds2.getString("specName").split("`")[1] + ",";
                    }
                }
            }
        }
        // 生成规格
        ds2.first();
        ds1.first();
        while (ds1.fetch()) {
            if (ds1.getBoolean("IsSpecName_")) {
                if (ds2.locate("specCode", ds1.getString("SpecCode_"))) {
                    if (ds2.getString("specName").split("`").length > 1) {
                        spec += ds2.getString("specName").split("`")[1] + ",";
                    }
                }
            }
        }
        spec = spec.substring(0, spec.length - 1);
        let specCodeData = new DataSet();
        specCodeData.appendDataSet(ds2);
        this.state.dataRow.setValue('PartCode_', partCode);
        this.state.dataRow.setValue('Desc_', desc);
        this.state.dataRow.setValue('Spec_', spec);
        this.initButton();
        if (this.state.titleIn < this.state.titleList.length - 1) {
            let key = this.state.titleIn + 1;
            this.choseClass3(key, specCodeData);
        } else {
            this.setState({
                specCodeData
            })
        }
    }

    filterDataSet3() {
        this.setState({
            showLoad: true
        })
        let _dataSet3 = new DataSet();
        _dataSet3.appendDataSet(this.state.dataSet3);
        _dataSet3.first();
        let sepcCode = this.state.searchRow.getString('SpecCode_');
        let description = this.state.searchRow.getString('Description_');
        while (_dataSet3.fetch()) {
            if (sepcCode) {
                if (_dataSet3.getString('SpecCode_').indexOf(sepcCode) < 0) {
                    _dataSet3.delete();
                    continue;
                }
            }
            if (description) {
                if (_dataSet3.getString('Description_').indexOf(description) < 0) {
                    _dataSet3.delete();
                    continue;
                }
            }
        }
        this.setState({
            _dataSet3,
            showLoad: false
        })
    }

    handleChangeClass() {
        this.class2.setState(this.class2.state);
        this.class3.setState(this.class3.state);
    }

    async initButton() {
        let isAllSelect = true;
        this.state.titleList.forEach((title: titleType) => {
            if ('isSelect' in title && title.isSelect == false)
                isAllSelect = false;
        })
        if (isAllSelect) {
            this.setState({ showLoad: true });
            let headIn = new DataRow();
            headIn.setValue('Brand_', this.state.dataRow.getString('Brand_'));
            headIn.setValue('Desc_', this.state.dataRow.getString('Desc_'));
            headIn.setValue('Spec_', this.state.dataRow.getString('Spec_'));
            let dataOut = await DialogApi.existsPartInfo(headIn);
            if (dataOut.state > 0) {
                this.partCode = dataOut.head.getString('Code_');
                this.setState({
                    isSelect: true,
                    showLoad: false,
                    isNew: false
                })
            } else {
                this.setState({
                    isNew: true,
                    isSelect: false,
                    showLoad: false
                })
            }
        }
    }

    async handleSubmit() {
        if (!this.state.isNew)
            return;
        let ds = new DataSet();
        ds.setJson(this.state.codeSchemeData.json);
        if (this.state.dataRow.getValue('PartCode_').length != ds.head.getDouble('CodeLen_')) {
            showMsg('生成的编码长度不符合要求，请检查！');
            return;
        } else if (!this.state.dataRow.getBoolean('Brand_')) {
            showMsg('品牌不允许为空！');
            return;
        } else if (!this.state.dataRow.getBoolean('Class1_')) {
            showMsg('大类不允许为空！');
            return;
        } else {
            this.setState({
                showLoad: true
            })
            let dataIn = new DataRow();
            let partCode = this.state.dataRow.getString('PartCode_');
            let desc = this.state.dataRow.getString('Desc_');
            let spec = this.state.dataRow.getString('Spec_');
            let enDesc = this.state.dataRow.getString('EnDesc_');
            let enSpec = this.state.dataRow.getString('EnSpec_');
            let brand = this.state.dataRow.getString('Brand_');
            let class1 = this.state.dataRow.getString('Class1_');
            let class2 = this.state.dataRow.getString('Class2_');
            let class3 = this.state.dataRow.getString('Class3_');
            let unit = this.state.dataRow.getString('Unit_');
            let supCode = this.state.dataRow.getString('SupCode_');
            let remark = this.state.dataRow.getString('Remark_');
            dataIn.setValue("FrmPartPrinciple", true);
            dataIn.setValue("Code_", partCode);
            dataIn.setValue("Desc_", desc);
            dataIn.setValue("Spec_", spec);
            dataIn.setValue("EnDesc_", enDesc);
            dataIn.setValue("EnSpec_", enSpec);
            dataIn.setValue("Classify_", 0);
            dataIn.setValue("InUP_", 0);
            dataIn.setValue("OutUP_", 0);
            dataIn.setValue("OutUP2_", 0);
            dataIn.setValue("ListUP_", 0);
            dataIn.setValue("VipUP_", 0);
            dataIn.setValue("Brand_", brand);
            dataIn.setValue("Class1_", class1);
            dataIn.setValue("Class2_", class2);
            dataIn.setValue("Class3_", class3);
            dataIn.setValue("Unit_", unit);
            dataIn.setValue("SupCode_", supCode);
            dataIn.setValue("Remark_", remark);
            dataIn.setValue("BoxUnit_", ds.head.getString('Unit1_'));
            dataIn.setValue("BoxNum_", ds.head.getString('Rate1_'));
            let dataOut = await DialogApi.postPartStock(dataIn);
            if (dataOut.state < 1) {
                showMsg(`生成失败！原因：${dataOut.message}`)
            } else {
                // 回写大类流水号
                let dataRow = new DataRow();
                dataRow.setValue("PartCode_", partCode);
                dataRow.setValue("Brand_", brand);
                dataRow.setValue("Class1_", class1);
                dataRow.setValue("Class2_", class2);
                dataRow.setValue("Class3_", class3);
                dataRow.setValue("Unit_", unit);
                dataRow.setValue("Code_", this.state.code);
                dataRow.setValue("ClassCode_", ds.head.getString('ClassCode_'));
                let ds2 = await DialogApi.updatePartPrinciple(dataRow);
                if (ds2.state < 1) {
                    showMsg(`生成失败！原因：${ds2.message}`)
                } else {
                    showMsg(`已存入商品资料！料号：<a href="TFrmPartInfo.modify?partCode=%${partCode}" target="_blank">${partCode}</a>`);
                    this.partCode = partCode;
                    this.addDetail();
                }
            }
            this.setState({
                showLoad: false
            })
        }
    }

    addDetail() {
        if (!this.state.isSelect && !this.state.isNew)
            return;
        this.setState({
            showLoad: true
        })
        fetch(`TWebShopping.addDetail?num=1&tb=OD&products=${this.partCode}&spareStatus=false`).then(response => response.json()).then((json) => {
            if (json.ok) {
                document.querySelector('.header-center-right').innerHTML = json.menu;
                let shopNum = document.querySelector('[role=shopNums]') as HTMLSpanElement;
                shopNum.innerText = json.num;
                shopNum.classList.add('shopNums');
                showMsg(`料号：${this.partCode}已成功添加至销售订单`)
                let href = json.menu.match('TFrmTranOD.modify[?]tbNo=[A-z]+[0-9]+');
                location.href = href;
            } else {
                showMsg(json.msg)
            }
            this.setState({
                showLoad: false
            })
        })
    }

    getLoad() {
        if (this.state.showLoad) {
            return (
                <div className={styles.load}>
                    <img src='https://www.diteng.site/public/images/loading.gif' />
                    <span>{this.state.loadText}</span>
                </div>
            )
        }
    }

    descListMoveLeft() {
        let allWidth = 0;
        let descLeft = 0;
        let descNumber = this.state.descNumber;
        let descList: NodeListOf<HTMLLIElement> = document.querySelectorAll(`.${styles.descList} li`);
        descList.forEach((descDom: HTMLLIElement, index: number) => {
            allWidth += descDom.offsetWidth;
            if (index < descNumber - 1) {
                descLeft += descDom.offsetWidth;
            }
        });
        if (allWidth > this.state.descListWidth && descNumber > 0) {
            descNumber--;
            $(`.${styles.descList} ul`).stop().animate({
                'left': `-${descLeft}px`
            }, 200, () => {
                this.setState({
                    descLeft,
                    descNumber
                })
            })
        }
    }

    descListMoveRight() {
        let allWidth = 0;
        let descLeft = 0;
        let descNumber = this.state.descNumber;
        let endIndex = 0;
        let bool = false;
        let descList: NodeListOf<HTMLLIElement> = document.querySelectorAll(`.${styles.descList} li`);
        for (let i = descList.length - 1; i > -1; i--) {
            let descDom: HTMLLIElement = descList[i];
            allWidth += descDom.offsetWidth;
            if (allWidth >= this.state.descListWidth && !bool) {
                bool = true;
                endIndex = i + 1;
            }
        }
        descList.forEach((descDom: HTMLLIElement, index: number) => {
            allWidth += descDom.offsetWidth;
            if (index < descNumber + 1) {
                descLeft += descDom.offsetWidth;
            }
        });
        if (allWidth > this.state.descListWidth && descNumber < endIndex) {
            descNumber++;
            $(`.${styles.descList} ul`).stop().animate({
                'left': `-${descLeft}px`
            }, 200, () => {
                this.setState({
                    descLeft,
                    descNumber
                })
            })
        }
    }

    showAdd() {
        this.state.titleList[this.state.titleIn - 2].showAdd = true;
        this.setState(this.state);
    }

    addDescSubmit(sender: any) {
        sender.preventDefault();
        this.addDesc();
    }

    async addDesc() {
        // this.setState({
        //     showLoad: true,
        //     loadText: '系统正在添加中，请稍后...'
        // });
        let dataIn = new DataRow();
        dataIn.setValue('Code_', this.state.specCode);
        let ds = await DialogApi.getPartSpecDownload(dataIn);
        if (ds.state < 1) {
            showMsg(ds.message);
            return;
        }
        ds.setSort('It_ DESC');
        ds.first();
        let it = 1;
        it += ds.getDouble('It_');
        ds.append();
        ds.setValue("It_", it);
        ds.setValue("SpecCode_", this.state.addRowList[this.state.titleIn - 2].getString('SpecCode_'));
        ds.setValue("Description_", this.state.addRowList[this.state.titleIn - 2].getString('Description_'));
        ds.setValue("Remark_", this.state.addRowList[this.state.titleIn - 2].getString('Remark_'));
        ds.first();
        let dataSet = new DataSet();
        while (ds.fetch()) {
            dataSet.append();
            dataSet.copyRecord(ds.current);
        }
        let ds2 = new DataSet();
        ds2.head.copyValues(ds.head);
        ds2.appendDataSet(dataSet);
        let dataOut = await DialogApi.getPartSpecModify(ds2);
        if (dataOut.state > 0) {
            showMsg('添加成功!');
            this.state.titleList[this.state.titleIn - 2].showAdd = false;
            this.state.addRowList[this.state.titleIn - 2] = new DataRow();
            this.setState(this.state, () => {
                this.choseClass3(this.state.titleIn);
            })
        } else
            showMsg(dataOut.message);
    }

    backSelect() {
        this.state.titleList[this.state.titleIn - 2].showAdd = false;
        this.setState(this.state);
    }
}