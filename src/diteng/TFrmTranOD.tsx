import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import QueryService from "../db/QueryService";
import { ClientStorage } from "../db/Utils";
import { ColumnIt } from "../rcc/ColumnIt";
import { ColumnNumber } from "../rcc/ColumnNumber";
import DBGrid, { ChildRow, Column } from "../rcc/DBGrid";
import DitengCommon from "./DitengCommon";
import { Loading } from "./Summer";

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
    dataSet: DataSet
}

const SEARCH_SESSION_KEY = 'TAppTranOD.search_od';
const loading = new Loading('系统正在查询中 . . .');
const MAX_RECORD = 100000;

export default class TFrmTranOD extends React.Component<TFrmTranODTypeProps, TFrmTranODTypeStates> {
    private _async: boolean;
    private _client: ClientStorage = new ClientStorage(`diteng_${this.props.userNo}`)
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
        let item = document.getElementsByName('submit1');
        if (item.length > 0) {
            item[0].addEventListener('click', this.submitClick.bind(this));
        }
        this.state = {
            dataSet: new DataSet()
        }
    }

    submitClick(e: any) {
        e.preventDefault();
        if (this._async)
            return;
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
        let process = search['Process_ '];
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

        sessionStorage.setItem(SEARCH_SESSION_KEY, JSON.stringify(search));
        this.getDatas(svr);
    }

    render(): React.ReactNode {
        return (
            <DBGrid dataSet={this.state.dataSet} dataJson={this._client.get('OD')}>
                {this.getCloumns()}
            </DBGrid>
        )
    }

    getCloumns() {
        let items = [];
        items.push(<ColumnIt key='It_' width='2'></ColumnIt>);
        items.push(<Column code='TBNo_' name='订货单号' width='6' key='TBNo_' customText={(row: DataRow) => {
            return (
                <a href={`TFrmTranOD.modify?tbNo=${row.getString('TBNo_')}`}>
                    <img src={this.getIcon(row.getNumber('Status_'))}></img>
                    {row.getString('TBNo_')}
                </a>
            )
        }}></Column>);
        items.push(<Column code='TBDate_' name='订单日期' width='5' key='TBDate_'></Column>);
        items.push(<Column code='CusName' name='客户简称' width='5' key='CusName' customText={(row: DataRow) => {
            return <a href={`CusInfo?code=${row.getString('CusCode_')}`} target='_blank'>{row.getString('CusName')}</a>
        }}></Column>);
        items.push(<Column code='RecName' name='收货客户' width='5' key='RecName' customText={(row: DataRow) => {
            return <a href={`CusInfo?code=${row.getString('RecCode_')}`} target='_blank'>{row.getString('RecName')}</a>
        }}></Column>);
        items.push(<Column code='CusOrdNo_' name='客户订单' width='6' key='CusOrdNo_' textAlign='center'></Column>);
        items.push(<Column code='WHCode_' name='发货仓别' width='4' key='WHCode_'></Column>);
        items.push(<Column code='SalesName' name='业务人员' width='4' key='SalesName' customText={(row: DataRow) => {
            return <a href={`UserInfo?code=${row.getString('SalesCode_')}`} target='_blank'>{row.getString('SalesName')}</a>
        }}></Column>);
        if (this.props.showWholesaleUP)
            items.push(<ColumnNumber code='TOriAmount_' name='总金额' width='3' key='TOriAmount_' ></ColumnNumber>);
        if (this.props.showWholesaleUP && this.props.isFrmCurrencyRate)
            items.push(<ColumnNumber code='Amount_' name='原币金额' width='3' key='Amount_'></ColumnNumber>);
        items.push(<Column code='PrepareStatus_' name='备货' width='2' key='PrepareStatus_' textAlign='center' customText={(row: DataRow) => {
            return this.getStock(row.getNumber('PrepareStatus_'))
        }}></Column>);
        items.push(<Column code='Process_' name='出货' width='2' key='Process_' textAlign='center' customText={(row: DataRow) => {
            return this.getStock(row.getNumber('Process_'))
        }}></Column>);
        items.push(<ColumnNumber code='PrintTimes_' name='印数' width='2' key='PrintTimes_' textAlign='center'></ColumnNumber>);
        items.push(<Column code='UpdateDate_' name='更新时间' width='7' key='UpdateDate_'></Column>);
        items.push(<Column code='OutDate_' name='订单交期' width='5' key='OutDate_'></Column>);
        items.push(<Column code='ManageNo_' name='管理编号' width='6' key='ManageNo_'></Column>);
        if (this.props.cropNo == DitengCommon.CUSTOMER_214007)
            items.push(<Column code='Products' name='品名规格' width='12' key='Products'></Column>);
        items.push(<ColumnNumber code='SumNum_' name='合计数量' width='4' key='SumNum_'></ColumnNumber>);
        items.push(<Column code='AppName' name='建档人员' width='5' key='AppName' customText={(row: DataRow) => {
            return <a href={`UserInfo?code=${row.getString('AppUser_')}`} target='_blank'>{row.getString('AppName')}</a>
        }}></Column>);
        items.push(
            <ChildRow key='Remark_'>
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
            <ChildRow key='CheckRecord'>
                <Column code='space' width='10' colSpan={1}></Column>
                <Column code='CheckRecord' width='100' colSpan={17} customText={(row: DataRow) => {
                    return <React.Fragment>
                        <span style={{ 'paddingRight': '1em' }}>备注：</span>
                        {row.getString('CheckRecord')}
                    </React.Fragment>
                }}></Column>
            </ChildRow>
        )
        return items;
    }

    getDatas(svr: QueryService) {
        this.state.dataSet.clear();
        svr.open().then(dataOut => {
            this.state.dataSet.appendDataSet(dataOut);
            this.setState(this.state, () => {
                loading.hide();
            });
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
}