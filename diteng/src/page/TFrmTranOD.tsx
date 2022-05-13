import React from "react";
import { DataSet, DBGrid, QueryService, ColumnIt, Column, DataRow, ColumnNumber, ChildRow, FieldMeta } from "autumn-ui";
import CustomDBGridDialog from "../dialog/CustomDBGridDialog";
import DitengCommon from "../DitengCommon";
import Datetime from "../tool/Datetime";
import { AuiMath, Loading, showMsg } from "../tool/Summer";
import { ClientStorage, Excel } from "../tool/Utils";

type TFrmTranODTypeProps = {
    token: string,
    cropNo: string,
    userNo: string,
    // 是否显示总金额
    showWholesaleUP: boolean,
    // 是否显示原币金额
    isFrmCurrencyRate: boolean
}

type TFrmTranODTypeStates = {
    dataSet: DataSet,
    amount: number,
    number: number,
    originalAmount: number,
    details: DataSet[]
}

const SEARCH_SESSION_KEY = 'TAppTranOD.search_od';
const loading = new Loading('系统正在查询中 . . .');
const exportLoading = new Loading('系统正在导出中 . . .');
const MAX_RECORD = 100000;

export default class TFrmTranOD extends React.Component<TFrmTranODTypeProps, TFrmTranODTypeStates> {
    private _async: boolean;
    private _client: ClientStorage = new ClientStorage(`diteng_${this.props.userNo}`);
    private _total: number;
    private customDBGrid: CustomDBGridDialog;
    constructor(props: TFrmTranODTypeProps) {
        super(props);
        // 初始化查询数据
        let value = sessionStorage.getItem(SEARCH_SESSION_KEY);
        if (value) {
            let json = JSON.parse(value);
            let form = document.getElementById('form1') as HTMLFormElement;
            let elements = form.elements;
            // 恢复input组件的数据信息
            for (let i = 0; i < elements.length; i++) {
                let element = elements.item(i) as HTMLInputElement;
                element.value = json[element.name];
            }
        }
        this.state = {
            dataSet: new DataSet(),
            amount: 0,
            number: 0,
            originalAmount: 0,
            details: []
        }
    }

    componentDidMount(): void {
        let item = document.getElementsByName('submit1');
        if (item.length > 0) {
            item[0].addEventListener('click', this.submitClick.bind(this));
        }
        let custonBtn = document.querySelector('#customBtn');
        if (custonBtn) custonBtn.addEventListener('click', this.showCustom.bind(this));
        let download1 = document.querySelector('#download1');
        if (download1) download1.addEventListener('click', this.getDetails.bind(this));
        let download2 = document.querySelector('#download2');
        if (download2) download2.addEventListener('click', this.download2.bind(this));
    }

    render(): React.ReactNode {
        let amount = document.querySelector('#amount');
        if (amount) amount.innerHTML = this.state.amount.toString();
        let number = document.querySelector('#number');
        if (number) number.innerHTML = this.state.number.toString();
        let originalAmount = document.querySelector('#originalAmount');
        if (originalAmount) originalAmount.innerHTML = this.state.originalAmount.toString();
        return (
            <React.Fragment>
                <DBGrid dataSet={this.state.dataSet} dataJson={this._client.get('OD')} key={new Date().getTime()}>
                    {this.getCloumns()}
                </DBGrid>
                <CustomDBGridDialog ref={self => this.customDBGrid = self} userNo={this.props.userNo} tb='OD' reloadState={this.reloadState.bind(this)} initColumns={this.getCloumns.bind(this)} isChild={true}></CustomDBGridDialog>
            </React.Fragment>
        )
    }

    submitClick(e: any) {
        e.preventDefault();
        if (this._async)
            return;
        this.state.dataSet.clear();
        // 删除表格排序符号
        let thList = document.querySelectorAll('th span');
        for (let i = 0; i < thList.length; i++) {
            thList[i].remove();
        }
        loading.show();
        loading.hideTime = 600;

        let svr = new QueryService(this.props);
        svr.setService('TAppTranOD.search_od');
        let form = document.getElementById('form1') as HTMLFormElement;
        let elements = form.elements;
        let search: any = {};
        for (let num in elements) {
            let input = elements[num] as HTMLInputElement;
            search[input.name] = input.value;
        }

        let headIn = svr.dataIn.head;
        headIn.setValue('TB_', 'OD');
        headIn.setValue('TBDate_From', search['TBDate_From']);
        headIn.setValue('TBDate_To', search['TBDate_To']);
        headIn.setValue('MaxRecord_', search['MaxRecord_']);
        headIn.setValue('Status_', search['Status_'])
        let process = search['Process_'];
        if (process >= 0) headIn.setValue('Process_', process);
        let prepareStatus = search['PrepareStatus_'];
        if (prepareStatus >= 0) headIn.setValue('PrepareStatus_', prepareStatus);
        let cusCode = search['CusCode_'];
        if (cusCode) headIn.setValue('CusCode_', cusCode);
        let recCode = search['RecCode_'];
        if (recCode) headIn.setValue('RecCode_', recCode);
        let tbNo = search['TBNo_'];
        if (tbNo) headIn.setValue('TBNo_', tbNo);

        if (search['noPay'].checked) headIn.setValue('NoPay_', 0);
        if (search['cashAmount'].checked) headIn.setValue('CashAmount_', 1);
        if (search['fastAmount'].checked) headIn.setValue('FastAmount_', 2);
        if (search['bankAmount'].checked) headIn.setValue('BankAmount_', 3);

        let whCode = search['WHCode_'];
        if (whCode) headIn.setValue('WHCode_', whCode);
        let salesCode = search['SalesCode_'];
        if (salesCode) headIn.setValue('SalesCode_', salesCode);
        let fdAppUser = search['AppUser_'];
        if (fdAppUser) headIn.setValue('AppUser_', fdAppUser);
        let searchText = search['SearchText_'];
        if (searchText) headIn.setValue('SearchText_', searchText);
        let cusOrdNo = search['CusOrdNo_'];
        if (cusOrdNo) headIn.setValue('CusOrdNo_', cusOrdNo);

        headIn.setValue("segmentQuery", true);
        headIn.setValue('timestamp', new Date().getTime());
        sessionStorage.setItem(SEARCH_SESSION_KEY, JSON.stringify(search));
        this.getDatas(svr);
    }

    getCloumns() {
        let items = [];
        items.push(<ColumnIt key='It_' width='2'></ColumnIt>);
        items.push(<Column code='TBNo_' name='订货单号' width='6' key='TBNo_' textAlign='center' customText={(row: DataRow) => {
            return (
                <a href={`TFrmTranOD.modify?tbNo=${row.getString('TBNo_')}`}>
                    <img src={this.getIcon(row.getNumber('Status_'))}></img>
                    {row.getString('TBNo_')}
                </a>
            )
        }}></Column>);
        items.push(<Column code='TBDate_' name='订单日期' width='5' textAlign='center' key='TBDate_'></Column>);
        items.push(<Column code='CusName' name='客户简称' width='6' key='CusName' customText={(row: DataRow) => {
            return <a href={`CusInfo?code=${row.getString('CusCode_')}`} target='_blank'>{row.getString('CusName')}</a>
        }}></Column>);
        items.push(<Column code='RecName' name='收货客户' visible={true} width='6' key='RecName' customText={(row: DataRow) => {
            return <a href={`CusInfo?code=${row.getString('RecCode_')}`} target='_blank'>{row.getString('RecName')}</a>
        }}></Column>);
        items.push(<Column code='CusOrdNo_' name='客户订单' width='6' key='CusOrdNo_' textAlign='center'></Column>);
        items.push(<Column code='WHCode_' name='发货仓别' visible={true} width='4' key='WHCode_'></Column>);
        items.push(<Column code='SalesName' name='业务人员' width='4' key='SalesName' customText={(row: DataRow) => {
            return <a href={`UserInfo?code=${row.getString('SalesCode_')}`} target='_blank'>{row.getString('SalesName')}</a>
        }}></Column>);
        if (this.props.showWholesaleUP)
            items.push(<ColumnNumber code='TOriAmount_' name='总金额' width='3' textAlign='right' key='TOriAmount_' ></ColumnNumber>);
        if (this.props.showWholesaleUP && this.props.isFrmCurrencyRate)
            items.push(<ColumnNumber code='Amount_' name='原币金额' visible={true} width='3' textAlign='right' key='Amount_'></ColumnNumber>);
        items.push(<Column code='PrepareStatus_' name='备货' width='2' key='PrepareStatus_' textAlign='center' customText={(row: DataRow) => {
            return this.getStock(row.getNumber('PrepareStatus_'))
        }}></Column>);
        items.push(<Column code='Process_' name='出货' width='2' key='Process_' textAlign='center' customText={(row: DataRow) => {
            return this.getStock(row.getNumber('Process_'))
        }}></Column>);
        items.push(<ColumnNumber code='PrintTimes_' name='印数' width='2' key='PrintTimes_' textAlign='center'></ColumnNumber>);
        items.push(<Column code='UpdateDate_' name='更新时间' visible={true} width='7' textAlign='center' key='UpdateDate_'></Column>);
        items.push(<Column code='OutDate_' name='订单交期' visible={true} width='5' textAlign='center' key='OutDate_'></Column>);
        items.push(<Column code='ManageNo_' name='管理编号' visible={true} width='6' key='ManageNo_'></Column>);
        if (this.props.cropNo == DitengCommon.CUSTOMER_214007)
            items.push(<Column code='Products' name='品名规格' width='12' key='Products'></Column>);
        items.push(<ColumnNumber code='SumNum_' name='合计数量' visible={true} width='4' textAlign='right' key='SumNum_'></ColumnNumber>);
        items.push(<Column code='AppName' name='建档人员' visible={true} width='4' key='AppName' customText={(row: DataRow) => {
            return <a href={`UserInfo?code=${row.getString('AppUser_')}`} target='_blank'>{row.getString('AppName')}</a>
        }}></Column>);
        items.push(
            <ChildRow key='Remark_' autoJudge={true}>
                <Column code='space' width='10' colSpan={1}></Column>
                <Column code='Remark_' width='100' colSpan={17} customText={(row: DataRow) => {
                    return <React.Fragment>
                        <span style={{ 'paddingRight': '1em' }}>备注：</span>
                        {row.getString('Remark_')}
                    </React.Fragment>
                }}></Column>
            </ChildRow>
        )
        items.push(
            <ChildRow key='CheckRecord' autoJudge={true}>
                <Column code='space' width='10' colSpan={1}></Column>
                <Column code='CheckRecord' width='100' colSpan={17} customText={(row: DataRow) => {
                    return <React.Fragment>
                        <span style={{ 'paddingRight': '1em' }}>签核进度：</span>
                        <span dangerouslySetInnerHTML={{ __html: row.getValue('CheckRecord') }}></span>
                    </React.Fragment>
                }}></Column>
            </ChildRow>
        )
        return items;
    }

    getDatas(svr: QueryService) {
        svr.open().then(dataOut => {
            this.state.dataSet.appendDataSet(dataOut);
            // 是否加载下一页
            if (dataOut.head.getBoolean("_has_next_")) {
                if (this.state.dataSet.size < MAX_RECORD) {
                    this.getDatas(svr);
                } else {
                    this._async = false;
                    loading.hide();
                    showMsg(`数据已超过 ${MAX_RECORD} 笔记录，请重新选择查询条件`, true);
                    this.setState(this.state);
                }
            } else {
                let math = new AuiMath();
                let amount = 0;
                let number = 0;
                let originalAmount = 0;
                this.state.dataSet.first();
                while (this.state.dataSet.fetch()) {
                    amount = math.add(amount, (this.props.cropNo == DitengCommon.CUSTOMER_164003 || this.props.cropNo == DitengCommon.CUSTOMER_214015) ? this.state.dataSet.getDouble('FinishAmount_') : this.state.dataSet.getDouble('TOriAmount_'));
                    number = math.add(number, this.state.dataSet.getDouble('SumNum_'));
                    originalAmount = math.add(originalAmount, this.state.dataSet.getDouble('Amount_'));
                }
                this.setState({
                    amount: math.toFixed(amount, 2),
                    number: math.toFixed(number, 2),
                    originalAmount: math.toFixed(originalAmount, 2),
                }, () => {
                    loading.hide();
                    showMsg('数据加载完成');
                    this._async = false;
                    this._total = this.state.dataSet.size;
                });
            }
        }).catch(dataOut => {
            if (dataOut.message) {
                loading.hide();
                showMsg(dataOut.message);
            }
            this._async = false;
            this.setState(this.state);
        })
    }

    getIcon(num: number) {
        switch (num) {
            case 0:
                return 'images/draftStatus.png';
            case 1:
                return 'images/sureStatus.png';
            case -1:
                return 'images/cancelStatus.png';
            case 2:
                return 'images/checkIng.png';
            default:
                return '';
        }
    }

    getStock(num: number) {
        let title: string = '';
        if (num == 0) title = '等待备货';
        else if (num == 1) title = '部分备货';
        else if (num == 2) title = '备货完成';
        else title = '状态错误';
        return <div className={`progress${num + 1}`} title={title}><span></span></div>
    }

    showCustom(e: any) {
        e.preventDefault();
        this.customDBGrid.showAsChild();
    }

    reloadState() {
        this.setState(this.state)
    }

    download1() {
        this.state.dataSet.first();
        let meta: any = {
            TBNo_: '订单编号',
            It_: '订序',
            PartCode_: '商品编号',
            Class1_: '大类',
            Class2_: '中类',
            Desc_: '品名',
            Spec_: '规格',
            Unit_: '单位',
            Rate1_: '包装量',
            Num1_: '件数',
            Num_: '数量',
            SpareNum_: '内含备品',
            OriUP_: '单价',
            OriAmount_: '金额',
            Remark_: '备注',
        }
        let ds = new DataSet();
        let ruleOut = ['It_', 'Rate1_', 'Num1_', 'Num_', 'SpareNum_', 'OriUP_', 'OriAmount_']
        while (this.state.dataSet.fetch()) {
            let ds2 = new DataSet();
            ds2.appendDataSet(this.state.details[this.state.dataSet.recNo - 1]);
            ds2.first();
            if (ds2.size > 0) {
                ds.append().setValue('TBNo_', '业务订单').setValue('It_', this.state.dataSet.getString('TBNo_'));
                ds.append().setValue('TBNo_', '订单日期').setValue('It_', this.state.dataSet.getString('TBDate_'));
                ds.append().setValue('TBNo_', '客户简称').setValue('It_', this.state.dataSet.getString('CusName'));
                let statu: string = '';
                switch (this.state.dataSet.getDouble('Status_')) {
                    case 0:
                        statu = '草稿';
                        break;
                    case 1:
                        statu = '生效';
                        break;
                    case -1:
                        statu = '作废';
                        break;
                    default:
                        statu = '';
                        break;
                }
                ds.append().setValue('TBNo_', '单据状态').setValue('It_', statu);
                ds.append();
                for (let key in meta) {
                    ds.setValue(key, meta[key])
                }
                let totalNum = 0;
                let totalMoney = 0;
                while (ds2.fetch()) {
                    ds.append();
                    for (let key in meta) {
                        if (ruleOut.indexOf(key) > -1)
                            ds.setValue(key, { text: ds2.getDouble(key) })
                        else
                            ds.setValue(key, ds2.getString(key))
                    }
                    totalNum += ds2.getDouble('Num_');
                    totalMoney += ds2.getDouble('OriAmount_');
                }
                ds.append().setValue('TBNo_', '合计数量').setValue('It_', totalNum);
                ds.append().setValue('TBNo_', '合计金额').setValue('It_', totalMoney);
                ds.append();
                ds.append();
                ds.append();
            }
        }
        exportLoading.hide();
        new Excel().exportExcelByRecords(ds, `业务订单明细-${new Datetime().format('yyyyMMdd')}.xls`)
    }

    getDetails(e: any) {
        e.preventDefault();
        if (this.state.dataSet.size > 0) {
            this.state.dataSet.first();
            exportLoading.show();
            while (this.state.dataSet.fetch()) {
                let service = new QueryService(this.props);
                let recNo = this.state.dataSet.recNo;
                service.setService('TAppTranOD.getDetailData');
                service.dataIn.head.setValue('TBNo_', this.state.dataSet.getString('TBNo_'))
                service.open(30).then(dataOut => {
                    this.state.details[recNo - 1] = dataOut;
                    this._total--;
                    if (this._total <= 0) {
                        this.download1()
                    }
                })
            }
        }
    }

    download2(e: any) {
        e.preventDefault();
        let dataSet = new DataSet();
        if (this.state.dataSet.size > 0) {
            exportLoading.show();
            let meta: any = {
                'CusCode_': '客户代码',
                'CusName': '客户简称',
                'TBNo_': '订单单号',
                'TBDate_': '单据日期',
                'OutDate_': '订单交期',
                'TOriAmount_': '订单金额',
                'Status_': '单据状态',
                'CusType_': '客户类型',
                'CusOrdNo_': '客户订单号',
                'PrintTimes_': '打印次数',
                'SalesName': '业务人员',
                'WHCode_': '发货仓别',
                'Logistics_': '物流公司',
                'FastMail_': '运单号码',
                'FreightWay_': '货运方式',
                'ERPControl_': 'ERP状态',
                'Process_': '出货进度',
                'Remark_': '备注',
                'PayTypeDetail': '收款类别明细',
                'Tax_': '税金',
                'Currency_': '币别',
                'ExRate_': '汇率',
                'ManageNo_': '管理编号',
                'PayType_': '收款类别',
                'UpdateUser_': '更新人员',
                'UpdateDate_': '更新日期',
                'AppUser_': '建档人员',
                'AppDate_': '建档日期',
                'DeptName': '部门名称'
            }
            let ruleOut = ['TOriAmount_', 'PrintTimes_', 'ERPControl_', 'Tax_', 'ExRate_', 'PayType_']
            for (let key of Object.keys(meta)) {
                let fm = new FieldMeta(key).setName(meta[key]);
                if (ruleOut.indexOf(fm.code) == -1)
                    fm.setType('s');
                else
                    fm.setType('n');
                dataSet.fields.items.push(fm)
            }
            this.state.dataSet.records.forEach((row: DataRow) => {
                dataSet.append();
                dataSet.fields.forEach((meta: FieldMeta) => {
                    if (meta.code == 'Status_') {
                        switch (row.getDouble('Status_')) {
                            case 0:
                                dataSet.setValue('Status_', '草稿');
                                break;
                            case 1:
                                dataSet.setValue('Status_', '生效');
                                break;
                            case -1:
                                dataSet.setValue('Status_', '作废');
                                break;
                            default:
                                dataSet.setValue('Status_', '');
                                break;
                        }
                    } else if (meta.code == 'Process_') {
                        switch (row.getDouble('Process_')) {
                            case 0:
                                dataSet.setValue('Process_', '0.等待出货');
                                break;
                            case 1:
                                dataSet.setValue('Process_', '1.部分出货');
                                break;
                            case 2:
                                dataSet.setValue('Process_', '2.全部出货');
                                break;
                            case 3:
                                dataSet.setValue('Process_', '3.未出货完成');
                                break;
                            default:
                                dataSet.setValue('Process_', '');
                                break;
                        }
                    } else
                        dataSet.setValue(meta.code, row.getValue(meta.code));
                });
            })
            dataSet.append();
            dataSet.setValue('CusCode_', '合计金额').setValue('TOriAmount_', this.state.amount);
            exportLoading.hide();
            new Excel().exportExcel(dataSet, `订单数据-${new Datetime().format('yyyyMMdd')}.xls`)
        }
    }
}