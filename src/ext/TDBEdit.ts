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

    get dataSource(): DataSource { return this._dataSource }
    setDataSource(dataSet: DataSource): TDBEdit {
        if (this._dataSource)
            this._dataSource.registerBind(this, false);
        this._dataSource = dataSet;
        if (this._dataSource)
            this._dataSource.registerBind(this, true);
        return this;
    }

    get dataField(): string { return this._dataField }
    setDataField(value: string): TDBEdit { this._dataField = value; return this; }

    doChange(content: any = undefined): void {
        if (this._dataSource && this._dataField) {
            let row = this._dataSource.current;
            this.setValue(row ? row.getString(this._dataField) : '');
        }
    }

    beginOutput(html: HtmlWriter) {
        if (this._dataSource && this._dataField) {
            let value = '';
            let row = this._dataSource.current;
            if (row)
                value = row.getString(this._dataField);
            this.setDefaultValue(value);
        }
        super.beginOutput(html);
    }

}