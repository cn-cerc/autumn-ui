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

let grid = new sci.TGrid(mainform).setDataSet(ds);
grid.addColumns(ds.getFieldDefs());

mainform.render();
