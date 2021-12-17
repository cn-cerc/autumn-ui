/** 用户商品搜索开窗时子项商品列表开窗 */
import React, { ReactNode } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import FieldMeta from "../db/FieldMeta";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import Block, { Line } from "../rcc/Block";
import { ColumnIt } from "../rcc/ColumnIt";
import DBCheckbox from "../rcc/DBCheckbox";
import DBEdit from "../rcc/DBEdit";
import DBGrid, { Column } from "../rcc/DBGrid";
import SearchPanel from "../rcc/SearchPanel";
import DialogApi from "./DialogApi";
import DitengCommon from "./DitengCommon";
import styles from "./MarqueDialog.css";
import { showMsg } from "./Summer";

type MarqueDialogTypeProps = {
    partCode: string,
    name?: string,
    isChild?: boolean,
    handleClose?: Function,
    params?: string
} & Partial<BaseDialogPropsType>

type MarqueDialogTypeState = {
    headData: DataSet,
    dataSet: DataSet,
    filters: Map<string, string>,
    dbData: DataSet,
    params: DataRow,
    shopData: DataSet,
    searchData: DataRow,
    showAll: boolean
} & Partial<BaseDialogStateType>

export default class MarqueDialog extends BaseDialog<MarqueDialogTypeProps, MarqueDialogTypeState>{
    constructor(props: MarqueDialogTypeProps) {
        super(props);
        let params: DataRow = new DataRow()
        params.setJson(this.props.params || '')
        let tb = params.getString("tb");
        let shopData: DataSet = new DataSet();
        shopData.head.setValue('num', 1);
        shopData.head.setValue('chkPartCode', false);
        shopData.head.setValue('postUrl', 'TWebShopping.addDetail');
        shopData.head.setValue('confirmText', '添加');
        shopData.head.setValue('freeText', '赠品');
        if (tb == 'AL') {
            shopData.head.setValue('postUrl', 'TFrmTranAL.addDetail');
            shopData.head.setValue('confirmText', '添加出库');
            shopData.head.setValue('freeText', '添加入库');
        } else if (tb == 'OM') {
            shopData.head.setValue('postUrl', 'TFrmBOM.nextStep');
        }
        let width: string = '95%';
        let height: string = '95%';
        if (this.isPhone) {
            width = '100%';
            height = '100%';
        }
        this.state = {
            ...this.state,
            headData: new DataSet(),
            dataSet: new DataSet(),
            filters: new Map(),
            dbData: new DataSet(),
            searchData: new DataRow(),
            width,
            height,
            shopData,
            showAll: false,
            params,
        }
        this.setTitle(`型号选择,当前单别：${tb}`);
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let searchText: string = this.state.searchData.getString('SearchText_');
        let dataSet = await DialogApi.getMarqueList({ Marque_: this.props.partCode, param: this.props.params, searchText });
        if (dataSet.state <= 0) {
            showMsg(dataSet.message)
        }
        let subItem = await DialogApi.getSubItem({ Marque_: this.props.partCode });
        if (subItem.state <= 0) {
            showMsg(subItem.message)
        }
        let headData = new DataSet();
        let options = subItem.head.getValue('Option_');
        if (options)
            headData.setJson(options);
        let filters: Map<string, string> = new Map();
        headData.records.forEach((row: DataRow) => {
            filters.set(row.getString('Name_'), '');
        })
        headData.head.setValue('shopStatus', dataSet.head.getBoolean('shopStatus'))

        let userInfo: DataSet = await DialogApi.getUserInfo();
        if (userInfo.state <= 0) {
            showMsg(userInfo.message)
        }
        headData.head.setValue('corpNo', userInfo.head.getString('CorpNo_'))

        let dbData: DataSet = new DataSet();
        dbData.appendDataSet(dataSet);
        this.setState({
            dataSet,
            headData,
            filters,
            dbData
        })
        this.setLoad(false);
    }

    content() {
        return (
            <React.Fragment>
                <div className={styles.main}>
                    <div className={styles.upperPart}>
                        <div className={styles.headContent}>
                            {this.getHead()}
                        </div>
                        {this.state.params.getString('tb') == 'DA' ? this.getTableAD() : this.getTable()}
                    </div>
                    <div className={styles.bottom}>
                        <DBCheckbox dataRow={this.state.shopData.head} dataField={'chkPartCode'} dataName='全选' onChanged={this.chkPartCode.bind(this)} />
                        {this.getBottom()}
                    </div>
                </div>
            </React.Fragment>
        )
    }

    getTable() {
        if (this.isPhone) {
            return (
                <Block dataSet={this.state.dbData} onRowClick={this.handleClick.bind(this)}>
                    <Line>
                        <Column code='_select_' width='3' >
                            <DBCheckbox dataField="_select_" isUseChangedEvent={false} />
                        </Column>
                        <ColumnIt width='5' name='' />
                        <Column code='DescSepc' name='品名规格' width='30' customText={this.initDescSepc.bind(this)} />
                    </Line>
                    <Line>
                        <Column code='Brand_' name='品牌' width='15' />
                    </Line>
                    <Line>
                        <Column code='Stock_' name='库存量' width='4' />
                        <Column code='Unit_' name='单位' width='3' />
                    </Line>
                    <Line>
                        <Column code='Unit1_' name='包装' width='3' />
                        <Column code='Rate1_' name='包装量' width='4' />
                    </Line>
                    <Line>
                        <Column code='GoodUP_' name='标准价' width='4' />
                        {this.state.params.has('LendCorpNo_') ? <Column code='LendStock' name='借调方库存' width='6' /> : ''}
                    </Line>
                </Block>
            )
        } else {
            return (
                <DBGrid dataSet={this.state.dbData} onRowClick={this.handleClick.bind(this)}>
                    <Column code='_select_' name='选择' width='3' >
                        <DBCheckbox dataField="_select_" isUseChangedEvent={false} />
                    </Column>
                    <ColumnIt width="5" />
                    <Column code='Brand_' name='品牌' width='15' />
                    <Column code='DescSepc' name='品名规格' width='30' customText={this.initDescSepc.bind(this)} />
                    <Column code='Unit1_' name='包装' width='3' />
                    <Column code='Rate1_' name='包装量' width='4' />
                    <Column code='Unit_' name='单位' width='3' />
                    <Column code='Stock_' name='库存量' width='4' />
                    {this.state.params.has('LendCorpNo_') ? <Column code='LendStock' name='借调方库存' width='6' /> : ''}
                    <Column code='GoodUP_' name='标准价' width='4' />
                </DBGrid>
            )
        }
    }

    getTableAD() {
        if (this.isPhone) {
            return (
                <Block dataSet={this.state.dbData} onRowClick={this.handleClick.bind(this)}>
                    <Line>
                        <Column code='_select_' width='3' >
                            <DBCheckbox dataField="_select_" isUseChangedEvent={false} />
                        </Column>
                        <ColumnIt width='2' name='' />
                        <Column code='DescSepc' name='品名规格' width='30' customText={this.initDescSepc.bind(this)} />
                    </Line>
                    <Line>
                        <Column code='Brand_' name='品牌' width='15' />
                    </Line>
                    <Line>
                        <Column code='WarnNum_' name='安全库存' width='5' />
                        <Column code='OrdNum_' name='待出货量' width='5' />
                    </Line>
                    <Line>
                        <Column code='Stock_' name='当前库存' width='5' />
                        <Column code='PurNum_' name='待进货量' width='5' />
                    </Line>
                    <Line>
                        <Column code='BalanceNum_' name='平衡量' width='5' customText={(dataRow: DataRow) => {
                            return (
                                <React.Fragment>
                                    <span style={{ 'width': '50%', 'display': 'inline-block' }}>平衡量：</span>
                                    <a href={`PartInfoMRP?code=${dataRow.getString('Code_')}`} target={'_blank'}>
                                        {dataRow.getString('BalanceNum_')}
                                    </a>
                                </React.Fragment>

                            )
                        }} />
                        <Column code='GoodUP_' name='进货价' width='5' />
                    </Line>
                    <Line>
                        <Column code='DANum_' name='建议采购' width='5' />
                        <Column code='SupCode_' name='主供应商' width='5' customText={(dataRow: DataRow) => {
                            return (
                                <React.Fragment>
                                    <span style={{ 'width': '50%', 'display': 'inline-block' }}>主供应商：</span>
                                    <a href={`SupInfo?code=${dataRow.getString('SupCode_')}`} target={'_blank'}>
                                        {dataRow.getString('SupName_')}
                                    </a>
                                </React.Fragment>
                            )
                        }} />
                    </Line>
                </Block >
            )
        } else {
            return (
                <DBGrid dataSet={this.state.dbData} onRowClick={this.handleClick.bind(this)}>
                    <Column code='_select_' name='选择' width='3' >
                        <DBCheckbox dataField="_select_" isUseChangedEvent={false} />
                    </Column>
                    <ColumnIt width="5" />
                    <Column code='Brand_' name='品牌' width='12' />
                    <Column code='DescSepc' name='品名规格' width='30' customText={this.initDescSepc.bind(this)} />
                    <Column code='WarnNum_' name='安全库存' width='5' />
                    <Column code='OrdNum_' name='待出货量' width='5' />
                    <Column code='Stock_' name='当前库存' width='5' />
                    <Column code='PurNum_' name='待进货量' width='5' />
                    <Column code='BalanceNum_' name='平衡量' width='5' customText={(dataRow: DataRow) => {
                        return (
                            <a href={`PartInfoMRP?code=${dataRow.getString('Code_')}`} target={'_blank'}>
                                {dataRow.getString('BalanceNum_')}
                            </a>
                        )
                    }} />
                    <Column code='DANum_' name='建议采购' width='5' />
                    <Column code='GoodUP_' name='进货价' width='5' />
                    <Column code='SupCode_' name='主供应商' width='5' customText={(dataRow: DataRow) => {
                        return (
                            <a href={`SupInfo?code=${dataRow.getString('SupCode_')}`} target={'_blank'}>
                                {dataRow.getString('SupName_')}
                            </a>
                        )
                    }} />
                </DBGrid>
            )
        }
    }

    getHead() {
        let heads: JSX.Element[] = [];
        if (this.state.headData.head.getString('corpNo') == DitengCommon.CUSTOMER_184021) {
            heads.push(
                <SearchPanel dataRow={this.state.searchData} onExecute={this.init.bind(this)}>
                    <DBEdit dataName='查询条件' dataField='SearchText_' autoFocus></DBEdit>
                </SearchPanel>
            )
        } else {
            let bool = true;
            let num = 0;
            let dataSet = this.state.headData;
            for (let index = 0; index < dataSet.size; index++) {
                let row: DataRow = dataSet.records[index];
                if (num > 3 && !this.state.showAll) {
                    heads.push(
                        <div style={{ 'text-align': 'right' }} key='setAll'>
                            <span role='opera' onClick={this.changeShowAll.bind(this)}>展开↓</span>
                        </div>
                    )
                    break;
                }
                let name = row.getString('Name_');
                heads.push(
                    <div className={styles.head} key={name}><Head dataRow={row} selectValue={this.state.filters.get(name)} handleClick={this.filter.bind(this)} /></div>
                );
                num++;
            }
            if (dataSet.size > 4 && this.state.showAll) {
                heads.push(
                    <div style={{ 'text-align': 'right' }} key='setAll'>
                        <span role='opera' onClick={this.changeShowAll.bind(this)}>收起↑</span>
                    </div>
                )
            }
        }
        return heads;
    }
    getBottom() {
        if (!this.state.headData.head.getBoolean('shopStatus')) {
            return (
                <span role='button' onClick={this.postPartCode.bind(this, false)}>
                    下一步
                </span>
            )
        } else {
            return <React.Fragment>
                <div role='shopNum'>
                    <DBEdit dataRow={this.state.shopData.head} dataField={'num'} dataName='数量' onChanged={this.chkPartCode.bind(this)} />
                </div>
                <span role='button' onClick={this.postPartCode.bind(this, false)}>
                    {this.state.shopData.head.getString('confirmText')}
                </span>
                <span role='button' onClick={this.postPartCode.bind(this, true)}>
                    {this.state.shopData.head.getString('freeText')}
                </span>
            </React.Fragment>
        }
    }
    initDescSepc(dataRow: DataRow) {
        let params: string[] = [];
        params.push('partCode=' + dataRow.getString('Code_'));
        if (this.state.params.getString('tb') == 'DA')
            params.push('supCode=' + this.state.params.getString('SupCode_'));
        else
            params.push('cusCode=' + this.state.params.getString('CusCode_'));
        let desc: ReactNode[] = [];
        if (dataRow.getInt("sales_") > 0 || "" != dataRow.getString("SPNo_")) {
            desc.push(
                <span key={dataRow.getString('Code_')}
                    style={{
                        'border': '1px solid red',
                        'color': 'red',
                        'padding': ' 0px 0.125em',
                        ' margin-right': '0.25em'
                    }}>促</span>
            );
        }
        desc.push(dataRow.getString('Desc_'));
        if (this.isPhone) {
            return (
                <React.Fragment>
                    <span>
                        <a href={`TFrmTranSP.productDetail?${params.join('&')}`} target={"_blank"}>{desc}</a>，{dataRow.getString('Spec_')}
                    </span>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <a href={`TFrmTranSP.productDetail?${params.join('&')}`} target={"_blank"}>{desc}</a>，{dataRow.getString('Spec_')}
                </React.Fragment>
            )
        }
    }

    handleClick(dataRow: DataRow) {
        dataRow.setValue('_select_', !dataRow.getBoolean('_select_'))
        this.setState(this.state)
    }

    chkPartCode(meta: FieldMeta) {
        if (meta.code == 'chkPartCode') {
            let check = this.state.shopData.head.getBoolean(meta.code);
            let ds = this.state.dbData;
            ds.first();
            while (ds.fetch()) {
                ds.current.getBoolean('_select_')
                ds.setValue('_select_', check);
            }
        }
        this.setState(this.state)
    }

    postPartCode(spareStatus: boolean): void {
        let tb = this.state.params.getString('tb');
        var products: string[] = [];
        let ds = this.state.dbData;
        ds.first();
        while (ds.fetch()) {
            if (ds.current.getBoolean('_select_')) {
                products.push(ds.getString('Code_'))
            }
        }
        if (products.length == 0) {
            showMsg("请选择需要的商品！");
            return;
        }
        showMsg("系统正在把商品添加到单据中，请稍后...");

        let num = this.state.shopData.head.getString('num');
        let params: string[] = [];
        params.push(`num=${num}`);
        params.push(`tb=${tb}`);
        params.push(`spareStatus=${spareStatus}`);
        products.forEach((value) => {
            params.push(`products=${value}`);
        })

        fetch(this.state.shopData.head.getString('postUrl'), {
            method: 'POST',
            body: params.join('&'),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then(function (response) {
            return response.json();
        }).then((result) => {
            showMsg(result.msg);
            if (result.ok) {
                if (result.url) {
                    window.location = result.url;
                } else {
                    document.querySelector('.header-center-right').innerHTML = result.menu;
                    let shopNums = document.querySelector('[role=shopNums]');
                    shopNums.innerHTML = result.num;
                    shopNums.className = 'shopNums';
                    this.handleClose()
                }
            }
        }).catch((result) => {
            showMsg(result.message);
        })
    }

    changeShowAll() {
        this.setState({
            showAll: !this.state.showAll
        })
    }

    filter(key: string, value: string) {
        if (this.state.filters.get(key) == value)
            this.state.filters.set(key, '');
        else
            this.state.filters.set(key, value);
        let dbData: DataSet = new DataSet();
        dbData.appendDataSet(this.state.dataSet);
        dbData.first();
        while (dbData.fetch()) {
            let bool = true;
            this.state.filters.forEach((value, key) => {
                let str: string = dbData.getString('Desc_') + ',' + dbData.getValue('Spec_')
                if (value && str.indexOf(value) < 0) {
                    bool = false;
                }
            })
            if (!bool) dbData.delete();
        }
        this.setState({ dbData });
    }
}

type HeadTypeProps = {
    dataRow: DataRow,
    handleClick: Function,
    selectValue: string
}

type HeadTypeState = {
    name: string,
    options: string[]
}

class Head extends React.Component<HeadTypeProps, HeadTypeState> {
    constructor(props: HeadTypeProps) {
        super(props);
        let name = this.props.dataRow.getString('Name_');
        let options = this.props.dataRow.getString('Option_').split(',');
        this.state = {
            name,
            options
        }
    }

    render() {
        return (
            <React.Fragment>
                <label>{this.state.name}：</label>
                <ul>{this.getOptions()}</ul>
            </React.Fragment>
        )
    }

    getOptions() {
        return this.state.options.map((op) => {
            return <li key={op} onClick={() => this.handleClick(op)} className={op == this.props.selectValue ? styles.selected : ''} >{op}</li>
        })
    }

    handleClick(option: string) {
        this.props.handleClick(this.props.dataRow.getString('Name_'), option)
    }
}