import React from 'react';
import DataRow from '../db/DataRow';
import { TGridConfig } from '../vcl/TGrid';
import { OnPageChanged } from './MutiPage';
import DataSet from '../db/DataSet';
declare const defaultProps: {
    id: string;
};
declare type PropsType = {
    config: TGridConfig;
    setChild: Function;
    dataSet: DataSet;
    sortFilter?: Function;
} & Partial<typeof defaultProps>;
interface stateType {
    beginPoint: number;
    endPoint: number;
}
export default class Grid extends React.Component<PropsType, stateType> {
    static defaultProps: {
        id: string;
    };
    private mutiPage;
    private size;
    constructor(props: PropsType);
    render(): JSX.Element;
    getTitles(): any[];
    getRows(): any[];
    getMasterRow(dataRow: DataRow): JSX.Element;
    getChildRow(child: TGridConfig, dataRow: DataRow): JSX.Element;
    getNavigator(): React.ReactNode;
    onPageChanged: OnPageChanged;
    gridSort(render: any, code: string): void;
    initGrid(): void;
    componentDidUpdate(prevProps: Readonly<PropsType>, prevState: Readonly<stateType>, snapshot?: any): void;
}
export {};
