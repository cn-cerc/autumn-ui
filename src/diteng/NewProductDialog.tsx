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
import styles from "./StaffDialog.css";
import { showMsg } from "./Summer";

type propsType = {
    inputId: string,
    maxRecord: string,
} & Partial<BaseDialogPropsType>

type stateType = {
    dataIn: DataRow,
    dataSet: DataSet,
    brandList: Map<string, string>,
    class1List: Map<string, string>,
    class2List: Map<string, string>,
    class3List: Map<string, string>
} & Partial<BaseDialogStateType>

export default class NewProductDialog extends BaseDialog<propsType, stateType> {
    constructor(props: propsType) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('MaxRecord_', this.props.maxRecord);
        dataIn.setValue('Brand_', '');
        dataIn.setValue('Class1_', '');
        dataIn.setValue('Class2_', '');
        dataIn.setValue('Class3_', '');
        let brandList = new Map();
        brandList.set('所有品牌', '');
        let class1List = new Map();
        class1List.set('所有大类', '');
        let class2List = new Map();
        class2List.set('所有中类', '');
        let class3List = new Map();
        class3List.set('所有系列', '');
        this.state = {
            ...this.state,
            brandList,
            dataSet: new DataSet(),
            dataIn,
            class1List,
            class2List,
            class3List,
            width: '60rem'
        }
        this.setTitle('请选择商品');
        this.init();
    }

    async init() {
        let brandDataOut = await DialogApi.getBrandList();
        if (brandDataOut.state <= 0) {
            showMsg(brandDataOut.message)
        }
        let brandList = new Map();
        brandList.set('所有品牌', '');
        brandDataOut.first();
        while (brandDataOut.fetch()) {
            brandList.set(brandDataOut.getValue('Brand_'), brandDataOut.getValue('Brand_'));
        }
        let class1DataOut = await DialogApi.getClass1();
        let class1List = new Map();
        class1List.set('所有大类', '');
        class1DataOut.first();
        while (class1DataOut.fetch()) {
            class1List.set(class1DataOut.getValue('Name_'), class1DataOut.getValue('Name_'));
        }
        let dataSet = await this.getNewProducts(this.state.dataIn);
        if (dataSet.state <= 0) {
            showMsg(dataSet.message)
        }
        this.setState({
            dataSet,
            brandList,
            class1List
        })
    }

    content(): JSX.Element {
        return (
            <div role='content' className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.handleSubmit.bind(this)}>
                    <DBDrop dataField='Brand_' dataName='商品品牌' options={this.state.brandList} onChanged={this.brandChange.bind(this)}></DBDrop>
                    <DBDrop dataField='Class1_' dataName='商品大类' options={this.state.class1List} onChanged={this.class1Change.bind(this)}></DBDrop>
                    <DBDrop dataField='Class2_' dataName='商品中类' options={this.state.class2List} onChanged={this.class2Change.bind(this)}></DBDrop>
                    <DBDrop dataField='Class3_' dataName='商品系列' options={this.state.class3List}></DBDrop>
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
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <ColumnIt />
                    <Column code='Brand_' name='品牌' width='20'></Column>
                    <Column code='Spec_' name='品名' width='40' customText={this.initSpec}></Column>
                    <Column code='Code_' name='料号' width='30'></Column>
                    <Column code='opera' name='操作' width='15' textAlign='center' customText={this.initOpera.bind(this)}></Column>
                </DBGrid>
            )
        }
    }

    brandChange() {
        this.state.dataIn.setValue('Class1_', '');
        this.state.dataIn.setValue('Class2_', '');
        this.state.dataIn.setValue('Class3_', '');
        let class2List = new Map();
        class2List.set('所有中类', '');
        let class3List = new Map();
        class3List.set('所有系列', '');
        this.setState({
            class2List,
            class3List
        })
    }

    async class1Change() {
        this.setLoad(true);
        let class2DataOut = await DialogApi.getClass2({
            Brand_: this.state.dataIn.getString('Brand_'),
            Class1_: this.state.dataIn.getString('Class1_')
        });
        let class2List = new Map();
        class2List.set('所有中类', '');
        this.state.dataIn.setValue('Class2_', '');
        this.state.dataIn.setValue('Class3_', '');
        let class3List = new Map();
        class3List.set('所有系列', '');
        class2DataOut.first();
        while (class2DataOut.fetch()) {
            class2List.set(class2DataOut.getValue('Class2_'), class2DataOut.getValue('Class2_'));
        }
        this.setLoad(false);
        this.setState({
            class2List,
            class3List
        })
    }

    async class2Change() {
        this.setLoad(true);
        let class3DataOut = await DialogApi.getClass3({
            Brand_: this.state.dataIn.getString('Brand_'),
            Class1_: this.state.dataIn.getString('Class1_'),
            Class2_: this.state.dataIn.getString('Class2_')
        });
        let class3List = new Map();
        class3List.set('所有系列', '');
        this.state.dataIn.setValue('Class3_', '');
        class3DataOut.first();
        while (class3DataOut.fetch()) {
            class3List.set(class3DataOut.getValue('Class3_'), class3DataOut.getValue('Class3_'));
        }
        this.setLoad(false);
        this.setState({
            class3List
        })
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
        let dataSet = await this.getNewProducts(row);
        if (dataSet.state <= 0) {
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
                return <span role='opera' onClick={this.handleClick.bind(this, dataRow)}>选择</span>
        }
        else {
            if (dataRow.getString('Classify_') == '1')
                return (
                    <span><GetMarque partCode={dataRow.getString('Code_')} isChild={true} name='展开' handleClose={this.handleClick.bind(this)} /></span>
                )
            else
                return <span role='opera' onClick={this.handleClick.bind(this, dataRow)} >选择</span>
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

    async getNewProducts(row: DataRow): Promise<DataSet> {
        this.setLoad(true);
        let NewProducts = await DialogApi.getProducts(this.state.dataIn);
        this.setLoad(false);
        return NewProducts;
    }
}