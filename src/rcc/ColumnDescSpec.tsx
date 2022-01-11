import React from "react";
import DitengCommon from "../diteng/DitengCommon";
import ImageConfig from "../diteng/ImageConfig";
import { Column, ColumnType } from "./DBGrid";

export class ColumnDescSpec extends Column {
    static defaultProps = {
        tag: ColumnType.td,
        colSpan: 1,
        textAlign: 'left',
        descField: 'Desc_',
        specField: 'Spec_',
        readmeField: 'ReadmeUrl_',
    }

    getValue(): React.ReactNode {
        let dataRow = this.props.dataRow;
        //@ts-ignore
        let descField = this.props.descField;
        //@ts-ignore
        let specField = this.props.specField;
        //@ts-ignore
        let readmeField = this.props.readmeField;

        let html: React.ReactNode[] = [];
        // 定义网上商城图标
        let readmeUrl = dataRow.getString(readmeField);
        if (readmeUrl) {
            html.push(<a href={readmeUrl}><img src={ImageConfig.TAOBAO} /></a>);
        }

        // 构建品名规格
        let desc = dataRow.getString(descField);
        let spec = dataRow.getString(specField);
        let descNode: React.ReactNode = desc;
        let specNode: React.ReactNode = spec;
        if (spec) {
            specNode = <span style={{ color: '#203346' }}>{spec}</span>;
        }

        let lowerShelf = dataRow.getBoolean("LowerShelf_");
        if (lowerShelf) {
            descNode =
                <React.Fragment>
                    <span style={{
                        border: '1px solid red', color: 'red', padding: '0px 0.125em', marginRight: '0.25em'
                    }}> 下架</span>
                    + {desc}
                </React.Fragment>;
        }
        if (dataRow.getInt("sales_") > 0 || dataRow.getString("SPNo_")) {
            descNode =
                <React.Fragment>
                    <span style={{
                        border: '1px solid red', color: 'red', padding: '0px 0.125em', marginRight: '0.25em'
                    }}> 促</span>
                    + {desc}
                </React.Fragment>;
        }
        if (dataRow.getInt("BomLevel_") > 0) {
            descNode =
                <React.Fragment>
                    <span style={{
                        border: '1px solid red', color: 'red', padding: '0px 0.125em', marginRight: '0.25em'
                    }}> 制</span>
                    + {desc}
                </React.Fragment>;
        }
        if (DitengCommon.CUSTOMER_194005 == dataRow.getString("CorpNo_")) {
            if (dataRow.getInt("SalesStatus_") == 5) {
                descNode =
                    <React.Fragment>
                        <span style={{
                            border: '1px solid red', color: 'red', padding: '0px 0.125em', marginRight: '0.25em'
                        }}> 外发</span>
                        + {desc}
                    </React.Fragment>;
            }
        }

        let partCode = encodeURIComponent(dataRow.getString(this.props.code));

        // 定义商品资料卡连接
        html.push(<React.Fragment>
            <a href={`PartInfo?code=${partCode}`} target='_blank'>
                {descNode}
            </a>
        </React.Fragment>
        );
        html.push(specNode);
        return html;
    }
}