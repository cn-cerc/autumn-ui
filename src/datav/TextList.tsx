import React from 'react';
import { BorderBox11, DigitalFlop } from '@jiaminghi/data-view-react';
import DataRow from '../db/DataRow';
import styles from './TextList.css';

type stateType = {
  num: number
}

type PropsType = {
  title: string,
  date: DataRow,
  listArray: listType[],
}

export type listType = {
  name: string,
  key: string,
  href?: string
}

export default class TextList extends React.Component<PropsType, stateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      num: 1000
    }
    this.time();
  }
  time() {
    setInterval(() => {
      this.setState({ ...this.state, num: Math.random() * 1000 });
    }, 2000)
  }
  render() {
    return <div className={styles.main}>
      <BorderBox11 title={this.props.title}>
        {this.getContent()}
      </BorderBox11>
    </div>
  }

  getContent() {
    let list = this.props.listArray.map((listType: listType, index: number) => {
      return <li key={index}>
        <span onClick={this.handleNameClick.bind(this, listType)}>{listType.name}：</span>
        <DigitalFlop config={{
          number: [this.props.date.getDouble(listType.key)],
          content: '{nt}',
          animationCurve: 'easeInQuart',
          animationFrame: 50,
          style: {
            fill: '#50CDE5',
            fontSize: 24,
            textAlign: 'left',
            translate: [-10, -10]
          }
        }} className={styles.flop} />
      </li>
    })
    return <ul className={styles.content} >{list}</ul>
  }

  handleNameClick(listType: listType) {
    if(listType.href)
      location.href = listType.href;
  }
}
