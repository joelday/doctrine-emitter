import * as doctrine from "doctrine";

class StringBuilder {
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

interface IEmitContext {
    sb: StringBuilder;
    options: IEmitOptions;
}

function emitType(type: doctrine.Type, context: IEmitContext) {

}

function emitTag(tag: doctrine.Tag, context: IEmitContext) {
    const sb = context.sb;

    sb.append("@");
    sb.append(tag.title);

    const optional = tag.type && tag.type.type === "OptionalType";

    if (tag.type) {
        sb.append(" ");
        sb.append("{");

        if (context.options.useClosureCompilerSyntax && optional) {
            sb.append("=");
        }

        sb.append("}");
    }

    if (tag.name) {
        sb.append(" ");

        if (optional && !context.options.useClosureCompilerSyntax) {
            sb.append("[");
        }

        sb.append(tag.name);

        const defaultValue: string = (tag as any).default;
        if (defaultValue && !context.options.useClosureCompilerSyntax) {
            sb.append("=");
            sb.append(defaultValue);
        }

        if (optional && !context.options.useClosureCompilerSyntax) {
            sb.append("]");
        }
    }

    if (tag.description) {
        sb.append(" ");
        sb.append(tag.description);
    }

    sb.appendLine();
}

export interface IEmitOptions {
    useClosureCompilerSyntax?: boolean;
    newline?: string;
}

export default function emit(annotation: doctrine.Annotation, options?: IEmitOptions) {
    options = {
        useClosureCompilerSyntax: false,
        newline: "\r\n",
        ...options
    };

    const sb = new StringBuilder(options.newline);

    const context = { sb, options };

    if (annotation.description) {
        sb.appendLine(annotation.description);
    }

    if (annotation.tags) {
        annotation.tags.forEach(t => emitTag(t, context));
    }

    return sb.toString();
}