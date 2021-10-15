import * as sci from "./SummerCI";

let mainform = new sci.TWinForm();
mainform.setTitle("hello world!")

// 定义操作区
let tools = new sci.TPanel(mainform);
let edtCode = new sci.TEditText(tools);
edtCode.setId('edtCode');
edtCode.setLabel('搜索条件：').setDefaultValue('p012');

let button1 = new sci.TButton(tools).setText('查询');
button1.setId('button1').addEventListener('click', () => {
    let value = edtCode.getInputValue();
    alert('您输入的是：' + value);
})

let serviceConfig = { sid: 'abc', host: 'http://127.0.0.1:80/services/' };

//定义数据源
let ds = new sci.DataSet();
let grid = new sci.TGrid(mainform).setDataSet(ds);
let memo = new sci.TSpan(mainform);

let button2 = new sci.TButton(tools).setText('删除');
button2.setId('button2').addEventListener('click', () => {
    let rs = new sci.RemoteService(serviceConfig);
    rs.setService('SvrExample.search')
    rs.exec((dataOut) => {
        if (dataOut.getState() < 1) {
            alert("fail:" + dataOut.getJson());
            return;
        }
        grid.clear();
        grid.setDataSet(dataOut);
        grid.addColumns(dataOut.getFieldDefs());
        memo.setText("dataset: " + dataOut.getJson())
        mainform.render();
    });
});

ds.append().setValue('code', 'a001').setValue('name', 'jason');
ds.append().setValue('code', 'a002').setValue('name', 'bade').setValue('remark', 'xxxx');
ds.getFieldDefs().get('code').setName('代码');
ds.getFieldDefs().get('name').setName('姓名');
ds.getFieldDefs().add("opera").setName('操作').onGetText = (row: sci.DataRow, meta: sci.FieldMeta) => {
    return `${row.getString('code')} + ${row.getString('name')}`;
};

new sci.TGridColumn(grid, 'code', '代码');
new sci.TGridColumn(grid, 'name', '代码');
new sci.TGridColumn(grid, 'opera', '操作');

let child = new sci.TGridGroupChild(grid);
new sci.TGridColumn(child, "remark", "备注1");
new sci.TGridColumn(child, "remark2", "备注2");

memo.setText("dataset: " + ds.getJson())

mainform.render();
