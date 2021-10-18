import DataControl from "../db/DataControl";
import DataSource from "../db/DataSource";
import HtmlWriter from "../ui/HtmlWriter";
import TComponent from "../ui/TComponent";
import TEdit from "./TEdit";

export default class TDBEdit extends TEdit implements DataControl {
    private _dataSource: DataSource;
    private _dataField: string;

    constructor(owner: TComponent, props: object = null) {
        super(owner, props);
    }

    set dataSource(dataSet: DataSource) {
        if (this._dataSource)
            this._dataSource.registerBind(this, false);
        this._dataSource = dataSet;
        if (this._dataSource)
            this._dataSource.registerBind(this, true);
    }
    get dataSource(): DataSource { return this._dataSource }

    set dataField(value: string) { this._dataField = value }
    get dataField(): string { return this._dataField }

    doChange(content: any = undefined): void {
        if (this._dataSource && this._dataField) {
            let row = this._dataSource.getCurrent();
            this.value = row ? row.getString(this._dataField) : '';
        }
    }

    beginOutput(html: HtmlWriter) {
        if (this._dataSource && this._dataField) {
            let value = '';
            let row = this._dataSource.getCurrent();
            if (row)
                value = row.getString(this._dataField);
            this.defaultValue = value;
        }
        super.beginOutput(html);
    }

}