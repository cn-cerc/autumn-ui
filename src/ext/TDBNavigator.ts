import DataSet from "../db/DataSet";
import TComponent from "../ui/TComponent";
import TCustomComponent from "../ui/TCustomComponent";

export default class TDBNavigator extends TCustomComponent {
    private _dataSet: DataSet;

    constructor(owner: TComponent, props: object = null) {
        super(owner, props);

        // this.getUid();
        this.addEventListener('first.click', () => {
            this._dataSet.first();
        })

        this.addEventListener('prior.click', () => {
            this._dataSet.prior();
        })

        this.addEventListener('next.click', () => {
            this._dataSet.next();
        })

        this.addEventListener('last.click', () => {
            this._dataSet.last();
        })
    }

    set dataSet(value: DataSet) { this._dataSet = value }
    get dataSet(): DataSet { return this._dataSet }

    html() {
        let uid = this.getUid();
        return (`
<button id="${uid}_first">first</button>
<button id="${uid}_prior">prior</button>
<button id="${uid}_next">next</button>
<button id="${uid}_last">last</button>
        `)
    }
}