import { BorderBox9, FullScreenContainer } from "@jiaminghi/data-view-react";
import React, { ReactNode } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { ColumnIt } from "../rcc/ColumnIt";
import DBGrid, { Column } from "../rcc/DBGrid";
import TopHeader from "./TopHeader";
import styles from "./ReportDetail.css";

type FrmReportTypeProps = {
    dataSet: DataSet,
    head: DataRow,
    title: string
}

export default class ReportDetail extends React.Component<FrmReportTypeProps> {
    constructor(props: FrmReportTypeProps) {
        super(props);
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            <FullScreenContainer className={styles.dvFullScreenContainer}>
                <TopHeader title={this.props.title} />
                <div className={styles.box}>
                    <BorderBox9>
                        <div className={styles.grid}>
                            <DBGrid dataSet={this.props.dataSet}>
                                {this.getColumns()}
                            </DBGrid>
                        </div>
                    </BorderBox9>
                </div>
            </FullScreenContainer>
        </div>
    }

    getColumns() {
        console.log(this.props.head)
        let list: ReactNode[] = [<ColumnIt key='it'></ColumnIt>];
        this.props.head.forEach((key: string, value: any) => {
            list.push(<Column code={key} name={value.name} width={value.width} textAlign='center' key={key}></Column>)
        })
        return list;
    }
}