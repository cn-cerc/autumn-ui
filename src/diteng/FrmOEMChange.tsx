import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import DBDrop from "../rcc/DBDrop";
import DBEdit from "../rcc/DBEdit";
import DialogApi from "./DialogApi";
import { configType } from "./FrmOEMAppend";
import styles from "./FrmOEMChange.css";
import { showMsg } from "./Summer";

type FrmOEMChangeTypeProps = {
    code: string,
    tbNo: string,
    it: string
}

type FrmOEMChangeTypeState = {
    modelDetail: DataRow,
    modelCode: string,
    configCode: string,
    configData: configType[],
    configRow: DataRow,
    showLoad: boolean,
    loadText: string,
    isJunp: boolean
}

export default class FrmOEMChange extends React.Component<FrmOEMChangeTypeProps, FrmOEMChangeTypeState> {
    constructor(props: FrmOEMChangeTypeProps) {
        super(props);
        let modelCode = this.props.code.split('#')[0];
        let configCode = this.props.code.split('#')[1];
        this.state = {
            modelDetail: new DataRow(),
            modelCode,
            configCode,
            configData: [],
            configRow: new DataRow(),
            showLoad: false,
            loadText: '系统正在查询中，请稍后...',
            isJunp: false
        }
    }

    render() {
        return <div className={styles.main}>
            <div className={styles.module1} key={this.state.modelDetail.json}>
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
            <div className={styles.module2}>
                {this.getPageInput()}
            </div>
            <div className={styles.module3}>
                <button onClick={this.handleChange.bind(this)}>修改</button>
            </div>
            {this.getLoad()}
        </div>
    }

    getPageInput() {
        let inputList = this.state.configData.map((config: configType, index: number) => {
            if (config.type == 1) {
                return <DBEdit dataName={config.name} dataField={config.name} key={index} dataRow={this.state.configRow}></DBEdit>
            } else {
                return <DBDrop dataName={config.name} dataField={config.name} options={config.options} key={index} dataRow={this.state.configRow}></DBDrop>
            }
        })
        return inputList;
    }

    getLoad() {
        if (this.state.showLoad) {
            return (
                <div className={styles.load}>
                    <img src='https://www.diteng.site/public/images/loading.gif' />
                    <span>{this.state.loadText}</span>
                </div>
            )
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setState({
            showLoad: true,
            loadText: '系统正在查询中，请稍后...'
        })
        let headIn = new DataRow();
        headIn.setValue('ModelCode_', this.state.modelCode);
        headIn.setValue('ConfigCode_', this.state.configCode);
        let ds = await DialogApi.getConfigCodeList(headIn);
        let configRow = new DataRow();
        ds.first();
        while (ds.fetch()) {
            configRow.setValue(ds.getString('Name_'), ds.getString('Value_'))
        }
        let partHeadIn = new DataRow();
        partHeadIn.setValue('Code_', this.state.modelCode);
        let ds2 = await DialogApi.getPartDownload(partHeadIn);
        let modelDetail = new DataRow();
        ds2.first();
        modelDetail.copyValues(ds2.current);
        let dataIn = new DataRow();
        dataIn.setValue('ModelCode_', this.state.modelCode);
        let ds3 = await DialogApi.getModelConfigSearch(dataIn);
        let configData: configType[] = [];
        ds3.first();
        while (ds3.fetch()) {
            if (ds3.getDouble('Type_') === 0) {
                let head = new DataRow();
                head.setValue('ModelCode_', ds3.getString('ModelCode_'));
                head.setValue('Code_', ds3.getString('Code_'));
                let ds4 = await DialogApi.getModelConfigDownload(head);
                let map = new Map();
                map.set('请选择', '');
                ds4.first();
                while (ds4.fetch()) {
                    let value = ds4.getString('Value_');
                    map.set(value, value);
                }
                configData.push({
                    type: 0,
                    name: ds3.getString('Name_'),
                    options: map,
                    remark: ds3.getString('Remark_')
                })
            } else {
                configData.push({
                    type: 1,
                    name: ds3.getString('Name_'),
                    remark: ds3.getString('Remark_')
                })
            }
        }
        this.setState({
            modelDetail,
            configData,
            configRow,
            showLoad: false
        })
    }

    async handleChange() {
        if(this.state.isJunp)
            return;
        this.setState({
            showLoad: true,
            loadText: '系统正在添加商品中，请稍后...'
        })
        let dataSet = new DataSet();
        dataSet.head.copyValues(this.state.modelDetail);
        dataSet.head.setValue('ModelCode_', this.state.modelCode);
        dataSet.head.setValue('ConfigCode_', this.state.configCode);
        dataSet.head.setValue('TBNo_', this.props.tbNo);
        let spec = '';
        let bool = true;
        this.state.configData.forEach((config: configType, index: number) => {
            dataSet.append();
            let spec_ = this.state.configRow.getString(config.name);
            if (spec_) {
                if (bool) {
                    spec = spec_;
                    bool = false;
                } else {
                    spec += `,${spec_}`
                }
            }
            dataSet.setValue('Name_', config.name);
            dataSet.setValue('Value_', spec_);
            dataSet.setValue('Type_', config.type);
            dataSet.setValue('Remark_', config.remark);
            dataSet.setValue('ImgUrl_', '');
        })
        dataSet.head.setValue('Spec_', spec);
        let dataOut = await DialogApi.updateConfigCode(dataSet);
        if (dataOut.state > 0) {
            showMsg('修改成功');
            this.setState({
                isJunp: true
            })
            location.href = `TFrmTranOD.modify?tbNo=${this.props.tbNo}`
        } else {
            showMsg(dataOut.message)
        }
        this.setState({
            showLoad: false
        })
    }
}