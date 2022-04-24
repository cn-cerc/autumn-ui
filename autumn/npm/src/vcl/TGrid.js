var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import DataSet from '../db/DataSet';
import KeyValue from '../db/KeyValue';
import TComponent from './TComponent';
import TTable, { TTd, TTh, TTr } from './TTable';
import TText from './TText';
var TGrid = /** @class */ (function (_super) {
    __extends(TGrid, _super);
    function TGrid(owner, props) {
        if (props === void 0) { props = null; }
        var _this = _super.call(this, owner, props) || this;
        _this._groups = [];
        _this.setBorder('1');
        _this.setCssStyle('width:100%');
        return _this;
    }
    Object.defineProperty(TGrid.prototype, "dataSet", {
        get: function () {
            return this._dataSet;
        },
        enumerable: false,
        configurable: true
    });
    TGrid.prototype.setDataSet = function (dataSet) {
        this._dataSet = dataSet;
        // dataSet.registerBind(this);
        return this;
    };
    TGrid.prototype.output = function (html) {
        if (this._groups.length == 0 || this._groups[0].getComponentCount() == 0) {
            this.style.set('display', 'none');
        }
        else {
            this.style.delete('display');
        }
        this.beginOutput(html);
        //先输出主行标题
        var master = null;
        this._groups.forEach(function (group) {
            if (group instanceof TGridGroupMaster) {
                master = group;
                master.outputOfGridTitle(html);
            }
        });
        //再输出子行标题
        this._groups.forEach(function (group) {
            if (group instanceof TGridGroupChild) {
                var child = group;
                child.setMaster(master);
                child.outputOfGridTitle(html);
            }
        });
        //再输出表格数据
        if (this._dataSet) {
            // let enable = this._dataSet.bindEnabled;
            // this._dataSet.setBindEnabled(false);
            var recNo = this._dataSet.recNo;
            this._dataSet.first();
            var _loop_1 = function () {
                var row = this_1._dataSet.current;
                this_1._groups.forEach(function (group) {
                    group.setCurrent(row);
                    group.output(html);
                });
            };
            var this_1 = this;
            while (this._dataSet.fetch()) {
                _loop_1();
            }
            this._dataSet.setRecNo(recNo);
            // this._dataSet.setBindEnabled(enable);
        }
        this.endOutput(html);
    };
    TGrid.prototype.addColumns = function (fields) {
        for (var _i = 0, _a = fields.items; _i < _a.length; _i++) {
            var meta = _a[_i];
            if (!this.getColumn(meta.code))
                new TGridColumn(this, meta.code, meta.name ? meta.name : meta.code);
        }
    };
    TGrid.prototype.addComponent = function (child) {
        if (child instanceof TGridGroup) {
            _super.prototype.addComponent.call(this, child);
            this._groups.push(child);
        }
        else {
            this.getGroup(0).addComponent(child);
        }
        return this;
    };
    TGrid.prototype.getGroup = function (index) {
        if (index > (this._groups.length - 1)) {
            var max = index - this._groups.length + 1;
            for (var i = 0; i < max; i++) {
                new TGridGroupMaster(this);
            }
        }
        return this._groups[index];
    };
    TGrid.prototype.getColumn = function (columnCode) {
        for (var i = 0; i < this._groups.length; i++) {
            var group = this.getGroup(i);
            var column = group.getColumn(columnCode);
            if (column)
                return column;
        }
        return null;
    };
    TGrid.prototype.clear = function () {
        for (var _i = 0, _a = this.getComponents(); _i < _a.length; _i++) {
            var child = _a[_i];
            child.setOwner(null);
        }
        this._groups = [];
        this._dataSet = null;
    };
    /**
     * 将dataSet与后台交换生成excel文件
     * @param exportUrl 后台excel转换网址
     * @param filename  要导出的文件名称
     */
    TGrid.prototype.exportExcel = function (exportUrl, filename) {
        var _this = this;
        if (this.dataSet.size == 0) {
            throw new Error("没有要导出的数据");
            return;
        }
        var dataIn = new DataSet();
        // 复制要导出的栏位数据
        this.dataSet.first();
        while (this.dataSet.fetch()) {
            dataIn.append();
            for (var _i = 0, _a = this._groups; _i < _a.length; _i++) {
                var group = _a[_i];
                group.getComponents().forEach(function (item) {
                    var column = item;
                    if (column.export) {
                        var code = column.code;
                        var value = _this.dataSet.getValue(code);
                        // 如果自定义栏位则输出自定义栏位信息
                        var meta = _this.dataSet.fields.get(code);
                        if (meta != null && meta.onGetText != undefined) {
                            value = meta.onGetText(_this.dataSet.current, meta);
                        }
                        if (typeof value == 'string') {
                            value = value.replace(/\r|\n|\\s/g, ""); // 替换掉内容自带的换行符
                            value = value.replace(/,/g, "，"); // 将英文逗号替换为中文逗号
                        }
                        dataIn.setValue(code, value);
                    }
                });
            }
        }
        // 构建要导出的数据栏位
        dataIn.setMetaInfo(true);
        var newFields = dataIn.fields;
        for (var _b = 0, _c = this._groups; _b < _c.length; _b++) {
            var group = _c[_b];
            group.getComponents().forEach(function (item) {
                var column = item;
                // 为新的数据集栏位赋予名字
                newFields.forEach(function (meta) {
                    if (meta.code == column.code) {
                        meta.setName(column.name);
                    }
                });
            });
        }
        // 发送dataSet与后台交换生成excel文件
        fetch(exportUrl + "?filename=" + filename, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: dataIn.json,
        }).then(function (response) { return response.blob(); })
            .then(function (blob) {
            TGrid.download(filename, blob);
        });
    };
    /**
     * 输出纯文本的csv格式
     */
    TGrid.prototype.exportText = function (fileName) {
        var _this = this;
        //CSV格式可以自己设定，适用MySQL导入或者excel打开。
        //由于Excel单元格对于数字只支持15位，且首位为0会舍弃 建议用 =“数值” 
        var str = "";
        // 定义头部
        for (var _i = 0, _a = this._groups; _i < _a.length; _i++) {
            var group = _a[_i];
            group.getComponents().forEach(function (item) {
                var column = item;
                if (column.export)
                    str += column.name + ",";
            });
        }
        str += '\r\n';
        // 具体数值遍历
        this._dataSet.first();
        while (this._dataSet.fetch()) {
            for (var _b = 0, _c = this._groups; _b < _c.length; _b++) {
                var group = _c[_b];
                group.getComponents().forEach(function (item) {
                    var column = item;
                    if (column.export) {
                        var value = _this._dataSet.getText(column.code);
                        value = value.replace(/\r|\n|\\s/g, ""); // 替换掉内容自带的换行符
                        var dataType = _this._dataSet.fields.get(column.code).type;
                        if (dataType && dataType.indexOf('s') > -1) {
                            if (value.length > 0) {
                                value = '\t' + value; // 标记为文本栏位
                                value = value.replace(/,/g, "，");
                            }
                        }
                        else {
                            value = value.replace(/,/g, "，");
                        }
                        str += value + ",";
                    }
                });
            }
            str += '\r\n'; // 下一条记录的换行符
        }
        // 解决Windows中文乱码问题
        str = "\uFEFF" + str;
        var blob = new Blob([str], { type: "application/vnd.ms-excel" });
        TGrid.download(fileName, blob);
    };
    /**
     *  构建下载链接
     *
     * @param fileName 文件名称（自带后缀名）
     * @param blob 大数据快
     */
    TGrid.download = function (fileName, blob) {
        var now = new Date();
        var date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
        fileName = date + '_' + fileName;
        var objectURL = URL.createObjectURL(blob);
        var downloadElement = document.createElement("a");
        downloadElement.style.display = 'none';
        downloadElement.href = objectURL;
        downloadElement.download = fileName;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
    };
    TGrid.prototype.doChange = function (content) {
        if (content === void 0) { content = undefined; }
        var size = content.size;
        if (size)
            this.repaint();
    };
    return TGrid;
}(TTable));
export default TGrid;
var TGridColumn = /** @class */ (function (_super) {
    __extends(TGridColumn, _super);
    function TGridColumn(owner, code, name) {
        if (name === void 0) { name = null; }
        var _this = _super.call(this, owner) || this;
        _this._width = 0;
        _this._export = true;
        _this._code = code;
        _this._name = name ? name : code;
        return _this;
    }
    Object.defineProperty(TGridColumn.prototype, "code", {
        get: function () {
            return this._code;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TGridColumn.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TGridColumn.prototype, "colSpan", {
        get: function () {
            return this.readProperty("colspan");
        },
        enumerable: false,
        configurable: true
    });
    TGridColumn.prototype.setColSpan = function (value) {
        this.writeProperty("colspan", value);
        return this;
    };
    Object.defineProperty(TGridColumn.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    TGridColumn.prototype.setWidth = function (value) {
        this._width = value;
        return this;
    };
    Object.defineProperty(TGridColumn.prototype, "align", {
        get: function () {
            return this._align;
        },
        enumerable: false,
        configurable: true
    });
    TGridColumn.prototype.setAlign = function (value) {
        this._align = value;
        return this;
    };
    Object.defineProperty(TGridColumn.prototype, "export", {
        get: function () {
            return this._export;
        },
        enumerable: false,
        configurable: true
    });
    TGridColumn.prototype.setExport = function (value) {
        this._export = value;
        return this;
    };
    Object.defineProperty(TGridColumn.prototype, "onRender", {
        get: function () {
            return this._onRender;
        },
        enumerable: false,
        configurable: true
    });
    TGridColumn.prototype.setOnRender = function (value) {
        this._onRender = value;
        return this;
    };
    return TGridColumn;
}(TComponent));
export { TGridColumn };
var MaxWidth = 600;
var TGridGroup = /** @class */ (function (_super) {
    __extends(TGridGroup, _super);
    function TGridGroup(owner) {
        var _this = _super.call(this, owner) || this;
        _this._titleVisiable = true;
        return _this;
    }
    Object.defineProperty(TGridGroup.prototype, "current", {
        get: function () {
            return this._current;
        },
        enumerable: false,
        configurable: true
    });
    TGridGroup.prototype.setCurrent = function (row) {
        this._current = row;
    };
    Object.defineProperty(TGridGroup.prototype, "titleVisiable", {
        get: function () {
            return this._titleVisiable;
        },
        enumerable: false,
        configurable: true
    });
    TGridGroup.prototype.setTitleVisiable = function (value) {
        this._titleVisiable = value;
        return this;
    };
    TGridGroup.prototype.getTotalWidth = function () {
        var result = 0;
        this.getComponents().forEach(function (item) {
            if (item instanceof TGridColumn)
                result = result + item.width;
        });
        if (result < 0) {
            throw new Error("总列宽不允许小于1");
        }
        if (result > MaxWidth) {
            throw new Error("\u603B\u5217\u5BBD\u4E0D\u5141\u8BB8\u5927\u4E8E " + MaxWidth);
        }
        return result;
    };
    Object.defineProperty(TGridGroup.prototype, "columns", {
        get: function () {
            var items = [];
            for (var _i = 0, _a = this.getComponents(); _i < _a.length; _i++) {
                var item = _a[_i];
                if (item instanceof TGridColumn)
                    items.push(item);
            }
            return items;
        },
        enumerable: false,
        configurable: true
    });
    TGridGroup.prototype.getColumnCount = function () {
        return this.columns.length;
    };
    TGridGroup.prototype.getColumn = function (columnCode) {
        for (var _i = 0, _a = this.getComponents(); _i < _a.length; _i++) {
            var item = _a[_i];
            var column = item;
            if (column.code == columnCode)
                return column;
        }
        return null;
    };
    TGridGroup.prototype.forEach = function (fn) {
        for (var _i = 0, _a = this.getComponents(); _i < _a.length; _i++) {
            var item = _a[_i];
            if (item instanceof TGridColumn)
                fn.call(this, item);
        }
    };
    Object.defineProperty(TGridGroup.prototype, "master", {
        get: function () {
            return this._master;
        },
        enumerable: false,
        configurable: true
    });
    TGridGroup.prototype.setMaster = function (value) {
        this._master = value;
        return this;
    };
    Object.defineProperty(TGridGroup.prototype, "onOutput", {
        get: function () {
            return this._onOutput;
        },
        enumerable: false,
        configurable: true
    });
    TGridGroup.prototype.setOnOutput = function (value) {
        this._onOutput = value;
        return this;
    };
    TGridGroup.prototype.outputOfGridTitle = function (html) {
        if (!this.titleVisiable)
            return;
        var tr = new TTr();
        for (var _i = 0, _a = this.getComponents(); _i < _a.length; _i++) {
            var item = _a[_i];
            if (item instanceof TGridColumn) {
                var child = item;
                if (!child.visible)
                    continue;
                var th = new TTh(tr);
                if (child.colSpan)
                    th.writeProperty("colspan", child.colSpan);
                if (this.getTotalWidth() > 0 && child.width > 0) {
                    var rate = child.width / this.getTotalWidth() * 100;
                    th.writeProperty("width", rate.toFixed(1) + "%");
                }
                new TText(th, { text: child.name });
            }
        }
        tr.output(html);
    };
    return TGridGroup;
}(TComponent));
export { TGridGroup };
var TGridGroupChild = /** @class */ (function (_super) {
    __extends(TGridGroupChild, _super);
    function TGridGroupChild(owner) {
        var _this = _super.call(this, owner) || this;
        _this.setTitleVisiable(false);
        _this.setVisible(false);
        return _this;
    }
    TGridGroupChild.prototype.output = function (html) {
        var _this = this;
        var display = new KeyValue(this.visible);
        if (this.onOutput) {
            this.onOutput(this, display);
        }
        var it = 0;
        for (var _i = 0, _a = this.owner.getComponents(); _i < _a.length; _i++) {
            var child = _a[_i];
            if (child == this)
                break;
            it = it + 1;
        }
        var value = "";
        this.forEach(function (child) {
            if (child.visible) {
                var text = _this.current.getText(child.code);
                if (text)
                    value = value + child.name + ": " + text + " ";
            }
        });
        if (value.length > 0) {
            var tr = new TTr();
            tr.setId('tr' + this.current.dataSet.recNo + "_" + it);
            if (!display.asBoolean())
                tr.setCssStyle('display:none');
            var td = new TTd(tr);
            if (this.master)
                td.writeProperty("colspan", "" + this.master.getColumnCount());
            new TText(td, { text: value });
            tr.output(html);
        }
    };
    return TGridGroupChild;
}(TGridGroup));
export { TGridGroupChild };
var TGridGroupMaster = /** @class */ (function (_super) {
    __extends(TGridGroupMaster, _super);
    function TGridGroupMaster(owner) {
        return _super.call(this, owner) || this;
    }
    TGridGroupMaster.prototype.output = function (html) {
        var _this = this;
        var notNull = false;
        var tr = new TTr();
        tr.setId('tr' + this.current.dataSet.recNo);
        this.forEach(function (child) {
            if (!child.visible)
                return;
            var value = _this.current.getText(child.code);
            var td = new TTd(tr);
            if (child.colSpan)
                td.writeProperty("colspan", child.colSpan);
            if (child.align) {
                td.writeProperty("align", child.align);
            }
            new TText(td, { text: value });
            if (value)
                notNull = true;
        });
        if (notNull)
            tr.output(html);
    };
    return TGridGroupMaster;
}(TGridGroup));
export { TGridGroupMaster };
var TGridConfig = /** @class */ (function (_super) {
    __extends(TGridConfig, _super);
    function TGridConfig(owner) {
        if (owner === void 0) { owner = null; }
        var _this = _super.call(this, owner) || this;
        _this._titleVisiable = true;
        _this._children = [];
        return _this;
    }
    Object.defineProperty(TGridConfig.prototype, "current", {
        get: function () {
            return this._current;
        },
        enumerable: false,
        configurable: true
    });
    TGridConfig.prototype.setCurrent = function (row) {
        this._current = row;
    };
    Object.defineProperty(TGridConfig.prototype, "titleVisiable", {
        get: function () {
            return this._titleVisiable;
        },
        enumerable: false,
        configurable: true
    });
    TGridConfig.prototype.setTitleVisiable = function (value) {
        this._titleVisiable = value;
        return this;
    };
    TGridConfig.prototype.getTotalWidth = function () {
        var result = 0;
        this.getComponents().forEach(function (item) {
            if (item instanceof TGridColumn)
                result = result + item.width;
        });
        if (result < 0) {
            throw new Error("总列宽不允许小于1");
        }
        if (result > MaxWidth) {
            throw new Error("\u603B\u5217\u5BBD\u4E0D\u5141\u8BB8\u5927\u4E8E " + MaxWidth);
        }
        return result;
    };
    Object.defineProperty(TGridConfig.prototype, "columns", {
        get: function () {
            var items = [];
            for (var _i = 0, _a = this.getComponents(); _i < _a.length; _i++) {
                var item = _a[_i];
                if (item instanceof TGridColumn)
                    items.push(item);
            }
            return items;
        },
        enumerable: false,
        configurable: true
    });
    TGridConfig.prototype.getColumn = function (columnCode) {
        for (var _i = 0, _a = this.getComponents(); _i < _a.length; _i++) {
            var item = _a[_i];
            var column = item;
            if (column.code == columnCode)
                return column;
        }
        return null;
    };
    Object.defineProperty(TGridConfig.prototype, "master", {
        get: function () {
            if (this.owner instanceof TGridConfig)
                return this.owner;
            else
                return null;
        },
        enumerable: false,
        configurable: true
    });
    TGridConfig.prototype.newChild = function () {
        var child = new TGridConfig(this);
        this._children.push(child);
        return child;
    };
    Object.defineProperty(TGridConfig.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TGridConfig.prototype, "onOutput", {
        get: function () {
            return this._onOutput;
        },
        enumerable: false,
        configurable: true
    });
    TGridConfig.prototype.setOnOutput = function (value) {
        this._onOutput = value;
        return this;
    };
    Object.defineProperty(TGridConfig.prototype, "dataSet", {
        get: function () {
            return this._dataSet;
        },
        enumerable: false,
        configurable: true
    });
    ;
    TGridConfig.prototype.setDataSet = function (value) {
        this._dataSet = value;
        return this;
    };
    ;
    return TGridConfig;
}(TComponent));
export { TGridConfig };
var GridColumn = /** @class */ (function (_super) {
    __extends(GridColumn, _super);
    function GridColumn(owner, code, name) {
        if (name === void 0) { name = null; }
        var _this = _super.call(this, owner) || this;
        _this._width = 0;
        _this._export = true;
        _this._code = code;
        _this._name = name ? name : code;
        return _this;
    }
    Object.defineProperty(GridColumn.prototype, "code", {
        get: function () {
            return this._code;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GridColumn.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GridColumn.prototype, "colSpan", {
        get: function () {
            return this.readProperty("colspan");
        },
        enumerable: false,
        configurable: true
    });
    GridColumn.prototype.setColSpan = function (value) {
        this.writeProperty("colspan", value);
        return this;
    };
    Object.defineProperty(GridColumn.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    GridColumn.prototype.setWidth = function (value) {
        this._width = value;
        return this;
    };
    Object.defineProperty(GridColumn.prototype, "align", {
        get: function () {
            return this._align;
        },
        enumerable: false,
        configurable: true
    });
    GridColumn.prototype.setAlign = function (value) {
        this._align = value;
        return this;
    };
    Object.defineProperty(GridColumn.prototype, "export", {
        get: function () {
            return this._export;
        },
        enumerable: false,
        configurable: true
    });
    GridColumn.prototype.setExport = function (value) {
        this._export = value;
        return this;
    };
    Object.defineProperty(GridColumn.prototype, "onRender", {
        get: function () {
            return this._onRender;
        },
        enumerable: false,
        configurable: true
    });
    GridColumn.prototype.setOnRender = function (value) {
        this._onRender = value;
        return this;
    };
    return GridColumn;
}(TComponent));
export { GridColumn };
// let json = '{"state":1,"body":[["UID_","corpNo_","code_","name_","sex_","age_","createTime_","updateTime_"],[97,null,12345,"毛巾",0,40,"2021-04-12 15:05:51","2021-05-25 18:06:47"],[98,null,111,"kyi",0,19,"2021-04-12 17:01:55","2021-04-12 17:01:55"],[99,null,555,"寇晶",0,28,"2021-04-12 17:02:27","2021-04-12 17:02:27"],[100,null,423,"朱大福",0,19,"2021-04-12 17:03:02","2021-04-12 19:14:24"],[101,null,321,"sk",1,24,"2021-05-13 08:45:37","2021-05-14 10:52:55"]]}';
// let ds = new DataSet().json = json;
// assertEquals(json, ds.json)
// let grid = new TGrid(null);
// new TGridColumn(grid, "code_", "代码").setWidth(35);
// new TGridColumn(grid, "name_", "名称").setWidth(60);
// new TGridColumn(grid.getGroup(1), "sex_", "性别").setCols('2');
// grid.dataSet = ds;
// ds.fields.get("sex_").onGetText = (row: DataRow, meta: FieldMeta) => {
//     return row.getValue(meta.code) == 1 ? "男" : "女";
// };
// grid.repaint();
