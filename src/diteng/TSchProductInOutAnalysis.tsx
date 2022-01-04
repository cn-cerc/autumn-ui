import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import Datetime from "../db/Datetime";
import FieldMeta from "../db/FieldMeta";
import QueryService from "../db/QueryService";
import { Excel } from "../db/Utils";
import { ColumnIt } from "../rcc/ColumnIt";
import DBGrid, { ChildRow, Column } from "../rcc/DBGrid";
import DitengCommon from "./DitengCommon";
import { AuiMath, Loading, showMsg } from "./Summer";
import styles from "./TSchProductInOutAnalysis.css";

type propsType = {
    token: string;
    // 显示可用库存
    allowViewProfit: boolean;
    isCustomer?: boolean;
    isAlliance?: boolean;
    corpNo: string;
}

type stateType = {
    dataSet: DataSet,
    totalData: DataRow,
}

const SEARCH_SESSION_KEY = 'TAppStockInOut:getStockInOut';
const loading = new Loading('系统正在查询中 . . .');
const MAX_RECORD = 100000;

const ClassDescSpec = "ClassDescSpec"; // 类别及品名规格
const InitStock = "InitStock"; // 期初库存
const EndStock = "EndStock"; // 期末库存
const InNum = "InNum"; // 入库数量
const OutNum = "OutNum"; // 出库数量
const BGNum = "BGNum"; // 退回数量
const BackNum = "BackNum"; // 退货数量
const ALNum = "ALNum"; // 拆装数量
const BRNum = "BRNum"; // 报损数量
const AENum = "AENum"; // 盈亏数量

export default class TSchProductInOutAnalysis extends React.Component<propsType, stateType>{
    private async: boolean;
    private _key: number = new Date().getTime();
    private ds: DataSet = new DataSet();

    constructor(props: propsType) {
        super(props);
        // 初始化查询数据
        let value = sessionStorage.getItem(SEARCH_SESSION_KEY);
        if (value) {
            let json = JSON.parse(value);
            //@ts-ignore
            let elements = document.getElementById('form1').elements;
            // 恢复input组件的数据信息
            for (let i = 0; i < elements.length; i++) {
                let element = elements.item(i);
                element.value = json[element.name];
            }
        }

        let item = document.getElementsByName('submit1');
        if (item.length > 0) {
            item[0].addEventListener('click', this.submitClick);
        }
        this.state = {
            dataSet: new DataSet(),
            totalData: new DataRow(),
        }
    }

    submitClick = (e: any) => {
        // 取消默认的post事件
        e.preventDefault();

        if (this.async) {
            return;
        }
        this.state.dataSet.clear();
        this.setState(this.state);
        this._key = new Date().getTime()
        // 删除表格排序符号
        let thList = document.querySelectorAll('th span');
        for (let i = 0; i < thList.length; i++) {
            thList[i].remove();
        }

        loading.show();
        loading.hideTime = 600;
        this.state.dataSet.close();
        this.state.totalData.close();
        this.setState(this.state);

        // 构建请求数据
        let svr = new QueryService(this.props);
        let headIn = svr.dataIn.head;
        //@ts-ignore
        let elements = document.getElementById('form1').elements;
        let search: any = {};// 查询条件信息
        for (let item of elements) {
            search[item.name] = item.value;
        }

        headIn.setValue("TBDate_From", elements['dateFrom'].value);
        headIn.setValue("TBDate_To", elements['dateTo'].value);

        let partClass = elements['partClass'].value.split("->");
        if (partClass.length > 0) {
            headIn.setValue("Class1_", partClass[0]);
        }
        if (partClass.length > 1) {
            headIn.setValue("Class2_", partClass[1]);
        }
        if (partClass.length > 2) {
            headIn.setValue("Class3_", partClass[2]);
        }

        let brand = elements['brand'].value
        if (brand) headIn.setValue("Brand_", brand);

        let CWCode = elements['CWCode'].value
        if (CWCode) headIn.setValue("CWCode", CWCode);

        if (elements['onlyTran'].checked) headIn.setValue("OnlyTran", true);

        let searchText = elements['searchText'].value
        if (searchText) headIn.setValue("SearchText_", searchText);

        let desc = elements['Desc_'].value
        if (desc) headIn.setValue("Desc_", desc);

        let spec = elements['Spec_'].value
        if (spec) headIn.setValue("Spec_", spec);

        let sort = elements['Sort'].value
        if (sort) headIn.setValue("Sort", sort);

        if (this.props.isAlliance) {
            headIn.setValue("IsAlliance", true);
        }

        sessionStorage.setItem(SEARCH_SESSION_KEY, JSON.stringify(search));
        headIn.setValue("segmentQuery", true);
        headIn.setValue('timestamp', new Date().getTime());
        svr.setService("TAppStockInOut.getStockInOut");
        this.getDatas(svr);
    }

    // 拷贝数据集栏位信息
    copyFields(dataIn: DataSet) {
        if (dataIn.fields.size == 0) {
            return;
        }

        if (this.state.dataSet.fields.size == 0) {
            let originFields = this.state.dataSet.fields;// FIXME 引用修改有风险，需要使用克隆字段的方式
            let targetFields = dataIn.fields;
            targetFields.forEach(k => originFields.items.push(k));
        }
    }

    getDatas(svr: QueryService) {
        let headIn: DataRow = svr.dataIn.head;
        svr.open().then(dataOut => {
            this.copyFields(dataOut);
            let math = new AuiMath();
            let field = ['InitAmount_', 'InitStock_', 'Remark_', 'Brand_', 'Class1_', 'Class2_',
                'Class3_', 'PartCode_', 'Desc_', 'Spec_', 'Unit_', 'CostUP_', 'PartCode_'];
            if (dataOut.size >= 2) {
                dataOut.last();
                let row = dataOut.current;
                let totalRow = this.state.totalData;
                dataOut.fields.forEach(item => {
                    if (item.code == 'InitAmount_' || item.code == 'InitStock_' || item.code == 'CostUP_') {
                        totalRow.setValue(item.code, math.toFixed(totalRow.getDouble(item.code) + row.getDouble(item.code), 4));
                    }
                })
                dataOut.delete();
            }
            let ds = this.ds;
            dataOut.first();
            while (dataOut.fetch()) {
                let code = dataOut.getString('PartCode_');
                if (ds.locate('PartCode_', code)) {
                    ds.fields.forEach(item => {
                        if (field.indexOf(item.code) == -1) {
                            ds.setValue(item.code, math.toFixed(ds.getDouble(item.code) + dataOut.getDouble(item.code), 4));
                        }
                    })
                } else {
                    ds.append();
                    dataOut.fields.forEach(item => {
                        let value: any = dataOut.getValue(item.code);
                        if (typeof value == 'number' && Number(value)) {
                            value = math.toFixed(dataOut.getValue(item.code), 4);
                        }
                        ds.current.setValue(item.code, value);
                    })
                }
                ds.setValue("EndAmount_", math.toFixed(ds.getDouble("Stock_") * ds.getDouble("CostUP_"), 4));
            }
            // 是否加载下一页
            if (dataOut.head.getBoolean("_has_next_")) {
                if (this.state.dataSet.size < MAX_RECORD) {
                    this.getDatas(svr);
                } else {
                    this.async = false;
                    loading.hide();
                    showMsg(`数据已超过 ${MAX_RECORD} 笔记录，请重新选择查询条件`, true);
                    this.setState(this.state);
                }
            } else {
                this.async = false;
                loading.hide();
                showMsg('数据加载完成');
                let totalRow = this.state.totalData;
                ds.records.forEach((row: DataRow) => {
                    ds.fields.forEach(item => {
                        if (field.indexOf(item.code) == -1) {
                            totalRow.setValue(item.code, math.toFixed(totalRow.getDouble(item.code) + row.getDouble(item.code), 4));
                        }
                    })
                })
                totalRow.fields.forEach(item => {
                    totalRow.setValue(item.code, math.toFixed(totalRow.getDouble(item.code), 2));
                })
                if (headIn.has("Sort")) {
                    if (ClassDescSpec == headIn.getString("Sort")) {
                        ds.setSort("Class1_", "Class2_", "Class3_", "Desc_", "Spec_");
                    } else if (InitStock == headIn.getString("Sort")) {
                        ds.setSort("InitStock_ DESC");
                    } else if (EndStock == headIn.getString("Sort")) {
                        ds.setSort("EndStock_ DESC");
                    } else if (InNum == headIn.getString("Sort")) {
                        ds.setSort("Num_ DESC");
                    } else if (OutNum == headIn.getString("Sort")) {
                        ds.setSort("OutNum_ DESC");
                    } else if (BGNum == headIn.getString("Sort")) {
                        ds.setSort("BGNum_ DESC");
                    } else if (BackNum == headIn.getString("Sort")) {
                        ds.setSort("BackNum_ DESC");
                    } else if (ALNum == headIn.getString("Sort")) {
                        ds.setSort("ALNum_ DESC");
                    } else if (BRNum == headIn.getString("Sort")) {
                        ds.setSort("BRNum_ DESC");
                    } else if (AENum == headIn.getString("Sort")) {
                        ds.setSort("AENum_ DESC");
                    } else if (ALNum == headIn.getString("Sort")) {
                        ds.setSort("AHNum_ DESC");
                    }
                }
                this.setState({ ...this.state, dataSet: ds });
            }
        }).catch(dataOut => {
            if (dataOut.message) {
                loading.hide();
                showMsg(dataOut.message);
            }
            this.async = false;
            this.setState(this.state);
        })
    }

    download() {
        let ds: DataSet = new DataSet();
        if (this.state.dataSet.size > 0) {
            let meta: any = {
                'PartCode_': '商品编号',
                'DescSpec': '品名规格',
                'Unit_': '单位',
                'CostUP_': '成本价',
                'InitStock_': '期初库存', 'InitAmount_': '期初金额',
                'EndAmount_': '期末金额', 'Stock_': '现库存数',
                'Num_': '入库数量', 'OriAmount_': '入库金额',
                'BGNum_': '退回数量', 'BGAmount_': '退回金额',
                'OutNum_': '出库数量', 'OutAmount_': '出库金额',
                'BackNum_': '退货数量', 'BackAmount_': '退货金额',
                'BRNum_': '报损数量', 'BRAmount_': '报损金额',
                'AENum_': '盈亏数量', 'AEAmount_': '盈亏金额',
                'AHNum_': '调拨数量', 'ALNum_': '拆装数量',
                'ALOriAmount_': '拆装金额', 'Brand_': '品牌',
                'Class1_': '商品大类', 'Class2_': '商品中类', 'Class3_': '商品系列', 'Remark_': '备注'
            }
            if (this.props.corpNo == DitengCommon.CUSTOMER_194005 || this.props.corpNo == '911001') {
                meta = {
                    'PartCode_': '商品编号', 'DescSpec': '品名规格', 'Unit_': '单位', 'InitStock_': '期初库存',
                    'Num_': '入库数量', 'BGNum_': '退回数量', 'OutNum_': '出库数量', 'BackNum_': '退货数量',
                    'BRNum_': '报损数量', 'AENum_': '盈亏数量', 'AHNum_': '调拨数量', 'ALNum_': '拆装数量',
                    'Stock_': '现库存数', 'Remark_': '备注'
                }
            }
            for (let key of Object.keys(meta)) {
                ds.fields.items.push(new FieldMeta(key).setName(meta[key]))
            }
            this.state.dataSet.records.forEach((row: DataRow) => {
                ds.append();
                ds.fields.forEach((meta: FieldMeta) => {
                    ds.setValue(meta.code, row.getValue(meta.code));
                });
                let desc: string[] = [row.getString('Desc_')]
                if (row.getString('Spec_'))
                    desc.push(row.getString('Spec_'));
                ds.setValue('DescSpec', desc.join(','));
            })
            new Excel().exportExcel(ds, `商品出入明细-${new Datetime().format('yyyyMMdd')}.xls`)
        }
    }

    tranDetail(row: DataRow, filed: string, tb: string) {
        if (row.getString(filed)) {
            //@ts-ignore
            let elements = document.getElementById('form1').elements;
            let param: string[] = [];
            param.push(`partCode=${row.getString('PartCode_')}`);
            param.push(`dateFrom=${elements['dateFrom'].value}`);
            param.push(`dateTo=${elements['dateTo'].value}`);
            param.push(`CWCode=${elements['CWCode'].value}`);
            param.push(`tb=${tb}`);
            return <a target='TSchProductInOutAnalysis.detail'
                href={`TSchProductInOutAnalysis.detail?${param.join('&')}`}>
                {row.getString(filed)}
            </a>
        }
        else
            return ''
    }

    render() {
        let row: DataRow = this.state.totalData;
        let section: HTMLElement = document.createElement('section') as HTMLElement;
        section.setAttribute('role', 'total');
        section.innerHTML = `
        <div class="title">数据合计</div>
        <div class="contents">
            <ul>
                <li>期初库存：<strong>${row.getDouble('InitStock_')}</strong></li>
                <li>期初金额：<strong>${row.getDouble('InitAmount_')}</strong></li>
                <li>现库存数：<strong>${row.getDouble('Stock_')}</strong></li>
                <li>期末金额：<strong>${row.getDouble('EndAmount_')}</strong></li>
                <li>入库数量：<strong>${row.getDouble('Num_')}</strong></li>
                <li>出库数量：<strong>${row.getDouble('OutNum_')}</strong></li>
                <li>退回数量：<strong>${row.getDouble('BGNum_')}</strong></li>
                <li>退货数量：<strong>${row.getDouble('BackNum_')}</strong></li>
                <li>拆装数量：<strong>${row.getDouble('ALNum_')}</strong></li>
                <li>报损数量：<strong>${row.getDouble('BRNum_')}</strong></li>
                <li>盈亏数量：<strong>${row.getDouble('AENum_')}</strong></li>
                <li>调拨数量：<strong>${row.getDouble('AHNum_')}</strong></li>
                <li>借调数量：<strong>${row.getDouble('BorrowNum_')}</strong></li>
            </ul>
        </div>`;
        let asideList = document.querySelector('.asideList');
        let total = asideList.querySelector('section[role="total"]');
        if (total) total.remove();
        asideList.appendChild(section);

        let contents = document.querySelectorAll('.asideList section')[1].querySelector('.contents');
        let xlsxDown: HTMLElement = document.createElement('a') as HTMLElement;
        xlsxDown.setAttribute('href', '#');
        xlsxDown.setAttribute('id', 'download');
        xlsxDown.innerText = '导出到XLS';
        xlsxDown.onclick = this.download.bind(this);
        let download = asideList.querySelector('#download');
        if (download) download.remove();
        contents.appendChild(xlsxDown);

        return (
            <div className={styles.main}>
                <DBGrid key={this._key} dataSet={this.state.dataSet} readOnly={false}>
                    <ColumnIt width="2" />
                    <Column code='PartCode_' name='品名规格' width='15' customText={(dataRow: DataRow) => {
                        return (
                            <React.Fragment>
                                <a href={`PartInfo?code=${dataRow.getString('PartCode_')}`} target={"_blank"}>
                                    {dataRow.getString('Desc_')}
                                </a>{dataRow.getString('Spec_') ? '，' + dataRow.getString('Spec_') : ''}
                            </React.Fragment>
                        )
                    }} />
                    <Column code='type' name='类型' width='3' customText={() => '数量'} />
                    <Column code='InitStock_' name='期初' width='3' textAlign="right" />
                    <Column code='Stock_' name='期末' width='3' textAlign="right" />
                    <Column code='Num_' name='入库' width='3' textAlign="right" customText={(row: DataRow) => this.tranDetail(row, 'Num_', 'AB')} />
                    <Column code='OutNum_' name='出库' width='3' textAlign="right" customText={(row: DataRow) => this.tranDetail(row, 'OutNum_', 'BC')} />
                    <Column code='BGNum_' name='退回' width='3' textAlign="right" customText={(row: DataRow) => this.tranDetail(row, 'BGNum_', 'BG')} />
                    <Column code='BackNum_' name='退货' width='3' textAlign="right" customText={(row: DataRow) => this.tranDetail(row, 'BackNum_', 'AG')} />
                    <Column code='ALNum_' name='拆装' width='3' textAlign="right" customText={(row: DataRow) => this.tranDetail(row, 'ALNum_', 'AL')} />
                    <Column code='BRNum_' name='报损' width='3' textAlign="right" customText={(row: DataRow) => this.tranDetail(row, 'BRNum_', 'BR')} />
                    <Column code='AENum_' name='盈亏' width='3' textAlign="right" customText={(row: DataRow) => this.tranDetail(row, 'AENum_', 'AE')} />
                    <Column code='AHNum_' name='调拨' width='3' textAlign="right" customText={(row: DataRow) => this.tranDetail(row, 'AHNum_', 'AH')} />
                    {this.props.isAlliance ? <Column code='BorrowNum_' name='借调数量' width='5' textAlign="right" customText={(row: DataRow) => this.tranDetail(row, 'Num_', 'AK')} /> : ''}
                    <ChildRow>
                        <Column code="none" width="5" />
                        <Column code="amount" width="" name="成本单价" customText={(dataRow: DataRow) => {
                            return `成本单价：${dataRow.getDouble('CostUP_')}/${dataRow.getString('Unit_')}`
                        }} />
                        <Column code='type' name='类型' width='3' customText={() => '金额'} />
                        <Column code='InitAmount_' width='3' textAlign="right" />
                        <Column code='EndAmount_' width='3' textAlign="right" />
                        <Column code='OriAmount_' width='3' textAlign="right" />
                        <Column code='OutAmount_' width='3' textAlign="right" />
                        <Column code='BGAmount_' width='3' textAlign="right" />
                        <Column code='BackAmount_' width='3' textAlign="right" />
                        <Column code='ALOriAmount_' width='3' textAlign="right" />
                        <Column code='BRAmount_' width='3' textAlign="right" />
                        <Column code='AEAmount_' width='3' textAlign="right" />
                        <Column code='AHAmount_' width='3' textAlign="right" />
                        {this.props.isAlliance ? <Column code='BorrowAmount_' width='3' textAlign="right" /> : ''}
                    </ChildRow>
                </DBGrid>
            </div>
        )
    }
}