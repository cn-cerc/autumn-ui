import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import Block, { Line } from "../rcc/Block";
import { ColumnIt } from "../rcc/ColumnIt";
import DBDrop from "../rcc/DBDrop";
import DBEdit from "../rcc/DBEdit";
import DBGrid, { Column } from "../rcc/DBGrid";
import SearchPanel from "../rcc/SearchPanel";
import DialogApi from "./DialogApi";
import GetMarque from "./GetMarque";
import ProductClassDialog from "./ProductClassDialog";
import styles from "./StaffDialog.css";
import { showMsg } from "./Summer";

type propsType = {
    inputId: string,
    maxRecord: string,
} & Partial<BaseDialogPropsType>

type stateType = {
    dataIn: DataRow,
    dataSet: DataSet,
    brandList: Map<string, string>
} & Partial<BaseDialogStateType>

export default class ProductDialog extends BaseDialog<propsType, stateType> {
    constructor(props: propsType) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('MaxRecord_', this.props.maxRecord);
        let brandList = new Map();
        brandList.set('所有品牌', '');
        this.state = {
            ...this.state,
            brandList,
            dataSet: new DataSet(),
            dataIn,
            width: '60rem',
            height: this.isPhone ? '100%' : '37.5rem'
        }
        this.init();
    }

    async init() {
        let brandDataOut = await DialogApi.getBrandList();
        if(brandDataOut.state <= 0) {
            showMsg(brandDataOut.message)
        }
        let brandList = new Map();
        brandList.set('所有品牌', '');
        brandDataOut.forEach((row: DataRow) => {
            brandList.set(row.getValue('Brand_'), row.getValue('Brand_'));
        })
        let dataSet = await this.getProducts(this.state.dataIn);
        if (dataSet.state <= 0) {
            showMsg(dataSet.message)
        }
        this.setTitle('请选择商品：');
        this.setState({
            dataSet,
            brandList
        })
    }

    content(): JSX.Element {
        return (
            <div role='content' className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.handleSubmit.bind(this)}>
                    <DBDrop dataField='Brand_' dataName='商品品牌' options={this.state.brandList}></DBDrop>
                    <DBEdit dataField='PartClass_' dataName='商品类别' readOnly={true}>
                        <ProductClassDialog brand='' inputId='' productClass='' isChild={true} />
                    </DBEdit>
                    <DBEdit dataField='SearchText_' dataName='查询条件' autoFocus></DBEdit>
                    <DBEdit dataField='MaxRecord_' dataName='载入笔数'></DBEdit>
                </SearchPanel>
                {this.getTable()}
            </div>
        )
    }

    getTable() {
        if (this.isPhone) {
            return (
                <Block dataSet={this.state.dataSet}>
                    <Line>
                        <Column code='Code_' name='编号' width='90' />
                        <Column code='opera' width='20' textAlign='right' customText={this.initOpera.bind(this)} />
                    </Line>
                    <Line>
                        <Column code='Brand_' name='品牌' width='100' />
                    </Line>
                    <Line>
                        <Column code='Class' name='类别' width='100' customText={this.initClass} />
                    </Line>
                    <Line>
                        <Column code='descspec' name='品名规格' width='100' customText={this.initSpec} />
                    </Line>
                </Block>
            )
        } else {
            return (
                <DBGrid dataSet={this.state.dataSet}>
                    <ColumnIt/>
                    <Column code='Brand_' name='品牌' width='20'></Column>
                    <Column code='Spec_' name='品名' width='40' customText={this.initSpec}></Column>
                    <Column code='Code_' name='料号' width='30'></Column>
                    <Column code='opera' name='操作' width='15' textAlign='center' customText={this.initOpera.bind(this)}></Column>
                </DBGrid>
            )
        }
    }

    async handleSubmit(dataRow: DataRow) {
        let row = new DataRow();
        row.copyValues(dataRow);
        let partClass = row.getString('PartClass_');
        if (partClass) {
            let partClasses = partClass.split('->');
            if (partClasses.length > 0)
                row.setValue('Class1_', partClasses[0])
            if (partClasses.length > 1)
                row.setValue('Class2_', partClasses[1])
            if (partClasses.length > 2)
                row.setValue('Class3_', partClasses[2])
        }
        let dataSet = await this.getProducts(row);
        if(dataSet.state <= 0) {
            showMsg(dataSet.message)
        } else {
            this.setState({
                dataSet
            })
        }
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(',');
        var value = dataRow.getString('Code_').split(',');
        for (let i = 0; i < value.length; i++) {
            let input = document.getElementById(inputIds[i]) as HTMLInputElement;
            input.value = value[i];
        }
        this.handleSelect();
    }

    initSpec(dataRow: DataRow) {
        let text;
        if (dataRow.getValue('Spec_'))
            text = ',' + dataRow.getValue('Spec_')
        return <span>{dataRow.getValue('Desc_')}{text}</span>
    }

    initOpera(dataRow: DataRow) {
        if (this.isPhone) {
            if (dataRow.getString('Classify_') == '1') {
                return (
                    <span><GetMarque partCode={dataRow.getString('Code_')} isChild={true} name='展开' handleClose={this.handleClick.bind(this)} /></span>
                )
            }
            else
                return <span role='opera' onClick={() => this.handleClick(dataRow)}>选择</span>
        }
        else {
            if (dataRow.getString('Classify_') == '1')
                return (
                    <GetMarque partCode={dataRow.getString('Code_')} isChild={true} name='展开' handleClose={this.handleClick.bind(this)} />
                )
            else
                return <span role='opera' onClick={() => this.handleClick(dataRow)} >选择</span>
        }
    }

    initClass(dataRow: DataRow) {
        let class_ = dataRow.getString('Class1_');
        if (dataRow.getString('Class2_'))
            class_ += `-${dataRow.getString('Class2_')}`;
        if (dataRow.getString('Class3_'))
            class_ += `-${dataRow.getString('Class3_')}`;
        return <span >{class_}</span>
    }

    async getProducts(row: DataRow): Promise<DataSet> {
        this.setLoad(true);
        let products = new DataSet();
        products = await DialogApi.getProducts(row);
        this.setLoad(false);
        return products;
    }
}