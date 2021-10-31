import DataSet from "../db/DataSet";
import QueryService from "../db/QueryService";
import TGrid from "../ext/TGrid";
import TGridColumn from "../ext/TGridColumn";
import TPage from "../ext/TPage";
import { Loading, showMsg } from "./Summer";

/**
 * 页面查询 sessionStorage
 */
const SEARCH_SESSION_KEY = 'TSchProductAnalysis:search';
const loading = new Loading('系统正在查询中 . . .');
const MAX_RECORD = 10000;

export default class TSchProductAnalysisVcl extends TPage {
    dataSet;
    grid;
    _sid: string;
    _profile: any;
    async = false;

    CUSTOMER_181013 = "181013";
    CUSTOMER_131001 = "131001";
    CUSTOMER_194005 = "194005";

    constructor(profile: string) {
        super(null);

        this.cssClass = 'scrollArea';
        this.profile = JSON.parse(profile);

        this.dataSet = new DataSet();
        let columns = this.dataSet.fieldDefs;
        columns.add("DescSpec").onGetText = function (row, meta) {
            let partCode = row.getValue("PartCode_");
            let desc = row.getValue("Desc_");
            let spec = row.getValue("Spec_");
            return `<a href='PartInfo?code=${partCode}' target="_blank"'>${desc}</a>` + ' ' + spec;
        }
        // 导出专用
        columns.add("DescSpecExcel").onGetText = function (row, meta) {
            let desc = row.getValue("Desc_");
            let spec = row.getValue("Spec_");
            return desc + (spec != '' ? ('，' + spec) : "");
        }
        columns.add("ProfitRate_").onGetText = function (row, meta) {
            let profitRate = row.getDouble(meta.code);
            return profitRate ? profitRate + "%" : "";
        }
        columns.add("Opera").onGetText = function (row, meta) {
            let partCode = row.getString("PartCode_");
            let dateFrom = document.getElementById('TBDate_From').nodeValue;
            let dateTo = document.getElementById('TBDate_To').nodeValue;
            return `<a href='TSchProductAnalysis.detail?partCode=${partCode}&dateFrom=${dateFrom}&dateTo=${dateTo}' target="_blank"'>内容</a>`;
        }

        // 处理特殊导出栏位
        //@ts-ignore
        let items = new Map<string, string>();
        items.set('0', "普通");
        items.set('1', "新品");
        items.set('2', "热销");
        items.set('3', "特价");
        items.set('4', "经典");
        columns.add("SalesStatus_").onGetText = function (row, meta) {
            let salesStatus = row.getString("SalesStatus_");
            if (salesStatus == '')
                salesStatus = '0';
            return items.get(salesStatus);
        }

        columns.add("LowerShelf_").onGetText = function (row, meta) {
            return row.getBoolean('LowerShelf_') ? '已下架' : '未下架';
        }

        // 构建分页数据集
        this.grid = new TGrid(null);
        this.grid.dataSet = this.dataSet;
        this.grid.cssClass = "dbgrid";

        // 页面显示数据源
        new TGridColumn(this.grid, "sn_", "序").setWidth(3).setAlign("center");
        new TGridColumn(this.grid, "DescSpec", "品名规格").setWidth(12);

        if (!this.profile.isCustomer) {
            new TGridColumn(this.grid, "NewUP_", "最新单价").setWidth(4);// custom
        }

        new TGridColumn(this.grid, "Num_", "销售数量").setWidth(4);
        new TGridColumn(this.grid, "Amount_", "销售金额").setWidth(4);
        new TGridColumn(this.grid, "BackNum_", "退货数量").setWidth(4);
        new TGridColumn(this.grid, "BackAmount_", "退货金额").setWidth(4);
        new TGridColumn(this.grid, "SpareNum_", "赠品数量").setWidth(4);

        // 没权限时值全部设置为空串
        new TGridColumn(this.grid, "CostAmount_", "成本").setWidth(4);
        new TGridColumn(this.grid, "Profit_", "毛利").setWidth(4);
        new TGridColumn(this.grid, "ProfitRate_", "毛利率").setWidth(4);// createText 增加 %

        new TGridColumn(this.grid, "Stock_", "当前库存").setWidth(4);

        if (this.profile.avaiStockOption) {
            new TGridColumn(this.grid, "AvaiStock_", "可用库存").setWidth(4);// avaiStockOption
        }

        if (this.profile.corpNo == this.CUSTOMER_181013) {
            new TGridColumn(this.grid, "OutSumAmount_", "业务成本").setWidth(4);// CUSTOMER_181013
            new TGridColumn(this.grid, "OutSumProfit_", "业务毛利").setWidth(4);// CUSTOMER_181013
        }

        if (this.profile.isCustomer) {
            new TGridColumn(this.grid, "FirstInDate", "首次入库").setWidth(4);// custom，createText
            new TGridColumn(this.grid, "OriUP_", "单价").setWidth(4);// custom
        }

        new TGridColumn(this.grid, "Opera", "操作").setWidth(4).setAlign("center").setExport(false);

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
        this.repaint();

        // 构建请求数据
        let svr = new QueryService(this);
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
        svr.service = "TAppProductAnalyse.download";
        this.async = true;
        this.getDatas(svr);
    }

    getDatas(svr: QueryService) {
        svr.open().then(dataOut => {
            dataOut.first();
            while (dataOut.fetch()) {
                let partCode = dataOut.getString("PartCode_");
                if (this.dataSet.locate("PartCode_", partCode)) {
                    this.dataSet.setValue("Num_", this.dataSet.getDouble("Num_") + dataOut.getDouble("Num_"));
                    this.dataSet.setValue("Amount_", this.dataSet.getDouble("Amount_") + dataOut.getDouble("Amount_"));
                    this.dataSet.setValue("BackNum_", this.dataSet.getDouble("BackNum_") + dataOut.getDouble("BackNum_"));
                    this.dataSet.setValue("BackAmount_", this.dataSet.getDouble("BackAmount_") + dataOut.getDouble("BackAmount_"));
                    this.dataSet.setValue("SpareNum_", this.dataSet.getDouble("SpareNum_") + dataOut.getDouble("SpareNum_"));

                    // 成本金额
                    this.dataSet.setValue("CostAmount_", this.dataSet.getDouble("CostAmount_") + dataOut.getDouble("CostAmount_"));
                    this.dataSet.setValue("OutSumAmount_", this.dataSet.getDouble("OutSumAmount_") + dataOut.getDouble("OutSumAmount_"));
                    this.dataSet.setValue("OutSumProfit_", this.dataSet.getDouble("OutSumProfit_") + dataOut.getDouble("OutSumProfit_"));

                } else {
                    this.dataSet.append();
                    this.dataSet.copyRecord(dataOut.getCurrent(), dataOut.fieldDefs);
                }
            }

            // 是否加载下一页
            if (dataOut.head.getBoolean("_has_next_")) {
                if (this.dataSet.size < MAX_RECORD) {
                    this.getDatas(svr);
                } else {
                    this.repaint();
                    this.async = false;
                    loading.hide();
                    showMsg(`数据已超过 ${MAX_RECORD} 笔记录，请重新选择查询条件`);
                    return;
                }
            } else {
                this.async = false;
                loading.hide();
                showMsg('数据加载完成');
            }
            this.repaint();
        }).catch(dataOut => {
            if (dataOut.message) {
                loading.hide();
                showMsg(dataOut.message);
            }
            this.async = false;
        })
    }

    repaint() {
        // 重置显示次序和金额计算
        this.dataSet.first();
        while (this.dataSet.fetch()) {
            this.dataSet.setValue("sn_", this.dataSet.recNo);

            // 小数点统一保留2位
            let amount = this.dataSet.getDouble("Amount_").toFixed(2);
            let backAmount = this.dataSet.getDouble("BackAmount_").toFixed(2);
            let costAmount = this.dataSet.getDouble("CostAmount_").toFixed(2);
        //@ts-ignore
        let totalProfit = amount - backAmount - costAmount;
        //@ts-ignore
        let total = amount - backAmount;

            // 成本栏位要重新计算
            this.dataSet.setValue("Profit_", totalProfit);// 毛利

            // 毛利率
            let profitRate = '';
            if (total != 0)
                profitRate = ((totalProfit / total) * 100).toFixed(2);
            this.dataSet.setValue("ProfitRate_", profitRate);
        }
        this.grid.owner = this;

        super.repaint();

        // 数据合计
        let outNum = 0;
        let outAmount = 0;
        let backNum = 0;
        let backAmount = 0;
        let spareNum = 0;
        let totalAmount = 0;
        let costAmount = 0;
        this.dataSet.forEach((dataRow) => {
            outNum += dataRow.getDouble("Num_");
            outAmount += dataRow.getDouble("Amount_");
            backNum += dataRow.getDouble("BackNum_");
            backAmount += dataRow.getDouble("BackAmount_");
            spareNum += dataRow.getDouble("SpareNum_");
            totalAmount += dataRow.getDouble("Amount_") - dataRow.getDouble("BackAmount_");
            costAmount += dataRow.getDouble("CostAmount_");
        })
        document.getElementById('outNum').innerText = outNum.toFixed(2);
        document.getElementById('outAmount').innerText = outAmount.toFixed(2);
        document.getElementById('backNum').innerText = backNum.toFixed(2);
        document.getElementById('backAmount').innerText = backAmount.toFixed(2);
        document.getElementById('spareNum').innerText = spareNum.toFixed(2);
        document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);
        if (this.profile.allowViewProfit) {
            document.getElementById('costAmount').innerText = costAmount.toFixed(2);
            // 毛利 = 销售金额 - 退货金额 - 成本
            let profit = outAmount - backAmount - costAmount;
            document.getElementById('profit').innerText = profit.toFixed(2);
        }
        //@ts-ignore
        document.getElementById('dataSize').innerText = this.dataSet.size;
    }

    run() {
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
    }

    /**
     * 拆分品名规格导出
     */
    exportFileClick = (e: any) => {
        // 取消默认的post事件
        e.preventDefault();

        // 导出显示数据源
        let grid = new TGrid(null);
        grid.dataSet = this.dataSet;
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
        grid.dataSet = this.dataSet;
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

        if (this.profile.avaiStockOption) {
            new TGridColumn(grid, "AvaiStock_", "可用库存");// avaiStockOption
        }

        if (this.profile.isCustomer) {
            new TGridColumn(grid, "DefaultCW_", "储位");
            new TGridColumn(grid, "SalesStatus_", "销售类别");
            new TGridColumn(grid, "FirstInDate", "首次入库");// custom，createText
            new TGridColumn(grid, "LowerShelf_", "下架");
        } else {
            new TGridColumn(grid, "NewUP_", "最新单价");// custom
        }

        if (this.profile.isCustomer) {
            new TGridColumn(grid, "OriUP_", "单价");// custom
        }

        // 狼王
        if (this.profile.corpNo == this.CUSTOMER_131001) {
            new TGridColumn(grid, "CusNum", "销售家数");
        }
        // 水能
        if (this.profile.corpNo == this.CUSTOMER_131001) {
            new TGridColumn(grid, "OutSumAmount_", "业务成本");// CUSTOMER_181013
            new TGridColumn(grid, "OutSumProfit_", "业务毛利");// CUSTOMER_181013
        }
        // 精工社
        if (this.profile.corpNo == this.CUSTOMER_194005) {
            new TGridColumn(grid, "BoxNum_", "单位包装量");
            new TGridColumn(grid, "TotalBox", "总箱数");
        }
    }

    get sid() {
        return this._sid
    }

    set sid(value) {
        this._sid = value
    }

    get profile() {
        return this._profile
    }

    set profile(value) {
        this._profile = value
    }

}
