import React from "react";
import DataSet from "../db/DataSet";
import QueryService from "../db/QueryService";
import Grid from "../rcc/Grid";
import TGrid, { TGridColumn, TGridConfig } from "../vcl/TGrid";
import { Loading, showMsg } from "./Summer";
//@ts-ignore
import { all, create } from 'mathjs';
const config = {}
const math = create(all, config);

type propsType = {
    token: string;
    // 显示可用库存
    avaiStockOption: boolean;
    allowViewProfit: boolean;
    isCustomer: boolean;
    corpNo: string;
}

type stateType = {
    config: TGridConfig,
}

const CUSTOMER_181013 = "181013";
const CUSTOMER_131001 = "131001";
const CUSTOMER_194005 = "194005";
const SEARCH_SESSION_KEY = 'TSchProductAnalysis:search';
const loading = new Loading('系统正在查询中 . . .');
const MAX_RECORD = 10000;

export default class TSchProductAnalysis extends React.Component<propsType, stateType>{
    private async: boolean;
    private dataSet: DataSet;
    private grid: Grid;

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

        this.dataSet = new DataSet();
        let fields = this.dataSet.fieldDefs;
        // 导出专用
        fields.add("DescSpecExcel").setOnGetText((row, meta) => {
            meta.setType('s12');
            let desc = row.getValue("Desc_");
            let spec = row.getValue("Spec_");
            return desc + (spec != '' ? ('，' + spec) : "");
        })
        fields.add("ProfitRate_").setOnGetText((row, meta) => {
            let profitRate = row.getDouble(meta.code);
            return profitRate ? profitRate + "%" : "";
        })

        // 处理特殊导出栏位
        let items = new Map<string, string>();
        items.set('0', "普通");
        items.set('1', "新品");
        items.set('2', "热销");
        items.set('3', "特价");
        items.set('4', "经典");
        fields.add("SalesStatus_").setOnGetText((row, meta) => {
            meta.setType('s2');
            let salesStatus = row.getString("SalesStatus_");
            if (salesStatus == '')
                salesStatus = '0';
            return items.get(salesStatus);
        })

        fields.add("LowerShelf_").setOnGetText((row, meta) => {
            meta.setType('s3');
            return row.getBoolean('LowerShelf_') ? '已下架' : '未下架';
        })

        let config = new TGridConfig();
        // 页面显示数据源
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
            );
        });

        if (!this.props.isCustomer)
            new TGridColumn(config, "NewUP_", "最新单价").setWidth(4);// custom

        new TGridColumn(config, "Num_", "销售数量").setWidth(4);
        new TGridColumn(config, "Amount_", "销售金额").setWidth(4);
        new TGridColumn(config, "BackNum_", "退货数量").setWidth(4);
        new TGridColumn(config, "BackAmount_", "退货金额").setWidth(4);
        new TGridColumn(config, "SpareNum_", "赠品数量").setWidth(4);

        // 没权限时值全部设置为空串
        new TGridColumn(config, "CostAmount_", "成本").setWidth(4);
        new TGridColumn(config, "Profit_", "毛利").setWidth(4);
        new TGridColumn(config, "ProfitRate_", "毛利率").setWidth(4);// createText 增加 %

        new TGridColumn(config, "Stock_", "当前库存").setWidth(4);

        if (this.props.avaiStockOption) {
            new TGridColumn(config, "AvaiStock_", "可用库存").setWidth(4);// avaiStockOption
        }

        if (this.props.corpNo == CUSTOMER_181013) {
            new TGridColumn(config, "OutSumAmount_", "业务成本").setWidth(4);// CUSTOMER_181013
            new TGridColumn(config, "OutSumProfit_", "业务毛利").setWidth(4);// CUSTOMER_181013
        }

        if (this.props.isCustomer) {
            new TGridColumn(config, "FirstInDate", "首次入库").setWidth(4);// custom，createText
            new TGridColumn(config, "OriUP_", "单价").setWidth(4);// custom
        }

        new TGridColumn(config, "Opera", "操作").setWidth(4).setAlign("center").setExport(false).setOnRender((column, row) => {
            let partCode = row.getString("PartCode_");
            //@ts-ignore
            let dateFrom = document.getElementById('TBDate_From').value;
            //@ts-ignore
            let dateTo = document.getElementById('TBDate_To').value;
            let href = `TSchProductAnalysis.detail?partCode=${partCode}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
            return (
                <React.Fragment>
                    <a href={href} target="_blank">内容</a>
                </React.Fragment>
            )
        })

        let item = document.getElementsByName('submit1');
        if (item.length > 0) {
            item[0].addEventListener('click', this.submitClick);
        }

        let exportFile = document.getElementById('exportFile');
        exportFile.addEventListener('click', this.exportFileClick);
        //@ts-ignore
        exportFile.href = "#";

        let exportFileMergeDescSpec = document.getElementById('exportFileMergeDescSpec');
        exportFileMergeDescSpec.addEventListener('click', this.exportFileMergeDescSpecClick);
        //@ts-ignore
        exportFileMergeDescSpec.href = "#";

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
            if (element.name == 'PartClass_') {
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
        headIn.setValue('timestamp', new Date().getTime());
        svr.setService("TAppProductAnalyse.download");
        this.async = true;
        this.getDatas(svr);
    }

    // 拷贝数据集栏位信息
    copyFields(dataIn: DataSet) {
        if (dataIn.fieldDefs.size == 0) {
            return;
        }

        let originFields = this.dataSet.fieldDefs;// FIXME 引用修改有风险，需要使用克隆字段的方式
        let targetFields = dataIn.fieldDefs;
        targetFields.forEach(k => originFields.fields.push(k));
    }

    getDatas(svr: QueryService) {
        svr.open().then(dataOut => {
            this.copyFields(dataOut);
            dataOut.first();
            while (dataOut.fetch()) {
                let partCode = dataOut.getString("PartCode_");
                if (this.dataSet.locate("PartCode_", partCode)) {
                    this.dataSet.setValue("Num_", math.round(this.dataSet.getDouble("Num_") + dataOut.getDouble("Num_"), 2));
                    this.dataSet.setValue("Amount_", math.round(this.dataSet.getDouble("Amount_") + dataOut.getDouble("Amount_"), 2));
                    this.dataSet.setValue("BackNum_", math.round(this.dataSet.getDouble("BackNum_") + dataOut.getDouble("BackNum_"), 2));
                    this.dataSet.setValue("BackAmount_", math.round(this.dataSet.getDouble("BackAmount_") + dataOut.getDouble("BackAmount_"), 2));
                    this.dataSet.setValue("SpareNum_", math.round(this.dataSet.getDouble("SpareNum_") + dataOut.getDouble("SpareNum_"), 2));

                    // 成本金额
                    this.dataSet.setValue("CostAmount_", math.round(this.dataSet.getDouble("CostAmount_") + dataOut.getDouble("CostAmount_"), 2));
                    this.dataSet.setValue("OutSumAmount_", math.round(this.dataSet.getDouble("OutSumAmount_") + dataOut.getDouble("OutSumAmount_"), 2));
                    this.dataSet.setValue("OutSumProfit_", math.round(this.dataSet.getDouble("OutSumProfit_") + dataOut.getDouble("OutSumProfit_"), 2));
                } else {
                    this.dataSet.append();
                    this.dataSet.copyRecord(dataOut.current, dataOut.fieldDefs);
                }
            }

            // 是否加载下一页
            if (dataOut.head.getBoolean("_has_next_")) {
                if (this.dataSet.size < MAX_RECORD) {
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
        if(this.grid) {
            this.grid.initGrid()
        }
        // 重置显示次序和金额计算
        this.dataSet.first();
        while (this.dataSet.fetch()) {
            this.dataSet.setValue("sn_", this.dataSet.recNo);

            // 小数点统一保留2位
            let amount = this.dataSet.getDouble("Amount_");
            let backAmount = this.dataSet.getDouble("BackAmount_");
            let costAmount = this.dataSet.getDouble("CostAmount_");
            //@ts-ignore
            let totalProfit = amount - backAmount - costAmount;
            //@ts-ignore
            let total = amount - backAmount;

            // 成本栏位要重新计算
            this.dataSet.setValue("Profit_", math.round(totalProfit, 2));// 毛利

            // 毛利率
            let profitRate = '';
            if (total != 0)
                profitRate = String(math.round((totalProfit / total) * 100, 2));
            this.dataSet.setValue("ProfitRate_", profitRate);
        }

        // 数据合计
        let outNum = 0;
        let outAmount = 0;
        let backNum = 0;
        let backAmount = 0;
        let spareNum = 0;
        let totalAmount = 0;
        let costAmount = 0;

        // 客制化
        let outSumAmount = 0;
        let outSumProfit = 0;
        this.dataSet.forEach((dataRow) => {
            outNum += dataRow.getDouble("Num_");
            outAmount += dataRow.getDouble("Amount_");
            backNum += dataRow.getDouble("BackNum_");
            backAmount += dataRow.getDouble("BackAmount_");
            spareNum += dataRow.getDouble("SpareNum_");
            totalAmount += dataRow.getDouble("Amount_") - dataRow.getDouble("BackAmount_");
            costAmount += dataRow.getDouble("CostAmount_");
            outSumAmount += dataRow.getDouble("OutSumAmount_");
            outSumProfit += dataRow.getDouble("OutSumProfit_");
        })
        document.getElementById('outNum').innerText = String(math.round(outNum, 2));
        document.getElementById('outAmount').innerText = String(math.round(outAmount, 2));
        document.getElementById('backNum').innerText = String(math.round(backNum, 2));
        document.getElementById('backAmount').innerText = String(math.round(backAmount, 2));
        document.getElementById('spareNum').innerText = String(math.round(spareNum, 2));
        document.getElementById('totalAmount').innerText = String(math.round(totalAmount, 2));

        if (document.getElementById('outSumAmount'))
            document.getElementById('outSumAmount').innerText = String(math.round(outSumAmount, 2));
        if (document.getElementById('outSumProfit'))
            document.getElementById('outSumProfit').innerText = String(math.round(outSumProfit, 2));

        if (this.props.allowViewProfit) {
            document.getElementById('costAmount').innerText = String(math.round(costAmount, 2));
            // 毛利 = 销售金额 - 退货金额 - 成本
            let profit = outAmount - backAmount - costAmount;
            document.getElementById('profit').innerText = String(math.round(profit, 2));
        }
        //@ts-ignore
        document.getElementById('dataSize').innerText = this.dataSet.size;
        return (
            <Grid config={this.state.config} setChild={this.setChild.bind(this)}/>
        )
    }

    /**
     * 拆分品名规格导出
     */
    exportFileClick = (e: any) => {
        // 取消默认的post事件
        e.preventDefault();

        // 导出显示数据源
        let grid = new TGrid(null);
        grid.setDataSet(this.dataSet);
        new TGridColumn(grid, "Brand_", "品牌");
        new TGridColumn(grid, "PartCode_", "商品编号");
        new TGridColumn(grid, "Desc_", "品名");
        new TGridColumn(grid, "Spec_", "规格");
        this.exportFile(grid);

        grid.exportFile("单品销售分析.csv");
    }

    /**
     * 合并品名规格
     */
    exportFileMergeDescSpecClick = (e: any) => {
        // 取消默认的post事件
        e.preventDefault();

        // 导出显示数据源
        let grid = new TGrid(null);
        grid.setDataSet(this.dataSet);
        new TGridColumn(grid, "Brand_", "品牌");
        new TGridColumn(grid, "PartCode_", "商品编号");
        new TGridColumn(grid, "DescSpecExcel", "品名规格");

        this.exportFile(grid);

        grid.exportFile("单品销售分析（品名规格合并）.csv");
    }

    exportFile(grid: TGrid) {
        new TGridColumn(grid, "Stock_", "当前库存");
        new TGridColumn(grid, "Num_", "销售数量");
        new TGridColumn(grid, "Amount_", "销售金额");
        new TGridColumn(grid, "BackNum_", "退货数量");
        new TGridColumn(grid, "BackAmount_", "退货金额");
        new TGridColumn(grid, "SpareNum_", "赠品数量");
        new TGridColumn(grid, "CostAmount_", "成本");
        new TGridColumn(grid, "Profit_", "毛利");
        new TGridColumn(grid, "ProfitRate_", "毛利率");// createText 增加 %

        if (this.props.avaiStockOption) {
            new TGridColumn(grid, "AvaiStock_", "可用库存");// avaiStockOption
        }

        if (this.props.isCustomer) {
            new TGridColumn(grid, "DefaultCW_", "储位");
            new TGridColumn(grid, "SalesStatus_", "销售类别");
            new TGridColumn(grid, "FirstInDate", "首次入库时间");// custom，createText
            new TGridColumn(grid, "LowerShelf_", "下架");
        } else {
            new TGridColumn(grid, "NewUP_", "最新单价");// custom
        }

        // 狼王
        if (this.props.corpNo == CUSTOMER_131001) {
            new TGridColumn(grid, "CusNum", "销售家数");
        }
        // 水能
        if (this.props.corpNo == CUSTOMER_181013) {
            new TGridColumn(grid, "OutSumAmount_", "业务成本");// CUSTOMER_181013
            new TGridColumn(grid, "OutSumProfit_", "业务毛利");// CUSTOMER_181013
        }
        // 精工社
        if (this.props.corpNo == CUSTOMER_194005) {
            new TGridColumn(grid, "BoxNum_", "单位包装量");
            new TGridColumn(grid, "TotalBox", "总箱数");
        }
    }

    setChild(_grid: Grid) {
        this.grid = _grid;
    }

}