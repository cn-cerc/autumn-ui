import React from 'react'

import { Decoration5, Decoration8 } from '@jiaminghi/data-view-react'

import styles from './TopHeader.css'

type CardTypeProps = {
  title: string
  handleCick?: Function
}

export default class Cards extends React.Component<CardTypeProps> {
  constructor(props: CardTypeProps) {
    super(props);
  }

  render() {
    return (
      <div id={styles.topHeader}>
        <Decoration8 className={styles.headerLeftDecoration} />
        <Decoration5 className={styles.headerCenterDecoration} />
        <Decoration8 className={styles.headerRightDecoration} reverse={true} />
        <div className={styles.centerTitle} onClick={this.handleClick.bind(this)} dangerouslySetInnerHTML = {{__html: this.props.title}}></div>
      </div>
    )
  }

  handleClick() {
    if(this.props.handleCick)
      this.props.handleCick();
  }
}
