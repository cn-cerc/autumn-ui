import { DataRow, DataSet } from "autumn-ui";
import { getJSON } from "jquery";
import React from "react";
import { callPhoneNumber, showMsg } from "../tool/Summer";
import FplPageApi from "./FplPageApi";
import styles from "./FrmDriverArrangeCarDetail.css";

type FrmDriverArrangeCarTypeProps = {
    cargoNo: string,
    tbNo: string,
    it: string,
    dcorpno: string,
    uploadUrl: string,
    confirmStatus: number, //0.未接单 1.已接单
    deliveryStatus: string,
    waybillState: number,
}

type FrmDriverArrangeCarTypeState = {
    showShopDetail: boolean,
    isAgree: boolean,
    orderData: DataRow,
    contractNo: string,
    waybillState: number,
    waybillStateImg: string,
    CargoPoundsSingle: number,
    btnText: string,
    upload_code_table_: string,
    upload_pound_list_: string,
    unload_code_table_: string,
    unload_pound_list_: string,
    btnFlag: boolean
}

export default class FrmDriverArrangeCarDetail extends React.Component<FrmDriverArrangeCarTypeProps, FrmDriverArrangeCarTypeState> {
    constructor(props: FrmDriverArrangeCarTypeProps) {
        super(props);
        let waybillStateImg = '';
        let btnText = '';
        let waybillState = parseInt(this.props.deliveryStatus);

        switch (waybillState) {
            case 0:
                waybillStateImg = 'images/order/notShipped.png';
                btnText = '确认发货';
                break;
            case 1:
                waybillStateImg = 'images/order/shipped.png';
                btnText = '确认卸货';
                break;
            case 2:
                waybillStateImg = 'images/order/discharge.png';
                btnText = '提交审核';
                break;
            case 3:
                waybillStateImg = 'images/order/awaitAudit.png';
                btnText = '资料有误回撤';
                break;
            case 4:
                waybillStateImg = 'images/order/completed.png';
                btnText = '';
                break;
        }
        this.state = {
            showShopDetail: false,
            isAgree: false,
            orderData: new DataRow,
            contractNo: '',
            waybillState, // 运单状态 0.未发货 1.已发货 2.已卸货 3.待审核
            waybillStateImg,
            CargoPoundsSingle: 0,
            btnText,
            upload_code_table_: '', //装货码表
            upload_pound_list_: '', //装货磅单
            unload_code_table_: '', //卸货码表
            unload_pound_list_: '', //卸货磅单
            btnFlag: false, //保存底部两个按钮的状态  附件列表 和 确认
        }
    }

    render(): React.ReactNode {
        return <React.Fragment>
            <div className={styles.main}>
                <div className={styles.title}>
                    <ul className={styles.siteBox}>
                        <li>
                            <img src='images/order/sender.png'></img>
                            <div>
                                <p>{this.state.orderData.getString('depart_')}</p>
                                <p>{this.state.orderData.getString('send_name_')} {this.state.orderData.getString('send_phone_')}</p>
                            </div>
                            <img src='images/icon/call.png' onClick={() => callPhoneNumber(`${this.state.orderData.getString('send_phone_')}`)}></img>
                        </li>
                        <li>
                            <img src='images/order/recipient.png'></img>
                            <div>
                                <p>{this.state.orderData.getString('destination_')}</p>
                                <p>{this.state.orderData.getString('receive_name_')} {this.state.orderData.getString('receive_phone_')}</p>
                            </div>
                            <img src='images/icon/call.png' onClick={() => callPhoneNumber(`${this.state.orderData.getString('receive_phone_')}`)}></img>
                        </li>
                    </ul>
                    <div className={this.props.confirmStatus != 0 ? styles.timeInfoState : styles.infoLine}>
                        <span>发车时间</span>
                        <span>{this.state.orderData.getString('send_date_time_')}</span>
                    </div>
                    <div className={this.props.confirmStatus != 0 ? styles.timeInfoState : styles.infoLine}>
                        <span>抵达时间</span>
                        <span>{this.state.orderData.getString('arrive_date_time_')}</span>
                    </div>
                    {this.props.confirmStatus != 0 ? <div className={styles.waybillState}>
                        <img src={this.state.waybillStateImg} alt="" />
                    </div> : ''}
                </div>
                {this.waybillStateHtml()}
                <div className={styles.orderDetails}>
                    <ul>
                        <li className={this.state.showShopDetail ? '' : styles.orderActive} onClick={() => this.setState({ showShopDetail: false })}>物流运单详情</li>
                        <li className={this.state.showShopDetail ? styles.orderActive : ''} onClick={() => this.setState({ showShopDetail: true })}>货物明细</li>
                    </ul>
                    {this.getOrderDetail()}
                </div>
                {/* {this.accessoryBox()} */}
                {this.footerBoxHtml()}
            </div>
        </React.Fragment>
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let orderData = new DataRow();
        let driverRow = new DataRow();
        driverRow.setValue('cargo_no_', this.props.cargoNo);
        driverRow.setValue('tb_no_', this.props.tbNo);
        driverRow.setValue('it_', this.props.it);
        // 查询物流运单信息
        let driverData = await FplPageApi.getDriverArrangeCarDetail(driverRow);
        driverData.first();
        orderData.copyValues(driverData.current);
        // 查询货单信息
        let cargoData = await FplPageApi.getCargoOrderDetail(driverRow);
        cargoData.first();
        // 组装信息
        orderData.setValue("code_", cargoData.getValue("code_"));
        orderData.setValue("send_name_", cargoData.getValue("send_name_"));
        orderData.setValue("send_phone_", cargoData.getValue("send_phone_"));
        orderData.setValue("send_detail_", cargoData.getValue("send_detail_"));
        orderData.setValue("receive_name_", cargoData.getValue("receive_name_"));
        orderData.setValue("receive_phone_", cargoData.getValue("receive_phone_"));
        orderData.setValue("receive_detail_", cargoData.getValue("receive_detail_"));
        orderData.setValue("cargo_loss_rate_", cargoData.getValue("cargo_loss_rate_"));
        orderData.setValue("carry_type_", cargoData.getValue("carry_type_"));
        orderData.setValue("settle_status_", cargoData.getValue("settle_status_"));
        orderData.setValue("scheduling_mode_", cargoData.getValue("scheduling_mode_"));
        orderData.setValue("homework_type_", cargoData.getValue("homework_type_"));
        //查询是否上传了附件
        let attachmentRow = new DataRow();
        attachmentRow.setValue('obj_code_', this.getParmasFun(this.props.uploadUrl, "objCode"))
            .setValue('type_', this.getParmasFun(this.props.uploadUrl, "type"))
            .setValue('obj_type_', this.getParmasFun(this.props.uploadUrl, "objType"));
        let attachmentList = new DataSet();
        attachmentList = await FplPageApi.queryAttachmentList(attachmentRow);
        let btnFlag = false;
        attachmentList.first();
        if (attachmentList.getDouble("sum_") > 0) {
            btnFlag = true;
        }

        this.setState({
            orderData,
            contractNo: cargoData.getString("contract_no_"),
            upload_code_table_: cargoData.getString("upload_code_table_"),
            upload_pound_list_: cargoData.getString("upload_pound_list_"),
            unload_code_table_: cargoData.getString("unload_code_table_"),
            unload_pound_list_: cargoData.getString("unload_pound_list_"),
            btnFlag
        })
    }

    getOrderDetail() {
        if (this.state.showShopDetail) {
            return <ul className={styles.infoDetail}>
                <li className={styles.infoLine}>
                    <span>货运单号</span>
                    <span>{this.state.orderData.getString('cargo_no_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>货运类型</span>
                    <span>{this.state.orderData.getString('carry_type_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>调度模式</span>
                    <span>{this.state.orderData.getString('scheduling_mode_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>运输料品</span>
                    <span>{this.state.orderData.getString('code_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>货损率％</span>
                    <span>{this.state.orderData.getString('cargo_loss_rate_')}</span>
                </li>
            </ul>
        } else {
            return <ul className={styles.infoDetail}>
                <li className={styles.infoLine}>
                    <span>派单编号</span>
                    <span>{this.state.orderData.getString('tb_no_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>车次</span>
                    <span>{this.state.orderData.getString('it_')}车</span>
                </li>
                <li className={styles.infoLine}>
                    <span>车队</span>
                    <span>{this.state.orderData.getString('fleet_name_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>车牌号</span>
                    <span>{this.state.orderData.getString('car_num_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>司机</span>
                    <span>{this.state.orderData.getString('driver_name_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>收款人</span>
                    <span>{this.state.orderData.getString('payee_name_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>货物数量</span>
                    <span>{this.state.orderData.getString('weight_')}{this.state.orderData.getString('deputy_unit_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>派单单价</span>
                    <span>{this.state.orderData.getString('unit_price_')}元</span>
                </li>
                <li className={styles.infoLine}>
                    <span>派单金额</span>
                    <span style={{ color: '#E65C5C' }}>{this.state.orderData.getString('amount_')}元</span>
                </li>
            </ul>
        }
    }

    waybillStateHtml() {
        if (this.props.confirmStatus == 0) { return }
        let list = [];
        if (this.state.waybillState > 0) {
            list.push(<div className={styles.wabillStateBox}>
                <div className={styles.wabillStateItem}>
                    <span>卸货码表</span>
                    <input type="text" id="unload_code_table_" className={this.state.waybillState > 3 ? styles.disInp : ''} placeholder="请在此输入" value={decodeURIComponent(this.state.unload_code_table_)} onChange={(e) => {
                        this.setState({
                            unload_code_table_: encodeURIComponent(e.target.value)
                        })
                    }} />
                </div>
                <hr />
                <div className={styles.wabillStateItem}>
                    <span>卸货磅单</span>
                    <input type="text" id="unload_pound_list_" className={this.state.waybillState > 3 ? styles.disInp : ''} placeholder="请在此输入" value={decodeURIComponent(this.state.unload_pound_list_)} onChange={(e) => {
                        this.setState({
                            unload_pound_list_: encodeURIComponent(e.target.value)
                        })
                    }} />
                </div>
            </div>)
        }
        list.push(<div className={styles.wabillStateBox}>
            <div className={styles.wabillStateItem}>
                <span>装货码表</span>
                <input type="text" id="upload_code_table_" className={this.state.waybillState > 3 ? styles.disInp : ''} placeholder="请在此输入" value={decodeURIComponent(this.state.upload_code_table_)} onChange={(e) => {
                    this.setState({
                        upload_code_table_: encodeURIComponent(e.target.value)
                    })
                }} />
            </div>
            <hr />
            <div className={styles.wabillStateItem}>
                <span>装货磅单</span>
                <input type="text" id="upload_pound_list_" className={this.state.waybillState > 3 ? styles.disInp : ''} placeholder="请在此输入" value={decodeURIComponent(this.state.upload_pound_list_)} onChange={(e) => {
                    this.setState({
                        upload_pound_list_: encodeURIComponent(e.target.value)
                    })
                }} />
            </div>
        </div>)
        return list;
    }

    // accessoryBox() { //暂时没有这个服务
    //     if (this.props.confirmStatus) {
    //         return <div className={styles.accessoryBox}>
    //             <div>
    //                 <img src="images/MCimg/sjzj_1.png" alt="" />
    //                 <span className={styles.upImgBtn} ><img src="images/order/upImg.png" alt="" /></span>
    //             </div>
    //             <div>
    //                 <h3>装货回单.jpg</h3>
    //                 <p>当前类型：{this.state.orderData.getString('carry_type_')}</p>
    //                 <p>创建时间：{this.state.orderData.getString('create_time_').slice(0, -3)}</p>
    //                 <p>
    //                     <span><img src="images/order/edit.png" alt="" />修改</span>
    //                     <span><img src="images/order/del.png" alt="" />删除</span>
    //                 </p>
    //             </div>
    //         </div>
    //     }
    // }

    footerBoxHtml() {
        if (this.state.waybillState == 4) { return }
        if (this.props.confirmStatus == 0) {
            return <div className={styles.orderBtns}><img src={this.state.isAgree ? 'images/icon/checkbox_checked.png' : 'images/icon/checkbox.png'} onClick={() => this.setState({ isAgree: !this.state.isAgree })} />
                <div><span onClick={() => this.setState({ isAgree: !this.state.isAgree })}>我已阅读</span><a href='FrmDriverArrangeCar.carriage'>《承运协议》</a></div>
                <button onClick={this.handleSelect.bind(this)}>确认接单</button>
            </div>
        } else {
            return <div className={`${styles.orderBtns} ${styles.orderBtns1}`}>
                <button onClick={() => {
                    location.href = this.props.uploadUrl;
                }}>{this.state.btnFlag ? '附件列表' : '上传附件'}</button>
                <button className={this.state.btnFlag ? '' : styles.btnDefault_bg} onClick={this.submitForm.bind(this)} >{this.state.btnText}</button>
            </div>
        }
    }

    //确认接单
    async handleSelect() {
        if (!this.state.isAgree) {
            showMsg('接单前请先勾选《承运协议》');
            return;
        }
        location.href = `FrmDriverArrangeCar.modifyConfirmStatus?cargoNo=${this.props.cargoNo}&tbNo=${this.props.tbNo}&it=${this.props.it}&confirmStatus=1&contractNo=${this.state.contractNo}&isRead=${this.state.isAgree}`;
    }

    //更新状态
    async submitForm() {
        if (!this.state.btnFlag) return;
        let row = new DataRow();
        row.setValue('tb_no_', this.props.tbNo)
            .setValue('cargo_no_', this.props.cargoNo)
            .setValue('it_', this.props.it)
            .setValue('upload_code_table_', this.state.upload_code_table_)
            .setValue('upload_pound_list_', this.state.upload_pound_list_)
            .setValue('unload_code_table_', this.state.unload_code_table_)
            .setValue('unload_pound_list_', this.state.unload_pound_list_)
            .setValue('longitude_', 115.693942)  //目前经纬度为静态
            .setValue('latitude_', 28.2882);    //目前经纬度为静态

        let dataOut = await FplPageApi.modify(row);

        if (dataOut['_state'] == 0) {
            showMsg(dataOut['_message']);
        }

    }

    //获取参数
    getParmasFun(str: string, search: string) {
        let o: any = {};
        let arr = str.split("?")[1].split("&");
        for (let i = 0; i < arr.length; i++) {
            let str = arr[i].split('=');
            if (str[0] != '') {
                o[str[0]] = str[1];
            }
        }
        return o[search];
    }
}