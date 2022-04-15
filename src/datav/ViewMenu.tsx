import React, { ReactNode } from "react";
import styles from "./ViewMenu.css";

type ViewMenuTypeProps = {
    options: ViewMenuMap
}

export type ViewMenuMap = Map<string, {
    imgSrc: string,
    href: string
}>

export default function ViewMenu(props: ViewMenuTypeProps) {
    return <div className={styles.main}>
        {getMenus(props.options)}
    </div>
}

function getMenus(options: ViewMenuMap) {
    let list: ReactNode[] = [];
    options.forEach((val: {
        imgSrc: string,
        href: string
    }, key: string) => {
        list.push(
            <li key={key} onMouseLeave={(e)=>handleLeave(e)} onMouseEnter={(e)=>handleEnter(e)}>
                <img src={val.imgSrc}/>
                <div>{key}</div>
            </li>
        )
    })
    return <ul>{list}</ul>
}

function handleLeave(e: any): React.MouseEventHandler<HTMLLIElement> {
    let dom = e.target.closest('li');
    dom.classList.remove(styles.transY);
    dom.classList.add(styles.reduction);
    return e.target;
}

function handleEnter(e: any): React.MouseEventHandler<HTMLLIElement> {
    let dom = e.target.closest('li');
    dom.classList.remove(styles.reduction);
    dom.classList.add(styles.transY);
    return e.target;
}
