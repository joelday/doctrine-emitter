export class StringBuilder {
    private readonly _newline: string;

    private _text = "";
    constructor(newline = "\r\n") {
        this._newline = newline;
    }

    append(...text: string[]) {
        this._text += "".concat(...text);
    }

    appendLine(...text: string[]) {
        this.append(...text, this._newline);
    }

    toString() {
        return this._text;
    }
}