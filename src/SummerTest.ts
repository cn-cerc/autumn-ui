import * as sci from "./SummerCI";

let mainform = new sci.TWinForm();
mainform.setTitle("hello world!")

// 定义操作区
let tools = new sci.TPanel(mainform);
let button1 = new sci.TButton(tools).setText('增加');
button1.writerProperty('onclick', 'alert(\'你好，我是button\')');

let button2 = new sci.TButton(tools).setText('删除');
button2.writerProperty('onclick', 'alert(\'你好，我是button\')');

//定义数据源
let ds = new sci.DataSet();
ds.append().setValue('code', 'a001').setValue('name', 'jason');
ds.append().setValue('code', 'a002').setValue('name', 'bade');
ds.getFieldDefs().get('code').setName('代码');
ds.getFieldDefs().get('name').setName('姓名');
ds.getFieldDefs().add("opera").setName('操作').OnGetText = (row: sci.DataRow, meta: sci.FieldMeta) => {
    return `${row.getString('code')}:${row.getString('name')}`;
};

let grid = new sci.TGrid(mainform).setDataSet(ds);
grid.addColumns(ds.getFieldDefs());
grid.getColumn('opera').setExport(false);

mainform.render();
