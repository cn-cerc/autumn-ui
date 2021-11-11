import React, { ChangeEventHandler, MouseEventHandler } from "react";
import DataSet from "../db/DataSet";
import QueryService from "../db/QueryService";
import DialogGrid from "../rcc/DialogGrid";
import DataRow from "../db/DataRow";
import DBEdit from "../rcc/DBEdit";
import { TGridColumn, TGridConfig } from "../vcl/TGrid";
import { showMsg } from "./Summer";
import styles from './BrandDialog.css';

type propsType = {
    token: any,
    inputId: any,
    viewId: any,
    items: any
}

type stateType = {
    dataIn: DataRow;
    config: TGridConfig;
}

export default class BrandDialog extends React.Component<propsType, stateType> {
    constructor(props: propsType) {
        super(props);
        let dataSet: DataSet = new DataSet();
        dataSet.setJsonString(this.props.items);
        let config: TGridConfig = new TGridConfig();
        new TGridColumn(config, "Brand_", "品牌").setWidth(4);
        new TGridColumn(config, "ShareMode_", "开放模式").setWidth(3).setOnRender((column, row) => {
            let span: string;
            let shareMode = row.getString("ShareMode_");
            switch(shareMode) {
                case "0": 
                    span = shareMode + ",不允许指定客户";
                    break;
                case "1":
                    span = shareMode + ",允许指定客户";
                    break;
                case "2":
                    span = shareMode + ",允许所有客户";
                    break;
                default:
                    span = "0,不允许指定客户";
                    break;
            }
            return span;
        });
        new TGridColumn(config, "Opera", "操作").setWidth(2).setAlign("center").setOnRender((column, row) => {
            return (<span onClick={()=>this.handleClick(row.getString("Brand_"))} className={styles.searchSpan}>选择</span>);
        })
        config.setDataSet(dataSet);
        this.state = { dataIn: new DataRow(), config };
    }

    handleClick(brand: string) {
        $("#"+this.props.inputId, parent.document).val(brand);
        //@ts-ignore
        top.deleteDialog(this.props.viewId);
    }

    update() {
        this.setState({...this.state});
    }

    handleSubmit(sender: any) {
        sender.preventDefault();
        let query = new QueryService(this.props);
        query.dataIn.head.copyValues(this.state.dataIn.current);
        query.add("select Brand_,ShareMode_ from TAppSCMBrand.Search_Brand");
        query.open().then((dataOut: DataSet)=>{
            this.setState({
                config: this.state.config.setDataSet(dataOut)
            })
        }).catch((dataOut: DataSet) => {
            showMsg(dataOut.message);
        })
    }

    render() {
        return (
            <div className={styles.brandDialog}>
                <form method="post" className={styles.search} style={{ minHeight: '4em' }}>
                    <DBEdit dataSource={this.state.dataIn} dataField={'SearchText_'} dataName='品牌查询'
                        onChanged={()=>this.update()} placeholder='请输入查询条件' autoFocus={true} />
                    <input type="submit" name="submit" onClick={(e)=>this.handleSubmit(e)} value="查询" style={{ height: '1.75rem' }} />
                </form>
                <DialogGrid config={this.state.config}/>
            </div>
        );
    }
}