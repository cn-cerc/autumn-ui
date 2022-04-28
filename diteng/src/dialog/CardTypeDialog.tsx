import { BaseDialogPropsType, DataSet, BaseDialogStateType, BaseDialog, DBGrid, Column, DataRow } from "autumn-ui";
import React from "react";
import styles from "./StaffDialog.css";

type CardTypeTypeProps = {
    inputId: string,
} & Partial<BaseDialogPropsType>

type CardTypeTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class CardTypeDialog extends BaseDialog<CardTypeTypeProps, CardTypeTypeState> {
    constructor(props: CardTypeTypeProps) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('Type_', '蓝卡').setValue('Text_', '普通连接,一般用于开放商品资料、下单、进货用,其它共享默认关闭').setValue('Value_', '0');
        dataSet.append().setValue('Type_', '绿卡').setValue('Text_', '互惠连接,在普通互联的基础上,上游能看到自家的商品在下游的库存(仅库存)').setValue('Value_', '1');
        dataSet.append().setValue('Type_', '红卡').setValue('Text_', '受控连接,一般用于总部控制分部,可以看到下游的所有资料(含财务)').setValue('Value_', '2');
        dataSet.append().setValue('Type_', '黑卡').setValue('Text_', '暂时还未开放!').setValue('Value_', '3');

        this.state = {
            ...this.state,
            dataSet,
            width: '32rem',
            height: '20rem'
        }
        this.setTitle('请选择互联卡类型')
    }

    content(): JSX.Element {
        return (
            <div role='content' className={styles.main}>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <Column code='Type_' name='类型' width='10'></Column>
                    <Column code='Text_' name='说明' width='45'></Column>
                    <Column code='opera' name='操作' width='10' textAlign='center' customText={(row: DataRow) => {
                        return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    handleClick(row: DataRow) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = row.getString('Value_');
        this.handleSelect();
    }
}