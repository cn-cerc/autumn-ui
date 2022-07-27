import { BorderBox13, FullScreenContainer } from "@jiaminghi/data-view-react";
import { DataRow } from "autumn-ui";
import React from "react";
import { showPage } from "../tool/Summer";
import styles from "./Employee.css";
import TopHeader from "./TopHeader";

type EmployTypeProps = {
    dataRow: DataRow,
    title: string,
    backHref: string,
    backTitle: string,
    type?: 1 | 2,
    params?: object,
    vedioName?: string
}

export default class Employee extends React.Component<EmployTypeProps> {
    constructor(props: EmployTypeProps) {
        super(props);
        console.log(this.props);
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            <FullScreenContainer className={styles.dvFullScreenContainer}>
                <TopHeader title={this.props.title} handleCick={() => {
                    showPage(this.props.backHref, this.props.backTitle, this.props.params ? Object.assign({}, this.props.params) : {})
                }} />
                <div className={styles.content}>
                    <div className={styles.left}>
                        <img src='./employee-2.png' className={styles.img1} />
                        <div className={styles.info}>
                            <BorderBox13>
                                <ul>
                                    <li>当班班长：{this.props.dataRow.getString('Name_')}</li>
                                    <li>联系方式：{this.props.dataRow.getString('Contact_')}</li>
                                    <li>当前产能：{this.props.dataRow.getString('CurrentCapacity_')}</li>
                                    <li>设备状态：{this.props.dataRow.getString('State_')}</li>
                                </ul>
                            </BorderBox13>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <video src={this.getVedio()} autoPlay className={styles.img2} loop></video>
                        {this.getTable()}
                    </div>
                </div>
            </FullScreenContainer>
        </div>
    }
    
    getVedio() {
        let vedio = this.props.vedioName ? `./mp4/${this.props.vedioName}.mp4` : './mp4/monitor.mp4';
        return vedio;
    }

    getTable() {
        if (this.props.type && this.props.type == 2) {
            return <table cellSpacing={0} cellPadding={0}>
                <tbody>
                    <tr>
                        <th>温度</th>
                        <th>湿度</th>
                        <th>噪音</th>
                        <th>供电</th>
                        <th style={{'width': '10%'}}>-</th>
                    </tr>
                    <tr>
                        <td align='center'>{this.props.dataRow.getString('A1')}</td>
                        <td align='center'>{this.props.dataRow.getString('A2')}</td>
                        <td align='center'>{this.props.dataRow.getString('A3')}</td>
                        <td align='center'>{this.props.dataRow.getString('A4')}</td>
                        <td align='center'></td>
                    </tr>
                </tbody>
            </table>
        } else {
            return <table cellSpacing={0} cellPadding={0}>
                <tbody>
                    <tr>
                        <th>油温</th>
                        <th>振动</th>
                        <th>噪音</th>
                        <th>轴承</th>
                        <th>电机</th>
                    </tr>
                    <tr>
                        <td align='center'>{this.props.dataRow.getString('A1')}</td>
                        <td align='center'>{this.props.dataRow.getString('A2')}</td>
                        <td align='center'>{this.props.dataRow.getString('A3')}</td>
                        <td align='center'>{this.props.dataRow.getString('A4')}</td>
                        <td align='center'>{this.props.dataRow.getString('A5')}</td>
                    </tr>
                </tbody>
            </table>
        }
    }
}