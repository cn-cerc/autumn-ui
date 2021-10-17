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

    setDataSource(dataSet: DataSource): TDBEdit {
        if (this._dataSource)
            this._dataSource.registerBind(this, false);
        this._dataSource = dataSet;
        if (this._dataSource)
            this._dataSource.registerBind(this, true);
        return this;
    }
    getDataSource(): DataSource {
        return this._dataSource;
    }

    setDataField(value: string): TDBEdit {
        this._dataField = value;
        return this;
    }
    getDataField(): string {
        return this._dataField;
    }

    doChange(): void {
        if (this._dataSource && this._dataField) {
            let row = this._dataSource.getCurrent();
            this.setValue(row ? row.getString(this._dataField) : '');
        }
    }

    beginOutput(html: HtmlWriter) {
        if (this._dataSource && this._dataField) {
            let value = this._dataSource.getCurrent().getString(this._dataField);
            this.setDefaultValue(value);
        }
        super.beginOutput(html);
    }

}