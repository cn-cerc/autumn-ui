import StaticFile from "@diteng/StaticFile";
import { WebControl } from "autumn-ui";
import React from "react";
import styles from "./developingMC.css";

type developingMCTypeProps = {
    introduction: string,
}

type developingMCTypeState = {
}

export default class developingMC extends WebControl<developingMCTypeProps, developingMCTypeState> {
    constructor(props: developingMCTypeProps) {
        super(props);
        this.state = {
        }
    }

    render(): React.ReactNode {
        return <div className={styles.contentBox}>
            <div className={styles.main}>
                <div className={styles.imgBox}>
                    <img src={StaticFile.getImage('images/MCimg/developing.png')} alt="" />
                    <p>功能正在开发中...</p>
                </div>
                <div className={styles.btnBox}>
                    <button onClick={()=>{window.history.back()}}>返回上页</button>
                    <button onClick={()=>{location.href = `/WebDefault`}}>返回首页</button>
                </div>
            </div>
        </div>

    }

    componentDidMount(): void {
    }
}