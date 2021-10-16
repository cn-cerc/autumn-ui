import DataSet from "../db/DataSet";
import TComponent from "../ui/TComponent";
import TCustomComponent from "../ui/TCustomComponent";

export default class TDBNavigator extends TCustomComponent {
    private _dataSet: DataSet;

    constructor(owner: TComponent, props: object) {
        super(owner, props);

        this.addEventListener('first.click', () => {
            this._dataSet.first();
            this._dataSet.bindRefresh();
        })

        this.addEventListener('prior.click', () => {
            this._dataSet.prior();
            this._dataSet.bindRefresh();
        })

        this.addEventListener('next.click', () => {
            this._dataSet.next();
            this._dataSet.bindRefresh();
        })

        this.addEventListener('last.click', () => {
            this._dataSet.last();
            this._dataSet.bindRefresh();
        })
    }

    setDataSet(value: DataSet): TDBNavigator {
        this._dataSet = value;
        return this;
    }
    getDataSet(): DataSet {
        return this._dataSet;
    }

    html() {
        let id = this.getId();
        return (`
<button id="${id}_first">first</button>
<button id="${id}_prior">prior</button>
<button id="${id}_next">next</button>
<button id="${id}_last">last</button>
        `)
    }
}