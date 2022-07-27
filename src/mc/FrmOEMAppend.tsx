import { Column, ColumnIt, DataRow, DataSet, DBDrop, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import ProductClassDialog from "../dialog/ProductClassDialog";
import ImageConfig from "../static/ImageConfig";
import StaticFile from "../static/StaticFile";
import { showMsg } from "../tool/Summer";
import styles from "./FrmOEMAppend.css";

type FrmOEMAppendTypeProps = {
    showPartImage: boolean,
    avaiStockOption: boolean,
    showPartDefaultCW: boolean,
    tbNo: string,
    cusCode: string
}

export type configType = {
    type: number,
    name: string,
    remark: string,
    isSpec: boolean,
    code: string,
    options?: Map<string, string>
}

type FrmOEMAppendTypeState = {
    titleIn: number,
    titleList: string[],
    modelRow: DataRow,
    modelData: DataSet,
    modelDetail: DataRow,
    configData: configType[],
    configRow: DataRow,
    modelCode: string,
    showLoad: boolean,
    loadText: string
}

export default class FrmOEMAppend extends React.Component<FrmOEMAppendTypeProps, FrmOEMAppendTypeState> {
    constructor(props: FrmOEMAppendTypeProps) {
        super(props);
        let modelRow = new DataRow();
        modelRow.setValue('MaxRecord_', 20);
        // 只查询型号商品
        modelRow.setValue('Assortment', '1');
        this.state = {
            titleIn: 0,
            titleList: ['型号'],
            modelRow,
            modelData: new DataSet(),
            modelDetail: new DataRow(),
            configData: [],
            configRow: new DataRow(),
            modelCode: '',
            showLoad: false,
            loadText: '系统正在查询中，请稍后...'
        }
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            {this.getPageTitle()}
            {this.getPageContent()}
            {this.getLoad()}
        </div>
    }

    componentWillMount() {
        this.modelSearch();
    }

    async modelSearch() {
        this.setState({
            showLoad: true,
            loadText: '系统正在查询中，请稍后...'
        })
        let headIn = new DataRow();
        let classes = this.state.modelRow.getString('Classes');
        if (classes) {
            let partClass = classes.split('->');
            if (partClass.length > 0) {
                headIn.setValue("Class1_", partClass[0]);
            }
            if (partClass.length > 1) {
                headIn.setValue("Class2_", partClass[1]);
            }
            if (partClass.length > 2) {
                headIn.setValue("Class3_", partClass[2]);
            }
        }
        headIn.setValue('SearchText_', this.state.modelRow.getString('SearchText_'));
        headIn.setValue('MaxRecord_', this.state.modelRow.getString('MaxRecord_'));
        headIn.setValue('Assortment', this.state.modelRow.getString('Assortment'));
        let modelData = await DitengApi.getPartStockDownload(headIn);
        this.setState({
            modelData,
            showLoad: false
        })
    }

    getPageTitle() {
        let titleList = this.state.titleList.map((title: string, index: number) => {
            return <li key={index} onClick={this.setTitleIn.bind(this, index)} className={index == this.state.titleIn ? styles.titleIn : ''}>{title}</li>
        });
        return <ul className={styles.title}>{titleList}</ul>
    }

    getPageContent() {
        let pageContent;
        switch (this.state.titleIn) {
            case 0:
                let ColumnList = [];
                ColumnList.push(<Column code='Brand_' name='品牌' width='6' key='Brand_'></Column>);
                if (this.props.showPartImage) {
                    ColumnList.push(<Column code='ImageUrl_' name='商品图片' width='5' key='ImageUrl_' customText={(row: DataRow) => {
                        let imageUrl = row.getString('ImageUrl_');
                        if (imageUrl) {
                            return <img src={imageUrl} width='100' height='100' />
                        } else {
                            return <span></span>
                        }
                    }}></Column>);
                }
                ColumnList.push(<Column code='Code_' name='品名规格' width='12' key='Code_' customText={(row: DataRow) => {
                    let html = [];
                    let readmeUrl = row.getString('ReadmeUrl_');
                    if (readmeUrl != "") {
                        html.push(<a href={`javascript:openIE("${readmeUrl}")`}><img src={StaticFile.getImage(ImageConfig.TAOBAO)} /></a>)
                    }
                    let href = `TFrmTranSP.productDetail?partCode${row.getString('Code_')}&tb=BC&cusCode=${this.props.cusCode}`
                    let desc = row.getString('Desc_');
                    let desc_ = [];
                    let spec = row.getString('Spec_');
                    let spec_;
                    if (desc) {
                        spec_ = <span style={{ 'color': '#666' }}>{spec}</span>
                    }
                    if (row.getBoolean('LowerShelf_')) {
                        desc_.unshift(<span style={{ 'border': '1px solid red', 'color': 'red', 'padding': '0px 0.125em', 'marginRight': '0.25em' }} key='span1'>下架</span>)
                    }
                    if (row.getInt('sales_') > 0 || row.getString('SPNo_') != "") {
                        desc_.unshift(<span style={{ 'border': '1px solid red', 'color': 'red', 'padding': '0px 0.125em', 'marginRight': '0.25em' }} key='span2'>促</span>)
                    }
                    if (row.getInt('Classify_') > 0) {
                        href += `&action=TFrmTranOD.selectProduct`;
                        let name = '';
                        if (row.getInt('Classify_') == 1)
                            name = '型号'
                        else if (row.getInt('Classify_') == 2)
                            name = '子项';
                        desc_.unshift(<span style={{ 'border': '1px solid red', 'color': 'red', 'padding': '0px 0.125em', 'marginRight': '0.25em' }} key='span3'>{name}</span>)
                    }
                    if (row.getInt('BomLevel_') > 0) {
                        desc_.unshift(<span style={{ 'border': '1px solid red', 'color': 'red', 'padding': '0px 0.125em', 'marginRight': '0.25em' }} key='span4'>制</span>)
                    }
                    desc_.push(<span key='desc'>{desc}</span>)
                    return <React.Fragment><span>{desc_} {spec_}</span> </React.Fragment>
                }}></Column>);
                ColumnList.push(<Column code='Unit_' name='单位' width='3' key='Unit_'></Column>)
                let stockName = this.props.avaiStockOption ? '可用库存' : '库存量';
                ColumnList.push(<Column code='Stock_' name={stockName} width='3' key='Stock_'></Column>)
                ColumnList.push(<Column code='GoodUP_' name='标准价' width='3' key='GoodUP_'></Column>)
                ColumnList.push(<Column code='BoxUnit_' name='包装' width='3' key='BoxUnit_'></Column>)
                ColumnList.push(<Column code='BoxNum_' name='包装量' width='3' key='BoxNum_'></Column>)
                if (this.props.showPartDefaultCW)
                    ColumnList.push(<Column code='DefaultCW_' name='储位' width='3'></Column>)
                pageContent = <React.Fragment>
                    <SearchPanel dataRow={this.state.modelRow} onExecute={this.modelSearch.bind(this)}>
                        <DBEdit dataName='查询条件' dataField='SearchText_'></DBEdit>
                        <DBEdit dataName='商品类别' dataField='Classes' readOnly>
                            <ProductClassDialog inputId='Classes' isChild={true} productClass={this.state.modelRow.getString('Classes')} brand=''></ProductClassDialog>
                        </DBEdit>
                        <DBEdit dataName='载入笔数' dataField='MaxRecord_'></DBEdit>
                    </SearchPanel>
                    <DBGrid dataSet={this.state.modelData}>
                        <ColumnIt></ColumnIt>
                        {ColumnList}
                        <Column code='opera' name='操作' width='3' textAlign='center' customText={(row: DataRow) => {
                            return <span role='auiOpera' onClick={this.selectModle.bind(this, row)}>选择</span>
                        }}></Column>
                    </DBGrid>
                </React.Fragment>;
                break;
            case 1:
                pageContent = <React.Fragment>
                    <div className={styles.module1}>
                        <DBEdit dataRow={this.state.modelDetail} dataName='商品编号' dataField='Code_' readOnly></DBEdit>
                        <DBEdit dataRow={this.state.modelDetail} dataName='商品品牌' dataField='Brand_' readOnly></DBEdit>
                        <DBEdit dataRow={this.state.modelDetail} dataName='商品大类' dataField='Class1_' readOnly></DBEdit>
                        <DBEdit dataRow={this.state.modelDetail} dataName='商品中类' dataField='Class2_' readOnly></DBEdit>
                        <DBEdit dataRow={this.state.modelDetail} dataName='商品系列' dataField='Class3_' readOnly></DBEdit>
                        <DBEdit dataRow={this.state.modelDetail} dataName='商品品名' dataField='Desc_' readOnly></DBEdit>
                        <DBEdit dataRow={this.state.modelDetail} dataName='商品规格' dataField='Spec_' readOnly></DBEdit>
                        <DBEdit dataRow={this.state.modelDetail} dataName='商品单位' dataField='Unit_' readOnly></DBEdit>
                        <DBEdit dataRow={this.state.modelDetail} dataName='包装单位' dataField='BoxUnit_' readOnly></DBEdit>
                        <DBEdit dataRow={this.state.modelDetail} dataName='单位包装量' dataField='BoxNum' readOnly></DBEdit>
                    </div>
                    <div className={styles.module2}>
                        {this.getPageInput()}
                    </div>
                    <div className={styles.module3}>
                        <button onClick={this.handleAdd.bind(this)}>新增</button>
                    </div>
                </React.Fragment>
                break;
        }
        return pageContent;
    }

    getPageInput() {
        let inputList = this.state.configData.map((config: configType, index: number) => {
            let text = '';
            if (config.isSpec)
                text = '*';
            if (config.type == 1) {
                return <div className={styles.specLine} key={index}>
                    <span>{text}</span><DBEdit dataName={config.name} dataField={config.name} dataRow={this.state.configRow}></DBEdit>
                </div>
            } else {
                return <div className={styles.specLine} key={index}>
                    <span>{text}</span><DBDrop dataName={config.name} dataField={config.name} options={config.options} dataRow={this.state.configRow}></DBDrop>
                </div>
            }
        })
        return inputList;
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

    setTitleIn(index: number) {
        if (index != this.state.titleIn)
            this.setState({
                titleIn: index
            })
    }

    async selectModle(row: DataRow) {
        this.setState({
            showLoad: true,
            loadText: '系统正在生成配置项，请稍后...'
        })
        let modelCode = row.getValue('Code_');
        let partHeadIn = new DataRow();
        partHeadIn.setValue('Code_', modelCode);
        let ds = await DitengApi.getPartDownload(partHeadIn);
        let modelDetail = new DataRow();
        ds.first();
        modelDetail.copyValues(ds.current);
        let dataIn = new DataRow();
        dataIn.setValue('ModelCode_', modelCode);
        let ds2 = await DitengApi.getModelConfigSearch(dataIn);
        let configData: configType[] = [];
        ds2.first();
        while (ds2.fetch()) {
            if (ds2.getDouble('Type_') === 0) {
                let head = new DataRow();
                head.setValue('ModelCode_', ds2.getString('ModelCode_'));
                head.setValue('Code_', ds2.getString('Code_'));
                let ds3 = await DitengApi.getModelConfigDownload(head);
                let map = new Map();
                map.set('请选择', '');
                ds3.first();
                while (ds3.fetch()) {
                    let value = ds3.getString('Value_');
                    let it = ds3.getString('It_');
                    map.set(value, `${it}\`${value}`);
                }
                configData.push({
                    type: 0,
                    name: ds2.getString('Name_'),
                    options: map,
                    isSpec: ds2.getBoolean('IsSpec_'),
                    remark: ds2.getString('Remark_'),
                    code: ds2.getString('Code_')
                })
            } else {
                configData.push({
                    type: 1,
                    name: ds2.getString('Name_'),
                    isSpec: ds2.getBoolean('IsSpec_'),
                    remark: ds2.getString('Remark_'),
                    code: ds2.getString('Code_')
                })
            }
        }
        this.setState({
            modelCode,
            modelDetail,
            configData,
            titleIn: 1,
            showLoad: false,
            titleList: ['型号', '配置'],
            configRow: new DataRow(),
        })
    }

    async handleAdd() {
        try {
            this.setState({
                showLoad: true,
                loadText: '系统正在添加商品中，请稍后...'
            })
            let dataSet = new DataSet();
            dataSet.head.copyValues(this.state.modelDetail);
            dataSet.head.setValue('ModelCode_', this.state.modelCode);
            dataSet.head.setValue('TBNo_', this.props.tbNo);
            let spec = '';
            let bool = true;
            let isFirst = true;
            this.state.configData.forEach((config: configType, index: number) => {
                dataSet.append();
                let spec_ = '';
                if (config.options) {
                    let arr = this.state.configRow.getString(config.name).split('`');
                    spec_ = arr[1];
                    dataSet.setValue('It_', arr[0]);
                } else
                    spec_ = spec_ = this.state.configRow.getString(config.name);
                if (config.isSpec && spec_) {
                    isFirst = false;
                    if (bool) {
                        spec = spec_;
                        bool = false;
                    } else {
                        spec += `,${spec_}`
                    }
                }
                dataSet.setValue('Name_', config.name);
                dataSet.setValue('Value_', spec_);
                dataSet.setValue('Type_', config.type);
                dataSet.setValue('Remark_', config.remark);
                dataSet.setValue('Code_', config.code);
                dataSet.setValue('ImgUrl_', '');
            })
            if (isFirst) {
                throw new Error('带有*的配置必须有一个不为空');
            }
            dataSet.head.setValue('Spec_', spec);
            let headIn = new DataRow();
            headIn.setValue('Brand_', this.state.modelDetail.getString('Brand_'));
            headIn.setValue('Desc_', this.state.modelDetail.getString('Desc_'));
            headIn.setValue('Spec_', spec);
            let ds = await DitengApi.existsPartInfo(headIn);
            if (ds.state > 0) {
                this.addShop(encodeURIComponent(ds.head.getString('Code_')))
            } else {
                let dataOut = await DitengApi.postConfigCode(dataSet);
                if (dataOut.state > 0) {
                    dataOut.first();
                    this.addShop(encodeURIComponent(dataOut.head.getString('Code_')))
                } else {
                    showMsg(dataOut.message)
                }
            }
            this.setState({
                showLoad: false
            })
        } catch (e) {
            this.setState({
                showLoad: false
            })
            showMsg(e.message)
        }
    }

    async addShop(code: string) {
        this.setState({
            showLoad: true,
            loadText: '系统正在将商品添加至销售订单，请稍后...'
        })
        await fetch(`TWebShopping.addDetail?num=1&tb=OD&products=${code}&spareStatus=false`).then(response => response.json()).then((json) => {
            if (json.ok) {
                document.querySelector('.header-center-right').innerHTML = json.menu;
                let shopNum = document.querySelector('[role=shopNums]') as HTMLSpanElement;
                shopNum.innerText = json.num;
                shopNum.classList.add('shopNums');
                showMsg(`料号：${code}已成功添加至销售订单`);
                this.pageReload();
            } else {
                showMsg(json.msg)
            }
            this.setState({
                showLoad: false
            })
        })
    }

    pageReload() {
        let modelRow = new DataRow();
        modelRow.setValue('MaxRecord_', 20);
        // 只查询型号商品
        modelRow.setValue('Assortment', '1');
        this.setState({
            titleIn: 0,
            titleList: ['型号'],
            modelRow,
            modelData: new DataSet(),
            modelDetail: new DataRow(),
            configData: [],
            configRow: new DataRow(),
            modelCode: '',
            showLoad: false,
            loadText: '系统正在查询中，请稍后...'
        }, () => {
            this.modelSearch();
        })
    }
}