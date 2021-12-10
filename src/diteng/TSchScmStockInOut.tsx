//@ts-ignore
import React from "react";
import DataSet from "../db/DataSet";
import QueryService from "../db/QueryService";
import Grid from "../rcc/Grid";
import TGrid, { TGridColumn, TGridConfig } from "../vcl/TGrid";
import { exportUrl } from './ExportConfig';
import { AuiMath, Loading, showMsg } from "./Summer";

/**
 * 页面查询 sessionStorage
 */
const SEARCH_SESSION_KEY = 'TSchScmStockInOut:search';
const loading = new Loading('系统正在查询中 . . .');
const MAX_RECORD = 100000;

const CUSTOMER_164003 = "164003";
const CUSTOMER_214015 = "214015";
const CUSTOMER_214007 = "214007";

type propsType = {
    token: string;
    corpNo: string;
    showInUP: boolean;
}

interface stateType {
    config: TGridConfig
}

export default class TSchScmStockInOut extends React.Component<propsType, stateType> {
    dataSet: DataSet;
    async = false;
    grid: Grid;

    constructor(props: propsType) {
        super(props);
        this.dataSet = new DataSet();

        // 导出专用
        let fields = this.dataSet.fields;
        fields.add("DescSpecExcel").setOnGetText((row, meta) => {
            meta.setType('s12');
            let desc = row.getValue("Desc_");
            let spec = row.getValue("Spec_");
            return desc + (spec != '' ? ('，' + spec) : "");
        })

        // 显示数据源
        let config = new TGridConfig();
        new TGridColumn(config, "sn_", "序").setWidth(3).setAlign("center");
        new TGridColumn(config, "DescSpec", "品名规格").setWidth(12).setOnRender((column, row) => {
            let partCode = row.getValue("PartCode_");
            let desc = row.getValue("Desc_");
            let spec = row.getValue("Spec_");
            let href = `PartInfo?code=${partCode}`;
            return (
                <React.Fragment>
                    <a href={href} target="_blank">{desc}</a> {spec}
                </React.Fragment>
            )
        });
        new TGridColumn(config, "tbNo", "异动单号").setWidth(8).setAlign("center").setOnRender((column, row) => {
            let tbNo = row.getValue("TBNo_");
            let it = row.getValue("It_");
            let tb = tbNo.slice(0, 2);
            let url = getTBUrl(tb);
            let href = `${url}?tbNo=${tbNo}`;
            return (
                <React.Fragment>
                    <a href={href} target="_blank">{tbNo}</a>-{it}
                </React.Fragment>
            )
        });
        new TGridColumn(config, "TBDate_", "异动日期").setWidth(6).setAlign("center");
        new TGridColumn(config, "ShortName_", "对象简称").setWidth(8);
        new TGridColumn(config, "CWCode_", "仓别").setWidth(4);

        new TGridColumn(config, "Num_", "入库数量").setWidth(4);
        new TGridColumn(config, "OriAmount_", "入库金额").setWidth(4);

        new TGridColumn(config, "OutNum_", "出库数量").setWidth(4);
        new TGridColumn(config, "OutAmount_", "出库金额").setWidth(4);

        new TGridColumn(config, "SpareNum_", "赠品数量").setWidth(4);
        new TGridColumn(config, "SpareAmount_", "赠品金额").setWidth(4);
        new TGridColumn(config, "salesName", "业务人员").setWidth(4).setOnRender((column, row) => {
            let userCode = row.getValue("SalesCode_");
            let userName = row.getValue("SalesName_");
            let href = `UserInfo?code=${userCode}`;
            if (userName) {
                return (
                    <React.Fragment>
                        <a href={href} target="_blank">{userName}</a>
                    </React.Fragment>
                )
            } else {
                return (
                    <React.Fragment>
                        {userCode}
                    </React.Fragment>
                )
            }
        });

        new TGridColumn(config, "Opera", "操作").setWidth(3).setAlign("center").setOnRender((column, row) => {
            let recNo = row.dataSet.recNo;
            let href = `#${recNo}`;
            return (
                <a href={href} onClick={this.onOperaClick}>展开</a>
            )
        });

        let child = config.newChild();
        new TGridColumn(child, "RemarkB", "单身备注");
        new TGridColumn(child, "Unit_", "单位");
        new TGridColumn(child, "PartType_", "商品类型");
        new TGridColumn(child, "SupCode_", "对象代码");
        new TGridColumn(child, "UpdateDate_", "更新日期");
        child.setOnOutput((sender, display) => {
            let remark = sender.current.getString("RemarkB");
            display.setValue(remark != '');
        });

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

        let exportFile = document.getElementById('exportFile');
        exportFile.addEventListener('click', this.exportFileClick);
        //@ts-ignore
        exportFile.href = "#";
        config.setDataSet(this.dataSet);
        this.state = { config: config };
    }

    submitClick = (e: any) => {
        // 取消默认的post事件
        e.preventDefault();

        // 正在异步请求时不允许重复提交事件
        if (this.async) {
            return;
        }

        // 删除表格排序符号
        let thList = document.querySelectorAll('th span');
        for(let i=0;i<thList.length;i++) {
            thList[i].remove();
        }

        loading.show();
        loading.hideTime = 300;
        this.dataSet.close();
        this.setState(this.state);

        // 构建请求数据
        let svr = new QueryService(this.props);
        let headIn = svr.dataIn.head;
        //@ts-ignore
        let elements = document.getElementById('form1').elements;
        let search = {};// 查询条件信息
        for (let i = 0; i < elements.length; i++) {
            let element = elements.item(i);
            //@ts-ignore
            search[element.name] = element.value;
            if (!element.value)
                continue;
            if (element.name == 'tbType') {
                let tbTypes: string[] = element.value.split(",");
                tbTypes.forEach(tb => {
                    headIn.setValue("chk" + tb, true);
                })
            } else if (element.name == 'partClass') {
                let partClass = element.value.split("->");
                if (partClass.length > 0)
                    headIn.setValue("Class1_", partClass[0]);
                if (partClass.length > 1)
                    headIn.setValue("Class2_", partClass[1]);
                if (partClass.length > 2)
                    headIn.setValue("Class3_", partClass[2]);
            } else
                headIn.setValue(element.name, element.value);
        }
        sessionStorage.setItem(SEARCH_SESSION_KEY, JSON.stringify(search));
        headIn.setValue("segmentQuery", true);
        headIn.setValue("MaxRecord_", -1);
        headIn.setValue('timestamp', new Date().getTime());
        svr.setService("TAppStockInOut.Search");
        this.async = true;
        this.getDatas(svr);
    }

    // 拷贝数据集栏位信息
    copyFields(dataIn: DataSet) {
        if (dataIn.fields.size == 0) {
            return;
        }
        let originFields = this.dataSet.fields;// FIXME 引用修改有风险，需要使用克隆字段的方式
        let targetFields = dataIn.fields;
        targetFields.forEach(k => originFields.items.push(k));
    }

    getDatas(svr: QueryService) {
        svr.open().then(dataOut => {
            this.copyFields(dataOut);
            this.dataSet.appendDataSet(dataOut);
            if (dataOut.head.getBoolean("_has_next_")) {
                if (this.dataSet.size < MAX_RECORD) {
                    this.getDatas(svr);
                } else {
                    this.async = false;
                    loading.hide();
                    showMsg(`数据已超过 ${MAX_RECORD} 笔记录，请重新选择查询条件`, true);
                    this.setState(this.state);
                    return;
                }
            } else {
                this.async = false;
                loading.hide();
                showMsg('数据加载完成');
                this.setState(this.state);
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

    render() {
        if (this.grid) {
            this.grid.initGrid()
        }
        this.dataSet.first();
        while (this.dataSet.fetch())
            this.dataSet.setValue("sn_", this.dataSet.recNo);

        // 数据合计
        let inNumTotal = 0;
        let inAmountTotal = 0;
        let outNumTotal = 0;
        let outAmountTotal = 0;
        this.dataSet.forEach((dataRow) => {
            inNumTotal += dataRow.getDouble("Num_");
            inAmountTotal += dataRow.getDouble("OriAmount_");
            outNumTotal += dataRow.getDouble("OutNum_");
            outAmountTotal += dataRow.getDouble("OutAmount_");
        })
        let math = new AuiMath();
        document.getElementById('inNumTotal').innerText = math.toFixed(inNumTotal, 2).toString();
        document.getElementById('inAmountTotal').innerText = math.toFixed(inAmountTotal, 2).toString();
        document.getElementById('outNumTotal').innerText = math.toFixed(outNumTotal, 2).toString();
        document.getElementById('outAmountTotal').innerText = math.toFixed(outAmountTotal, 2).toString();
        document.getElementById('dataSize').innerText = "" + this.dataSet.size;
        let dataSet = new DataSet();
        dataSet.appendDataSet(this.state.config.dataSet);
        return (
            <Grid config={this.state.config} setChild={this.setChild.bind(this)} dataSet={dataSet} />
        )
    }

    exportFileClick = (e: any) => {
        // 取消默认的post事件
        e.preventDefault();

        let grid = new TGrid(null);
        grid.setDataSet(this.dataSet);
        // 设置导出数据源
        new TGridColumn(grid, "TBDate_", "异动日期");
        new TGridColumn(grid, "TBNo_", "异动单号");
        new TGridColumn(grid, "ManageNo_", "管理编号");
        new TGridColumn(grid, "Remark_", "单头备注");
        new TGridColumn(grid, "It_", "单序");
        new TGridColumn(grid, "CWCode_", "仓别");
        new TGridColumn(grid, "SupCode_", "往来对象");
        new TGridColumn(grid, "ShortName_", "对象简称");
        new TGridColumn(grid, "Name_", "对象全称");
        new TGridColumn(grid, "SalesName_", "业务人员");
        new TGridColumn(grid, "Class1_", "商品大类");
        new TGridColumn(grid, "Class2_", "商品中类");
        new TGridColumn(grid, "Class3_", "商品系列");
        new TGridColumn(grid, "DescSpecExcel", "品名规格");
        new TGridColumn(grid, "OriUP_", "单价");
        new TGridColumn(grid, "Unit_", "单位");

        new TGridColumn(grid, "Num_", "入库数量");
        new TGridColumn(grid, "OriAmount_", "入库金额");

        new TGridColumn(grid, "OutNum_", "出库数量");
        new TGridColumn(grid, "OutAmount_", "出库金额");

        new TGridColumn(grid, "SpareNum_", "内含备品");
        new TGridColumn(grid, "PartCode_", "商品编号");
        new TGridColumn(grid, "PartType_", "商品类型");
        new TGridColumn(grid, "RemarkB", "单身备注");

        new TGridColumn(grid, "UpdateDate_", "更新日期");

        // 剑华
        if (this.props.corpNo == CUSTOMER_164003 || this.props.corpNo == CUSTOMER_214015) {
            new TGridColumn(grid, "ODRemark", "订单备注");
        }

        // 汉辉
        if (this.props.corpNo == CUSTOMER_214007) {
            new TGridColumn(grid, "PurNo_", "采购单号");
            new TGridColumn(grid, "PurIt_", "采购单序");
        }

        if (this.props.showInUP) {
            new TGridColumn(grid, "InUP_", "进货价");
        }

        grid.exportExcel(exportUrl, "进出库查询导出.xls");
    }

    onOperaClick(sender: any) {
        let str: string = sender.target.hash;
        let recNo = Number.parseInt(str.substr(1, str.length - 1));
        let el = document.getElementById(`tr${recNo}_1`);
        if (el) {
            let style = el.style;
            let value = style.getPropertyValue('display');
            if (value == "none")
                style.removeProperty('display');
            else
                style.setProperty('display', 'none');
        }
    }

    setChild(_grid: Grid) {
        this.grid = _grid;
    }

}

function getTBUrl(tb: string) {
    let url = '';
    switch (tb) {
        case "DA":
        case "DE":
        case "AB":
        case "BG":
        case "BC":
        case "OD":
        case "OC":
        case "OE":
        case "AG":
        case "AI":
        case "AE":
        case "AL":
        case "AH":
        case "BR":
        case "SP":
        case "CC":
        case "MK":
        case "AD":
        case "BA":
        case "PY":
        case "MR":
        case "BE":
        case "SN":
            url = `TFrmTran${tb}.modify`;
            break;

        case "AC":
            url = "TFrmAccBook.modify";
            break;

        case "AP":
        case "AR":
        case "RA":
        case "RB":
        case "PA":
        case "PB":
        case "FY":
        case "BM":
            url = `TFrmPaid${tb}.modify`;
            break;

        case "AA":
            url = "TFrmTranAB.modify";
            break;

        case "CD":
            url = "TFrmPartSupply.modify";
            break;

        case "CE":
            url = "TFrmProcDepute.modify";
            break;

        case "MB":
            url = "TFrmPurPlan.modifyPur";
            break;

        case "OP":
            url = "TFrmBOMDayProduce.modify";
            break;

        case "OM":
            url = "TFrmBOM.modify";
            break;

        case "SD":
            url = "FrmStepDepute.modify";
            break;
        case "SA":
            url = "FrmTranSA.modify";
            break;
        case "XJ":
            url = "FrmTranXJ.modify";
            break;
        case "AF":
            url = "FrmWareTranAF.modify";
            break;
        case "BD":
            url = "FrmWareTranBD.modify";
            break;
        case "BF":
            url = "FrmWareTranBF.modify";
            break;
        case "AJ":
            url = "FrmWareTranAJ.modify";
            break;
        case "AK":
            url = "FrmSecondmentApply.modify";
            break;
        case "BP":
            url = "FrmSecondmentReview.modify";
            break;
        case "AO":
            url = "FrmTranAO.modify";
            break;
        case "BO":
            url = "FrmTranBO.modify";
            break;
        case "BI":
            url = "FrmTranBI.modify";
            break;
        case "WP":
            url = "FrmNewWorkPiece.modify";
            break;
        case "FB":
            url = "FrmWareTranFB.modify";
            break;
        case "DC":
            url = "FrmWareTranDC.modify";
            break;
        default:
            url = "";
            break;
    }
    return url;
}
