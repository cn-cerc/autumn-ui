import { DataRow, DataSet, DBDrop, DBEdit } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import { showMsg } from "../tool/Summer";
import { configType } from "./FrmOEMAppend";
import styles from "./FrmOEMChange.css";

type FrmOEMChangeTypeProps = {
    code: string,
    tbNo: string,
    it: string,
    readonly: boolean
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
                <button onClick={this.handleChange.bind(this)} className={this.props.readonly ? styles.disabled : ''}>修改</button>
            </div>
            {this.getLoad()}
        </div>
    }

    getPageInput() {
        let inputList = this.state.configData.map((config: configType, index: number) => {
            let text = '';
            if (config.isSpec)
                text = '*';
            if (config.type == 1) {
                return <div className={styles.specLine} key={index}>
                    <span>{text}</span><DBEdit dataName={config.name} dataField={config.name} dataRow={this.state.configRow} readOnly={this.props.readonly}></DBEdit>
                </div>
            } else {
                return <div className={styles.specLine} key={index}>
                    <span>{text}</span><DBDrop dataName={config.name} dataField={config.name} options={config.options} dataRow={this.state.configRow} disabled={this.props.readonly}></DBDrop>
                </div>
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
        let ds = await DitengApi.getConfigCodeList(headIn);
        let configRow = new DataRow();
        ds.first();
        while (ds.fetch()) {
            configRow.setValue(ds.getString('Name_'), ds.getString('Value_'))
        }
        let partHeadIn = new DataRow();
        partHeadIn.setValue('Code_', this.state.modelCode);
        let ds2 = await DitengApi.getPartDownload(partHeadIn);
        let modelDetail = new DataRow();
        ds2.first();
        modelDetail.copyValues(ds2.current);
        let dataIn = new DataRow();
        dataIn.setValue('ModelCode_', this.state.modelCode);
        let ds3 = await DitengApi.getModelConfigSearch(dataIn);
        let configData: configType[] = [];
        ds3.first();
        while (ds3.fetch()) {
            if (ds3.getDouble('Type_') === 0) {
                let head = new DataRow();
                head.setValue('ModelCode_', ds3.getString('ModelCode_'));
                head.setValue('Code_', ds3.getString('Code_'));
                let ds4 = await DitengApi.getModelConfigDownload(head);
                let map = new Map();
                map.set('请选择', '');
                ds4.first();
                while (ds4.fetch()) {
                    let value = ds4.getString('Value_');
                    let it = ds4.getString('It_');
                    if (configRow.getString(ds3.getString('Name_')) == value) {
                        configRow.setValue(ds3.getString('Name_'), `${it}\`${value}`);
                    }
                    map.set(value, `${it}\`${value}`);
                }
                configData.push({
                    type: 0,
                    name: ds3.getString('Name_'),
                    isSpec: ds3.getBoolean('IsSpec_'),
                    options: map,
                    remark: ds3.getString('Remark_'),
                    code: ds3.getString('Code_')
                })
            } else {
                configData.push({
                    type: 1,
                    name: ds3.getString('Name_'),
                    isSpec: ds3.getBoolean('IsSpec_'),
                    remark: ds3.getString('Remark_'),
                    code: ds3.getString('Code_')
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
        if (this.props.readonly)
            return;
        if (this.state.isJunp)
            return;
        try {
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
            let isFirst = true;
            this.state.configData.forEach((config: configType, index: number) => {
                dataSet.append();
                let spec_ = '';
                if (config.options) {
                    let arr = this.state.configRow.getString(config.name).split('`');
                    spec_ = arr[1];
                    dataSet.setValue('It_', arr[0]);
                } else
                    spec_ = spec_ = this.state.configRow.getString(config.name);
                if (config.isSpec && spec_) {
                    isFirst = false;
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
                dataSet.setValue('Code_', config.code);
                dataSet.setValue('ImgUrl_', '');
            })
            if (isFirst) {
                throw new Error('带有*的配置必须有一个不为空');
            }
            dataSet.head.setValue('Spec_', spec);
            let dataOut = await DitengApi.updateConfigCode(dataSet);
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
        } catch (e) {
            showMsg(e.message);
            this.setState({
                showLoad: false
            })
        }
    }
}