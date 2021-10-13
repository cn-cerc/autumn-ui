import * as sci from '../SummerCI.js';

export default class TestButton {
	render(div){
		let button = new sci.TButton(div);
		button.setText('提示按钮');
		button.writerProperty('onclick', 'alert(\'你好，我是button\')');
	}
}
