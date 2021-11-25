import React from "react";
import DataSet from "../db/DataSet";
import styles from "./productClassDialog.css"

type PropsType = {
    inputId: string,
    viewId: string,
    items: string,
    action: string
}

type StateType = {
    items: {
        class1: Array<string>,
        class2: Array<string> | null,
        class3: Array<string> | null;
    },
    value: string
}

export default class CaseCardDialog extends React.Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        console.log(this.props)
        let items = JSON.parse(this.props.items);
        console.log(items)
        this.state = { items, value: '' }
    }

    render() {
        return (
            <div className={styles.caseCards}>
                {this.getCaseCards()}
                <div className={styles.submit} onClick={()=>this.handleSubmit()}>确认</div>
            </div>
        )
    }

    getCaseCards() {
        let class1 = this.state.items.class1.slice(0, this.state.items.class1.length + 1);
        let class2 = this.state.items.class2.slice(0, this.state.items.class2.length + 1);
        let class3 = this.state.items.class3.slice(0, this.state.items.class3.length + 1);
        let arr = [class1, class2, class3];
        let str = "";
        let cards = arr.map((item, index) => {
            let startText: string = str;
            let bool: boolean = false;
            let cardList = item.map((t: any, i) => {
                let endText = t.code;
                if (t.selected) {
                    str = str + t.code + "->";
                    bool = true;
                }
                if (t.code) {
                    for (let k: number = index + 1; k < arr.length; k++) {
                        endText = endText + "->*";
                    }
                    return (
                        <li key={t.code} onClick={() => this.handleClick(startText + endText)} className={t.selected ? styles.selected : ''}>{t.name}</li>
                    )
                }
            })
            cardList = cardList.filter((card)=>{
                return card;
            })
            if(cardList.length <= 1)
                cardList = [];

            return (<ul className={bool ? styles.caseCard : styles.caseCard + " " + styles.initFirst} key={"caseCard2" + index}>{cardList}</ul>)
        })
        return cards;
    }

    handleClick(value: string) {
        fetch('TWebSelectDialog.productClassServe?productClass=' + value + '&brand').then((res) => {
            return res.json();
        }).then((res) => {
            if (res.class1) {
                this.state.items.class1 = res.class1.slice(0, res.class1.length + 1);
            }
            if (res.class2) {
                this.state.items.class2 = res.class2.slice(0, res.class2.length + 1);
            }
            if (res.class3) {
                this.state.items.class3 = res.class3.slice(0, res.class3.length + 1);
            }
            this.setState({ value })
        })
    }

    handleSubmit() {
        let data = this.state.value;
        while(data.indexOf("->*") > -1) {
            data = data.replace("->*", "");
        }
        data.replace("*", "");
        let value = data.split(",");
        let inputIds = this.props.inputId.split(",");
        if(inputIds.length == 1) {
            value.forEach((t,i)=>{
                $("#" + inputIds[i], parent.document).val(value[i]);
            })
        } else if(inputIds.length == 3) {
            value = data.split("->");
            if(value.length > 1)
                $("#" + inputIds[0], parent.document).val(value[0]);
            if (value.length > 1)
                $("#" + inputIds[1], parent.document).val(value[1]);
            else
                $("#" + inputIds[1], parent.document).val('');
            if (value.length > 2)
                $("#" + inputIds[2], parent.document).val(value[2]);
            else
                $("#" + inputIds[2], parent.document).val('');
        }
        //@ts-ignore
        top.deleteDialog(this.props.viewId);
    }
}