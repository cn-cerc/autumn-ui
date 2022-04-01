import React from "react";
import DataRow from "../db/DataRow";
import DBEdit from "../rcc/DBEdit";
import styles from "./FrmOEMChange.css";

type FrmOEMChangeTypeProps = {
    code: string,
    tbNo: string,
    it: string
}

type FrmOEMChangeTypeState = {
    modelDetail: DataRow,
    modelCode: string,
    configCode: string
}

export default class FrmOEMChange extends React.Component<FrmOEMChangeTypeProps, FrmOEMChangeTypeState> {
    constructor(props: FrmOEMChangeTypeProps) {
        super(props);
        let modelCode = this.props.code.split('#')[0];
        let configCode = this.props.code.split('#')[1];
        this.state = {
            modelDetail: new DataRow(),
            modelCode,
            configCode
        }
        console.log(this.state)
    }

    render() {
        return <React.Fragment>
            <div className={styles.module1}>
                <DBEdit dataRow={this.state.modelDetail} dataName='商品编号' dataField='Code_' readOnly></DBEdit>
                <DBEdit dataRow={this.state.modelDetail} dataName='商品品牌' dataField='Brand_' readOnly></DBEdit>
                <DBEdit dataRow={this.state.modelDetail} dataName='商品大类' dataField='Class1_' readOnly></DBEdit>
                <DBEdit dataRow={this.state.modelDetail} dataName='商品中类' dataField='Class2_' readOnly></DBEdit>
                <DBEdit dataRow={this.state.modelDetail} dataName='商品系列' dataField='Class3_' readOnly></DBEdit>
                <DBEdit dataRow={this.state.modelDetail} dataName='商品品名' dataField='Desc_' readOnly></DBEdit>
                <DBEdit dataRow={this.state.modelDetail} dataName='商品规格' dataField='Spec_' readOnly></DBEdit>
                <DBEdit dataRow={this.state.modelDetail} dataName='商品单位' dataField='Unit_' readOnly></DBEdit>
                <DBEdit dataRow={this.state.modelDetail} dataName='包装单位' dataField='BoxUnit_' readOnly></DBEdit>
                <DBEdit dataRow={this.state.modelDetail} dataName='单位包装量' dataField='BoxNum' readOnly></DBEdit>
            </div>
        </React.Fragment>
    }
}