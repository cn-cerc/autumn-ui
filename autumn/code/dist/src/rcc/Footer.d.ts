import React, { ReactNode } from "react";
declare type PropsType = {
    corpName?: string;
    year?: string;
    children?: ReactNode | undefined;
};
export default class Footer extends React.Component<PropsType> {
    render(): JSX.Element;
}
export {};
