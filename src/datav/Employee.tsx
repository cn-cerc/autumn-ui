import React from "react";
import { BorderBox13, BorderBox9, Decoration7, FullScreenContainer } from "@jiaminghi/data-view-react";
import DataRow from "../db/DataRow";
import styles from "./Employee.css";
import TopHeader from "./TopHeader";

type EmployTypeProps = {
    dataRow: DataRow,
    title: string,
    backHref: string,
    backTitle: string
}

export default class Employee extends React.Component<EmployTypeProps> {
    constructor(props: EmployTypeProps) {
        super(props);
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            <FullScreenContainer className={styles.dvFullScreenContainer}>
                <TopHeader title={this.props.title} />
                <div className={styles.back} onClick={() => {
                    //@ts-ignore
                    return aui.showPage(this.props.backHref, this.props.backTitle)
                }}>
                    <Decoration7>返回</Decoration7>
                </div>
                <div className={styles.content}>
                    <div className={styles.left}>
                        {/* <div className={styles.img1}></div> */}
                        <img src='./employee.png' className={styles.img1}/>
                        <div className={styles.info}>
                            <BorderBox13>
                                <ul>
                                    <li>当班班长：{this.props.dataRow.getString('Name_')}</li>
                                    <li>生产型号：{this.props.dataRow.getString('Model_')}</li>
                                    <li>当班产能：{this.props.dataRow.getString('Capacity_')}</li>
                                    <li>当前产能：{this.props.dataRow.getString('CurrentCapacity_')}</li>
                                    <li>设备状态：{this.props.dataRow.getString('State_')}</li>
                                </ul>
                            </BorderBox13>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <img src='./employee2.png' className={styles.img2} />
                        <table cellSpacing={0} cellPadding={0}>
                            <tbody>
                                <tr>
                                    <th>油温</th>
                                    <th>震动</th>
                                    <th>噪音</th>
                                    <th>轴承</th>
                                    <th>电机</th>
                                </tr>
                                <tr>
                                    <td align='center'>{this.props.dataRow.getString('OilTemp_')}</td>
                                    <td align='center'>{this.props.dataRow.getString('Stock_')}</td>
                                    <td align='center'>{this.props.dataRow.getString('Noise_')}</td>
                                    <td align='center'>{this.props.dataRow.getString('Bearing_')}</td>
                                    <td align='center'>{this.props.dataRow.getString('Motor_')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </FullScreenContainer>
        </div>
    }
}