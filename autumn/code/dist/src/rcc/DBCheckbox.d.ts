import React, { ReactNode } from "react";
import DataRow from "../db/DataRow";
import FieldMeta from "../db/FieldMeta";
export declare type OnChangedEvent = (meta: FieldMeta) => void;
declare type PropsType = {
    dataRow?: DataRow;
    dataField: string;
    dataName?: string;
    isUseChangedEvent?: boolean;
    onChanged?: OnChangedEvent;
    className?: string;
    children?: ReactNode | undefined;
};
export default class DBCheckbox extends React.Component<PropsType> {
    static defaultProps: {
        isUseChangedEvent: boolean;
    };
    constructor(props: PropsType);
    render(): JSX.Element;
    onChange: (sender: any) => void;
}
export {};
