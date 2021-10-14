import * as sci from "./SummerCI";

let mainform = new sci.TWinForm();
mainform.setTitle("hello world!")

// 在主页面增加内容
let div = new sci.TDiv(mainform);

let button = new sci.TButton(div);
button.setText('提示按钮');
button.writerProperty('onclick', 'alert(\'你好，我是button\')');

let ds = new sci.DataSet();
ds.append();
ds.setValue('code', 'a001');
ds.setValue('name', 'jason');

ds.append();
ds.setValue('code', 'a002');
ds.setValue('name', 'bade');

let grid = new sci.TGrid(mainform);

grid.setDataSet(ds);

new sci.TGridColumn(grid, "code", "code");

let html = new sci.HtmlWriter();
mainform.output(html);

mainform.render();
