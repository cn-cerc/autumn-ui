import React from 'react';
import ReactDOM from 'react-dom';
import { DataRow, QueryService } from '../src/Autumn-UI';
import DBEdit from '../src/rcc/DBEdit';
// @ts-ignore
// window.aui = all;

interface propsType {
    token: string;
}

interface stateType {
    headIn: DataRow;
}

class InputDemo extends React.Component<propsType, stateType> {

    constructor(props: propsType) {
        super(props);
        this.state = { headIn: new DataRow() };
    }

    updateData = () => {
        this.setState(this.state);
        console.log(this.state.headIn.jsonString);
    };

    onlick = (sender: any) => {
        console.log(sender);
        let query = new QueryService(this.props);
        query.add('select code_,name from TAppUseer');
        query.open().then(dataOut => console.log("第一关及格"))
            .catch(dataOut => console.log("你完蛋了"));
    };

    render() {
        return (
            <div>
                <DBEdit dataSource={this.state.headIn} dataField='code_' label='编号' updateRow={this.updateData} />
                <DBEdit dataSource={this.state.headIn} dataField='name_' label='名字' updateRow={this.updateData} />
                <button onClick={this.onlick}>提交</button>
            </div>
        )
    }
}

ReactDOM.render(<InputDemo token={'duyierh233123ui3jifdui'} />, document.getElementById('app'));