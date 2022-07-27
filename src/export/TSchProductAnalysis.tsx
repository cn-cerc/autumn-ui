import { Block, Column, DataRow, DataSet, Grid, Line, QueryService, TGrid, WebControl } from "autumn-ui";
import { TGridColumn, TGridConfig } from "autumn-ui/src/vcl/TGrid";
import React from "react";
import DitengCommon from "../static/DitengCommon";
import { exportUrl } from "../static/ExportConfig";
import { AuiMath, Loading, showMsg } from "../tool/Summer";
import styles from "./TSchProductAnalysis.css";

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

const SEARCH_SESSION_KEY = 'TSchProductAnalysis:search';
const loading = new Loading('系统正在查询中 . . .');
const MAX_RECORD = 100000;

export default class TSchProductAnalysis extends WebControl<propsType, stateType>{
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
        let fields = this.dataSet.fields;
        // 导出专用
        fields.add("DescSpecExcel").setOnGetText((row, meta) => {
            meta.setType('s12');
            let desc = row.getValue("Desc_");
            let spec = row.getValue("Spec_");
            return desc + (spec != '' ? ('，' + spec) : "");
        })
        fields.add("ProfitRateExcel").setOnGetText((row, meta) => {
            meta.setType('s6');
            let profitRate = row.getString("ProfitRateExcel");
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
        new TGridColumn(config, "Profit_", "毛利").setWidth(4).setOnRender((column, row) => {
            let text = '';
            if (this.props.allowViewProfit)
                text = row.getString('Profit_')
            return <span>{text}</span>
        });
        new TGridColumn(config, "ProfitRateExcel", "毛利率").setWidth(4).setOnRender((column, row) => {
            let text = '';
            if (this.props.allowViewProfit) {
                let pro = row.getString('ProfitRateExcel');
                text = pro ? `${pro}%` : '0%';
            }
            return <span>{text}</span>
        });// createText 增加 %

        new TGridColumn(config, "Stock_", "当前库存").setWidth(4);

        if (this.props.avaiStockOption) {
            new TGridColumn(config, "AvaiStock_", "可用库存").setWidth(4);// avaiStockOption
        }
        if (this.props.corpNo == DitengCommon.CUSTOMER_181013) {
            new TGridColumn(config, "OutSumAmount_", "业务成本").setWidth(4);// DitengCommon.CUSTOMER_181013
            new TGridColumn(config, "OutSumProfit_", "业务毛利").setWidth(4);// DitengCommon.CUSTOMER_181013
        }

        if (this.props.isCustomer) {
            new TGridColumn(config, "FirstInDate", "首次入库").setWidth(4);// custom，createText
            new TGridColumn(config, "OriUP_", "单价").setWidth(4);// custom
        }

        new TGridColumn(config, "Opera", "操作").setWidth(4).setAlign("center").setExport(false).setOnRender((column, row) => {
            let partCode = encodeURIComponent(row.getString("PartCode_"));
            //@ts-ignore
            let dateFrom = document.getElementById('TBDate_From').value;
            //@ts-ignore
            let dateTo = document.getElementById('TBDate_To').value;
            let href = `TSchProductAnalysis.detail?partCode=${partCode}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
            return (
                <React.Fragment>
                    <a href={href} target="_blank" style={{ 'display': 'block', 'textAlign': 'center' }}>内容</a>
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

        // 删除表格排序符号
        let thList = document.querySelectorAll('th span');
        for (let i = 0; i < thList.length; i++) {
            thList[i].remove();
        }

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
        if (dataIn.fields.size == 0) {
            return;
        }

        let originFields = this.dataSet.fields;// FIXME 引用修改有风险，需要使用克隆字段的方式
        let targetFields = dataIn.fields;
        targetFields.forEach(k => originFields.items.push(k));
    }

    setSortCode(code: string): string {
        if (code == 'DescSpec') {
            return 'Desc_,Spec_'
        }
        return code;
    }

    getDatas(svr: QueryService) {
        let math = new AuiMath();
        svr.open().then(dataOut => {
            this.copyFields(dataOut);
            dataOut.first();
            while (dataOut.fetch()) {
                let partCode = dataOut.getString("PartCode_");
                if (this.dataSet.locate("PartCode_", partCode)) {
                    this.dataSet.setValue("Num_", math.toFixed((this.dataSet.getDouble("Num_") + dataOut.getDouble("Num_")), 2));
                    this.dataSet.setValue("Amount_", math.toFixed(this.dataSet.getDouble("Amount_") + dataOut.getDouble("Amount_"), 2));
                    this.dataSet.setValue("BackNum_", math.toFixed(this.dataSet.getDouble("BackNum_") + dataOut.getDouble("BackNum_"), 2));
                    this.dataSet.setValue("BackAmount_", math.toFixed(this.dataSet.getDouble("BackAmount_") + dataOut.getDouble("BackAmount_"), 2));
                    this.dataSet.setValue("SpareNum_", math.toFixed(this.dataSet.getDouble("SpareNum_") + dataOut.getDouble("SpareNum_"), 2));

                    // 成本金额
                    this.dataSet.setValue("CostAmount_", math.toFixed(this.dataSet.getDouble("CostAmount_") + dataOut.getDouble("CostAmount_"), 2));
                    this.dataSet.setValue("OutSumAmount_", math.toFixed(this.dataSet.getDouble("OutSumAmount_") + dataOut.getDouble("OutSumAmount_"), 2));
                    this.dataSet.setValue("OutSumProfit_", math.toFixed(this.dataSet.getDouble("OutSumProfit_") + dataOut.getDouble("OutSumProfit_"), 2));
                    this.dataSet.setValue("NewUP_", dataOut.getDouble("NewUP_"));
                } else {
                    this.dataSet.append();
                    this.dataSet.copyRecord(dataOut.current, dataOut.fields);
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
                let sortSelect = document.getElementById('Sort') as HTMLSelectElement;
                let sort = sortSelect.value;
                if (sort == 'Amount')
                    this.dataSet.setSort('Amount_ DESC');
                else if (sort == 'Profit')
                    this.dataSet.setSort('Profit_ DESC');
                else if (sort == 'ProfitRate')
                    this.dataSet.setSort('ProfitRate_ DESC');
                else if (sort == 'Num')
                    this.dataSet.setSort('Num_ DESC');
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
        let math = new AuiMath();
        if (this.grid) {
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
            this.dataSet.setValue("Profit_", math.toFixed(totalProfit, 2));// 毛利

            // 毛利率
            let profitRate = 0;
            if (total != 0)
                profitRate = math.toFixed((totalProfit / total) * 100, 2);
            this.dataSet.setValue("ProfitRateExcel", profitRate);
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
        document.getElementById('outNum').innerText = math.toFixed(outNum, 2).toString();
        document.getElementById('outAmount').innerText = math.toFixed(outAmount, 2).toString();
        document.getElementById('backNum').innerText = math.toFixed(backNum, 2).toString();
        document.getElementById('backAmount').innerText = math.toFixed(backAmount, 2).toString();
        document.getElementById('spareNum').innerText = math.toFixed(spareNum, 2).toString();
        document.getElementById('totalAmount').innerText = math.toFixed(totalAmount, 2).toString();

        if (document.getElementById('outSumAmount'))
            document.getElementById('outSumAmount').innerText = math.toFixed(outSumAmount, 2).toString();
        if (document.getElementById('outSumProfit'))
            document.getElementById('outSumProfit').innerText = math.toFixed(outSumProfit, 2).toString();

        if (this.props.allowViewProfit) {
            document.getElementById('costAmount').innerText = math.toFixed(costAmount, 2).toString();
            // 毛利 = 销售金额 - 退货金额 - 成本
            let profit = outAmount - backAmount - costAmount;
            document.getElementById('profit').innerText = math.toFixed(profit, 2).toString();
        }
        if (!this.isPhone) {
            let dataDom = document.getElementById('dataSize') as HTMLDivElement;
            dataDom.innerText = this.dataSet.size.toString();
        }
        return (
            this.getGrid()
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
        this.buildExport(grid);

        grid.exportExcel(exportUrl, "单品销售分析.xls");
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

        this.buildExport(grid);

        grid.exportExcel(exportUrl, "单品销售分析（品名规格合并）.xls");
    }

    buildExport(grid: TGrid) {
        new TGridColumn(grid, "Stock_", "当前库存");
        new TGridColumn(grid, "Num_", "销售数量");
        new TGridColumn(grid, "Amount_", "销售金额");
        new TGridColumn(grid, "BackNum_", "退货数量");
        new TGridColumn(grid, "BackAmount_", "退货金额");
        new TGridColumn(grid, "SpareNum_", "赠品数量");
        new TGridColumn(grid, "CostAmount_", "成本");
        new TGridColumn(grid, "Profit_", "毛利");
        new TGridColumn(grid, "ProfitRateExcel", "毛利率");// createText 增加 %

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
        if (this.props.corpNo == DitengCommon.CUSTOMER_131001) {
            new TGridColumn(grid, "CusNum", "销售家数");
        }
        // 水能
        if (this.props.corpNo == DitengCommon.CUSTOMER_181013) {
            new TGridColumn(grid, "OutSumAmount_", "业务成本");// DitengCommon.CUSTOMER_181013
            new TGridColumn(grid, "OutSumProfit_", "业务毛利");// DitengCommon.CUSTOMER_181013
        }
        // 精工社
        if (this.props.corpNo == DitengCommon.CUSTOMER_194005) {
            new TGridColumn(grid, "BoxNum_", "单位包装量");
            new TGridColumn(grid, "TotalBox", "总箱数");
        }
    }

    setChild(_grid: Grid) {
        this.grid = _grid;
    }

    getGrid() {
        let dataSet = new DataSet();
        dataSet.appendDataSet(this.state.config.dataSet);
        if (this.isPhone) {
            let dateFrom = document.getElementById('TBDate_From') as HTMLInputElement;
            let dateTo = document.getElementById('TBDate_To') as HTMLInputElement;
            return (
                <div className={styles.main}>
                    <Block dataSet={dataSet}>
                        <Line>
                            <Column code='DescSpec_' width='88' customText={(row: DataRow) => {
                                return (
                                    <React.Fragment>
                                        <span style={{ 'paddingRight': '.2rem' }}>{row.dataSet.recNo}</span>
                                        <a href={`PartInfo?code=${row.getValue("PartCode_")}`} target="_blank">{row.getValue("Desc_")}</a> {row.getValue("Spec_")}
                                    </React.Fragment>
                                );
                            }}></Column>
                            <Column code='opera' textAlign='right' width='12' customText={(row: DataRow) => {
                                return (
                                    <React.Fragment>
                                        <a href={`TSchProductAnalysis.detail?partCode=${encodeURIComponent(row.getString("PartCode_"))}&dateFrom=${dateFrom.value}&dateTo=${dateTo.value}`} target="_blank">内容</a>
                                    </React.Fragment>
                                )
                            }}></Column>
                        </Line>
                        <Line>{this.getAvaiStockOption()}</Line>
                        <Line>
                            <Column name='销售数量' code='Num_' width='45'></Column>
                            <Column name='销售金额' code='Amount_' width='55'></Column>
                        </Line>
                        <Line>
                            <Column name='退货数量' code='BackNum_' width='45'></Column>
                            <Column name='退货金额' code='BackAmount_' width='55'></Column>
                        </Line>
                        <Line>
                            <Column name='赠品数量' code='SpareNum_' width='45'></Column>
                            <Column name='成本' code='CostAmount_' width='55'></Column>
                        </Line>
                        <Line>
                            <Column name='毛利' code='Profit_' width='45' customText={(row: DataRow) => {
                                let text = '';
                                if (this.props.allowViewProfit)
                                    text = row.getString('Profit_')
                                return <span>毛利：{text}</span>
                            }}></Column>
                            <Column name='毛利率' code='ProfitRateExcel' width='55' customText={(row: DataRow) => {
                                let text = '';
                                if (this.props.allowViewProfit) {
                                    let pro = row.getString('ProfitRateExcel');
                                    text = pro ? `${pro}%` : '0%';
                                }
                                return <span>毛利率：{text}</span>
                            }}></Column>
                        </Line>
                        <Line>{this.getFirstInDate()}</Line>
                        <Line>{this.getPrice()}</Line>
                        <Line>{this.getOutSum()}</Line>
                    </Block>
                </div>
            )
        } else {
            return (
                <Grid config={this.state.config} setChild={this.setChild.bind(this)} dataSet={dataSet} sortFilter={this.setSortCode} />
            )
        }
    }

    getAvaiStockOption() {
        let items = [];
        items.push(
            <Column name='当前库存' code='Stock_' width='45' key='Stock_'></Column>
        );
        if (this.props.avaiStockOption)
            items.push(
                <Column name='可用库存' code='AvaiStock_' width='55' key='AvaiStock_'></Column>
            )
        return items
    }

    getFirstInDate() {
        let items = [];
        if (this.props.isCustomer)
            items.push(
                <Column name='首次入库' code='FirstInDate' width='100' key='FirstInDate'></Column>
            )
        return items;
    }

    getPrice() {
        let items = [];
        items.push(
            <Column name={this.props.isCustomer ? '单价' : '最新单价'} code={this.props.isCustomer ? 'OriUP_' : 'NewUP_'} width='100' key={this.props.isCustomer ? 'OriUP_' : 'NewUP_'}></Column>
        )
        return items;
    }

    getOutSum() {
        let items = [];
        if (DitengCommon.CUSTOMER_181013 == this.props.corpNo) {
            items.push(
                <Column name='业务成本' code='OutSumAmount_' width='45' key='OutSumAmount_'></Column>
            )
            items.push(
                <Column name='业务毛利' code='OutSumProfit_' width='55' key='OutSumProfit_'></Column>
            )
        }
        return items;
    }
}