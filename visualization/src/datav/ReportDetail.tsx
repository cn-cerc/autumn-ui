import { BorderBox9, FullScreenContainer } from "@jiaminghi/data-view-react";
import { Column, ColumnIt, DataRow, DataSet, DBGrid } from "autumn-ui";
import React, { ReactNode } from "react";
import styles from "./ReportDetail.css";
import TopHeader from "./TopHeader";

type FrmReportTypeProps = {
    dataSet: DataSet,
    head: DataRow,
    title: string,
    backHref?: string,
    backTitle?: string,
    hideIt?: boolean,
    index?:number
}

export default class ReportDetail extends React.Component<FrmReportTypeProps> {
    constructor(props: FrmReportTypeProps) {
        super(props);
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            <FullScreenContainer className={styles.dvFullScreenContainer}>
                <TopHeader title={this.props.title} handleCick={() => {
                    //@ts-ignore
                    return aui.showPage(this.props.backHref, this.props.backTitle,{ index: this.props.index || null})
                }} />
                <div className={styles.box}>
                    <BorderBox9>
                        <div className={styles.grid}>
                            <DBGrid dataSet={this.props.dataSet} key={this.getColumns().toString()} openPage={false}>
                                {this.getColumns()}
                            </DBGrid>
                        </div>
                    </BorderBox9>
                </div>
            </FullScreenContainer>
        </div>
    }

    getColumns() {
        let list: ReactNode[] = [];
        if (!this.props.hideIt)
            list.push(<ColumnIt key='it'></ColumnIt>);
        this.props.head.forEach((key: string, value: any) => {
            list.push(<Column code={key} name={value.name} width={value.width} textAlign='center' key={key}></Column>)
        })
        return list;
    }
}