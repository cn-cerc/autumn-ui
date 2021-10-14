export default class HtmlWriter {
    lines: string[] = [];

    print(text: string): HtmlWriter {
        this.lines.push(text);
        return this;
    }

    println(text: string): HtmlWriter {
        this.lines.push(text + "\n");
        return this;
    }

    getText(): string {
        let text = "";
        this.lines.forEach((line) => {
            text = text + line;
        })
        return text;
    }

}

// let html = new HtmlWriter();
// html.print('one');
// html.print('two');
// console.log(html.getText())
