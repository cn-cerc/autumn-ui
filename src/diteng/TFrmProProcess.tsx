import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import Datetime from "../db/Datetime";
import FieldMeta from "../db/FieldMeta";
import QueryService from "../db/QueryService";
import { Excel } from "../db/Utils";
import { ColumnDescSpec } from "../rcc/ColumnDescSpec";
import { ColumnImage } from "../rcc/ColumnImage";
import { ColumnIt } from "../rcc/ColumnIt";
import { ColumnNumber } from "../rcc/ColumnNumber";
import DBCheckbox from "../rcc/DBCheckbox";
import DBEdit from "../rcc/DBEdit";
import DBGrid, { ChildRow, Column } from "../rcc/DBGrid";
import { AuiMath, Loading, showMsg } from "./Summer";
import styles from "./TFrmProProcess.css";

type propsType = {
    token: string;
    corpNo: string;
    showPartImage?: boolean;
    showPrintTimes?: boolean;
}

type stateType = {
    dataSet: DataSet,
    totalData: DataRow,
    dynamicField: Set<string>,
}

const SEARCH_SESSION_KEY = 'TFrmProProcess';
const loading = new Loading('系统正在查询中 . . .');
const MAX_RECORD = 100000;

export default class TFrmProProcess extends React.Component<propsType, stateType>{
    private async: boolean;
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
            dynamicField: new Set<string>(),
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
            headIn.setValue(item.name, item.value);
        }

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

        sessionStorage.setItem(SEARCH_SESSION_KEY, JSON.stringify(search));
        headIn.setValue('segmentQuery', true);
        headIn.setValue('timestamp', new Date().getTime());
        svr.setService('TAppODToTB.SearchProPeocess');
        this.getDatas(svr);
    }

    // 拷贝数据集栏位信息
    copyFields(dataIn: DataSet) {
        let originFields = this.state.dataSet.fields;// FIXME 引用修改有风险，需要使用克隆字段的方式
        let targetFields = dataIn.fields;
        targetFields.forEach(k => {
            if (!originFields.exists(k.code)) {
                originFields.items.push(k);
            }
        });
    }

    getDatas(svr: QueryService) {
        let maxRecord = svr.dataIn.head.getNumber('MaxRecord_');
        svr.open().then(dataOut => {
            let set: string[] = dataOut.head.getValue('set');
            if (set) set.map(item => this.state.dynamicField.add(item));

            this.copyFields(dataOut);
            let math = new AuiMath();
            let ds = this.state.dataSet;
            dataOut.first();
            while (dataOut.fetch()) {
                ds.append();
                dataOut.fields.forEach(item => {
                    let value: any = dataOut.getValue(item.code);
                    if (typeof value == 'number' && Number(value)) {
                        value = math.toFixed(dataOut.getValue(item.code), 2);
                    }
                    ds.current.setValue(item.code, value);
                })
                if (ds.size >= maxRecord) {
                    break;
                }
            }
            // 是否加载下一页
            if (dataOut.head.getBoolean("_has_next_") && ds.size < maxRecord) {
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
                let field: string[] = ['SrcapNum_', 'NotFNum'];
                ds.records.forEach((row: DataRow) => {
                    ds.fields.forEach(item => {
                        if (field.indexOf(item.code) > -1) {
                            totalRow.setValue(item.code, math.toFixed(totalRow.getDouble(item.code) + row.getDouble(item.code), 2));
                        }
                    })
                })
                totalRow.fields.forEach(item => {
                    totalRow.setValue(item.code, math.toFixed(totalRow.getDouble(item.code), 2));
                })
                this.setState({ ...this.state });
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
            let meta: Map<string, string> = new Map<string, string>([
                ['TBNo_', '订单编号'], ['It_', '订序'],
                ['ManageNo_', '管理编号'], ['CusCode_', '客户代码'],
                ['CusName_', '客户名称'], ['PartCode_', '商品编号'],
                ['descSpec', '商品编号'], ['Unit_', '单位'],
                ['Num_', '订单数'], ['PlanNum_', '派工数'],
                ['ADNum_', '入库数'], ['SrcapNum_', '报废数'],
                ['NotFNum', '欠交数'], ['Stock_', '当前库存'],
                ['OutDate_', '订单交期'], ['MakeDate_', '生产交期'],
                ['DeptCode_', '所在部门'], ['DeptName_', '部门名称'],
                ['TBDate_', '异动日期'], ['BADate_', '领料日期'],
                ['RemarkH_', '单头备注'], ['Remark_', '单身备注'],
                ['MKFinish_', '结案状态'], ['FinishDate_', '结案日期'],
            ])

            let ruleOut = ['Num_', 'PlanNum_', 'ADNum_', 'SrcapNum_', 'NotFNum', 'Stock_']
            this.state.dynamicField.forEach(value => {
                let keys = value.split('`');
                meta.set(keys[0], keys[1]);
                ruleOut.push(keys[0]);
            });
            meta.forEach((value, key) => {
                let fm = new FieldMeta(key).setName(value);
                if (ruleOut.indexOf(fm.code) > -1)
                    fm.setType('n');
                else
                    fm.setType('s');
                ds.fields.items.push(fm)
            })
            let mkFinish: string[] = ['未完成', '已完成', '已结案'];
            this.state.dataSet.records.forEach((row: DataRow) => {
                ds.append();
                ds.fields.forEach((meta: FieldMeta) => {
                    if (meta.code == 'MKFinish_')
                        ds.setValue(meta.code, mkFinish[row.getValue(meta.code)]);
                    else
                        ds.setValue(meta.code, row.getValue(meta.code));
                });
                let desc: string[] = [row.getString('Desc_')]
                if (row.getString('Spec_'))
                    desc.push(row.getString('Spec_'));
                ds.setValue('descSpec', desc.join(','));
            })
            new Excel().exportExcel(ds, `生产进度明细-${new Datetime().format('yyyyMMdd')}.xls`)
        }
    }

    createA(params: any = {}): string {
        let { href, text, onclick, id, target } = params;
        let a: HTMLElement = document.createElement('a') as HTMLElement;
        a.setAttribute('href', href);
        a.innerText = text;
        if (id) a.setAttribute('id', id);
        if (onclick) a.onclick = onclick;
        if (target) a.setAttribute('target', target);
        return a.outerHTML;
    }

    handleClick(dataRow: DataRow, sender: any) {
        if ('a,span,input'.indexOf(sender.target.localName) > -1) return;

        dataRow.setValue('_select_', !dataRow.getBoolean('_select_'));
        this.checkChkPartCodeState(this.state.dataSet);
        this.setState({ ...this.state })
    }

    displaySwitch(rowNo: string) {
        let tr = document.querySelector(`tr[data-key='child_${rowNo}']`);
        let style = tr.getAttribute('style');
        tr.setAttribute('style', style == 'display: table-row;' ? 'display: none;' : 'display: table-row;');
    }

    checkChkPartCodeState(dbData: DataSet) {
        let chkPartCode: boolean = true;
        dbData.first();
        while (dbData.fetch()) {
            if (chkPartCode && !dbData.current.getBoolean('_select_')) {
                chkPartCode = false;
                break;
            }
        }
    }


    getRows(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        items.push(<Column code='_select_' name='选择' width='3' >
            <DBCheckbox dataField="_select_" isUseChangedEvent={false} />
        </Column>);
        items.push(<ColumnIt width="2" />);
        items.push(<Column code='TBNo_' name='订单编号' width='4' customText={(row: DataRow) => {
            return <a href={`TFrmTranMK.modify?tbNo=${row.getString('TBNo_')}`} target={'_blank'}>
                {row.getString('TBNo_')}
            </a>
        }} />);
        items.push(<Column code='It_' name='订序' width='3' />);
        items.push(<Column code='CusName_' name='客户简称' width='6' customText={(row: DataRow) => {
            return <a href={`CusInfo?code=${row.getString('CusCode_')}`} target={'_blank'}>
                {row.getString('CusName_')}
            </a>
        }} />);
        if (this.props.showPartImage)
            items.push(<ColumnImage code='ImgUrl_' name='商品图片' width='7' />);
        else
            items.push(<ColumnImage code='ManageNo_' name='管理编号' width='7' customText={(row: DataRow) => {
                return <a href={`CusInfo?code=${row.getString('CusCode_')}`} target={'_blank'}>
                    {row.getString('CusName_')}
                </a>
            }} />);
        items.push(<ColumnDescSpec code='PartCode_' name='品名规格' width='12' />);
        items.push(<ColumnNumber code='Num_' name='订单数' width='4' />);
        items.push(<ColumnNumber code='PlanNum_' name='派工数' width='4' customText={(row: DataRow) => {
            let param: string = `tbNo=${row.getString("TBNo_")}&it=${row.getInt('It_')}`;
            return <a href={`TFrmProProcess.detailPlan?${param}`} target={'_blank'}>
                {row.getNumber('PlanNum_')}
            </a>
        }} />);
        this.state.dynamicField.forEach(value => {
            let keys = value.split('`');
            items.push(<ColumnNumber code={keys[0]} name={keys[1]} width='4' customText={(row: DataRow) => {
                let params: string[] = [];
                params.push(`procCode=${keys[0]}`);
                params.push(`tbNo=${row.getString('TBNo_')}`);
                params.push(`it=${row.getInt('It_')}`);
                return <a href={`TFrmProProcess.detailOP?${params.join('&')}`} target={'_blank'}>
                    {row.getNumber(keys[0])}
                </a>
            }} />);
        });
        items.push(<ColumnNumber code='ADNum_' name='入库数' width='4' />);
        items.push(<ColumnNumber code='SrcapNum_' name='报废数' width='4' />);
        items.push(<ColumnNumber code='NotFNum' name='欠交数' width='4' color='red' />);
        items.push(<ColumnNumber code='Stock_' name='库存量' width='4' />);
        items.push(<Column code='OutDate_' name='订单交期' width='5' />);
        items.push(<Column code='MKFinish_' name='结案否' width='4' customText={(row: DataRow) => {
            let mkFinish = row.getInt("MKFinish_");
            let html: React.ReactNode;
            switch (mkFinish) {
                case 0:
                    html = <span style={{ color: 'red' }}>未完成</span>;
                    break;
                case 1:
                    html = <span style={{ color: '#18de51' }}>已完成</span>;
                    break;
                case 2:
                    html = '已结案';
                    break;
                default:
                    html = '' + mkFinish;
                    break;
            }
            return html;
        }} />);
        items.push(<Column code='expend' name='更多' width='3' customText={(row: DataRow) => <span onClick={this.displaySwitch.bind(this, `${row.dataSet.recNo}.2`)} style={{ color: '#0283f7' }}>展开</span>} />);
        items.push(<Column code='_opera_' name='备注' width='3' customText={(row: DataRow) => <span onClick={this.displaySwitch.bind(this, `${row.dataSet.recNo}.1`)} style={{ color: '#0283f7' }}>备注</span>} />);
        items.push(<ChildRow>
            <Column code='none' width='5'></Column>
            <Column code='Remark_' name='备注' width='30' >
                <DBEdit dataField="Remark_" dataName="备注"></DBEdit>
            </Column>
        </ChildRow>);
        items.push(<ChildRow>
            <Column code='none' width='5' customText={(row: DataRow) => {
                let html: React.ReactNode[] = [];
                html.push(<React.Fragment>
                    领料日期：<a href={`TFrmProProcess.detailBA?tbNo=${row.getString("TBNo_")}&it=${row.getInt('It_')}`} target={'_blank'}>
                        {row.getString('BADate_')}</a>
                </React.Fragment>);
                html.push(`　单位：${row.getString('Unit_')}`);
                html.push(`　部门名称：${row.getString('DeptName_')}`);
                html.push(`　单头备注：${row.getString('RemarkH_')}`);
                html.push(`　生产交期：${row.getString('MakeDate_')}`);
                html.push(<React.Fragment>&nbsp;&nbsp;
                    出库数量：<a href={`TFrmProProcess.detailOut?tbNo=${row.getString("TBNo_")}&it=${row.getInt('It_')}`} target={'_blank'}>
                        {row.getNumber('OutNum_')}</a>
                </React.Fragment>);
                return html;
            }} />
        </ChildRow>);
        items.push(<ChildRow>
            <Column code='none' width='5' />
        </ChildRow>);
        return items
    }

    render() {
        let asideList = document.querySelector('.asideList');

        let sectionSwarm: HTMLElement = document.createElement('section') as HTMLElement;
        sectionSwarm.setAttribute('role', 'swarm');
        sectionSwarm.innerHTML = `
        <div class="title">相关操作</div>
        <div class="contents">
            ${this.createA({ href: 'TSchViewUserLogs.searchTBChangeLog', text: '查看变更日志', target: '_blank' })}
            ${this.createA({ href: 'TFrmProProcess.makeListAnalysis', text: '订单用料分析', target: '_blank' })}
        </div>`;
        let swarm = asideList.querySelector('section[role="swarm"]');
        if (swarm) swarm.remove();
        asideList.appendChild(sectionSwarm);

        let contents = asideList.querySelector('section[role="swarm"]').querySelector('.contents');
        let xlsxDown: HTMLElement = document.createElement('a') as HTMLElement;
        xlsxDown.setAttribute('href', '#');
        xlsxDown.setAttribute('id', 'download');
        xlsxDown.innerText = '导出Excel';
        xlsxDown.onclick = this.download.bind(this);
        let download = asideList.querySelector('#download');
        if (download) download.remove();
        contents.appendChild(xlsxDown);


        let row: DataRow = this.state.totalData;
        let sectionTotal: HTMLElement = document.createElement('section') as HTMLElement;
        sectionTotal.setAttribute('role', 'total');
        sectionTotal.innerHTML = `
        <div class="title">数据合计</div>
        <div class="contents">
            <ul>
                <li><a href='TFrmProProcess.detailSrcapAll?procCode=' style='margin-left: -0.5em;'>报废数量</a>：<strong>${row.getDouble('SrcapNum_')}</strong></li>
                <li>未交数量：<strong>${row.getDouble('NotFNum')}</strong></li>
            </ul>
        </div>`;
        let total = asideList.querySelector('section[role="total"]');
        if (total) total.remove();
        asideList.appendChild(sectionTotal);

        return (
            <div className={styles.main}>
                <DBGrid key={new Date().getTime()} dataSet={this.state.dataSet} readOnly={false} onRowClick={this.handleClick.bind(this)}>
                    {this.getRows()}
                </DBGrid>
            </div >
        )
    }
}