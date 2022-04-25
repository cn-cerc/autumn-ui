import React from "react";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import styles from "./ProductClassDialog.css";
import DialogApi from "./DialogApi";
import DataSet from "../db/DataSet";
import DataRow from "../db/DataRow";
import { OnSelectDataRowEvent } from "../rcc/DialogComponent";

type ProductListTypeProps = {
    dataSet: DataSet,
    title: string,
    filed: string,
    handleClick: Function,
    defaultVal: string
}

class ProductList extends React.Component<ProductListTypeProps>{
    constructor(props: ProductListTypeProps) {
        super(props);
    }
    render() {
        return (
            <ul className={this.props.dataSet.size == 0 ? styles.hidePartClass : styles.caseCard} >
                <li onClick={() => this.props.handleClick('')} className={'' == this.props.defaultVal ? styles.selected : ''}>{this.props.title}</li>
                {
                    this.props.dataSet.records.map((row: DataRow, index: number) => {
                        let name = row.getString(this.props.filed);
                        return (
                            <li key={index} onClick={() => this.props.handleClick(name)}
                                className={name == this.props.defaultVal ? styles.selected : ''}>
                                {name}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}

type ProductClassTypeProps = {
    productClass: string,
    brand: string,
    inputId: string,
    onSelect?: OnSelectDataRowEvent
} & Partial<BaseDialogPropsType>

type ProductClassTypeState = {
    class1: DataSet,
    class2: DataSet,
    class3: DataSet,
    value1: string,
    value2: string,
    value3: string,
    value: string
} & Partial<BaseDialogStateType>

export default class ProductClassDialog extends BaseDialog<ProductClassTypeProps, ProductClassTypeState> {
    constructor(props: ProductClassTypeProps) {
        super(props);
        this.state = {
            ...this.state,
            class1: new DataSet(),
            class2: new DataSet(),
            class3: new DataSet(),
            value1: '',
            value2: '',
            value3: '',
            width: '55rem',
        };
        this.init();
        this.setTitle('选择商品类别');
    }

    async init() {
        let partClass: string[] = new Array(3).fill('');
        if (this.props.productClass) {
            let productArr = this.props.productClass.split('->');
            if (productArr[0])
                partClass[0] = productArr[0]
            if (productArr[1])
                partClass[1] = productArr[1]
            if (productArr[2])
                partClass[2] = productArr[2]
        }
        try {
            let class1 = await DialogApi.getClass1();
            let class2 = new DataSet();
            let class3 = new DataSet();
            let value1 = partClass[0];
            let value2 = partClass[1];
            let value3 = partClass[2];
            if (value1)
                class2 = await DialogApi.getClass2({ 'Brand_': this.props.brand, 'Class1_': this.replaceChar(value1) });

            if (value2)
                class3 = await DialogApi.getClass3({ 'Brand_': this.props.brand, 'Class1_': this.replaceChar(value1), 'Class2_': this.replaceChar(value2) });
            this.setState({
                ...this.state,
                class1,
                class2,
                class3,
                value1,
                value2,
                value3,
            });
        } catch (e) {
            console.log(e.message)
        }
    }

    content(): JSX.Element {
        return (
            <div className={styles.main}>
                <div className={styles.content}>
                    {<ProductList title='所有大类' dataSet={this.state.class1} filed='Name_' handleClick={this.handleClass1.bind(this)} defaultVal={this.state.value1} />}
                    {<ProductList title='所有中类' dataSet={this.state.class2} filed='Class2_' handleClick={this.handleClass2.bind(this)} defaultVal={this.state.value2} />}
                    {<ProductList title='所有系列' dataSet={this.state.class3} filed='Class3_' handleClick={this.handleClass3.bind(this)} defaultVal={this.state.value3} />}
                </div>
                <div className={styles.submit} onClick={() => this.handleSubmit()}>确认</div>
            </div>
        )
    }

    async handleClass1(name: string): Promise<void> {
        let class2 = new DataSet();
        let class3 = new DataSet();
        this.state.value2 = '';
        this.state.value3 = '';
        class2 = await DialogApi.getClass2({
            Brand_: this.props.brand,
            Class1_: this.replaceChar(name)
        })
        this.setState({
            ...this.state,
            class2,
            class3,
            value1: name,
        })
    }
    async handleClass2(name: string): Promise<void> {
        let class3 = new DataSet();
        this.state.value3 = '';
        class3 = await DialogApi.getClass3({
            Brand_: this.props.brand,
            Class1_: this.replaceChar(this.state.value1),
            Class2_: this.replaceChar(name)
        })
        this.setState({
            ...this.state,
            class3,
            value2: name,
        })
    }
    async handleClass3(name: string): Promise<void> {
        this.setState({
            ...this.state,
            value3: name,
        }, () => {
            this.handleSubmit()
        })
    }

    handleSubmit() {
        if (this.props.onSelect) {
            let inputIds = this.props.inputId.split(',');
            let row = new DataRow();
            if (inputIds.length == 1) {
                let val: string = this.state.value1;
                if (this.state.value2)
                    val += `->${this.state.value2}`
                if (this.state.value3)
                    val += `->${this.state.value3}`
                row.setValue(inputIds[0], val);
            } else if (inputIds.length == 3) {
                row.setValue(inputIds[0], this.state.value1);
                row.setValue(inputIds[1], this.state.value2);
                row.setValue(inputIds[2], this.state.value3);
            }
            this.props.onSelect(row);
            this.handleClose();
        } else {
            let inputIds = this.props.inputId.split(',');
            if (inputIds.length == 1) {
                let val: string = this.state.value1;
                if (this.state.value2)
                    val += `->${this.state.value2}`
                if (this.state.value3)
                    val += `->${this.state.value3}`
                let input = document.getElementById(inputIds[0]) as HTMLInputElement;
                input.value = val;
            } else if (inputIds.length == 3) {
                let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
                let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
                let input3 = document.getElementById(inputIds[2]) as HTMLInputElement;
                input1.value = this.state.value1;
                input2.value = this.state.value2;
                input3.value = this.state.value3;
            }
            this.handleSelect();
        }
    }

    replaceChar(str: string) {
        let res = str.indexOf('&') > -1 ? encodeURI(str).replace(/&/g, '%26') : str;
        return res;
    }
}