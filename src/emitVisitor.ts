import * as doctrine from "doctrine";
import Annotation = doctrine.Annotation;
import Syntax = doctrine.Syntax;
import Tag = doctrine.Tag;
import Type = doctrine.Type;
import types = doctrine.type;

import { StringBuilder } from "./utils";
import { DoctrineVisitor } from "./visitor";

export function emitAnnotation(annotation: Annotation, options?: IEmitOptions) {
    return new EmitVisitor(options || {}).visit(annotation);
}

export function emitTag(tag: Tag, options?: IEmitOptions) {
    return new EmitVisitor(options || {}).visitTag(tag);
}

export interface IEmitOptions {
    closureCompilerOptionals?: boolean;
    newline?: string;
    emitTypes?: boolean;
    periodBeforeApplicationTypes?: boolean;
    compact?: boolean;
    useTypeLiteralArrays?: boolean;
}

export class EmitVisitor extends DoctrineVisitor<string> {
    private readonly _options: IEmitOptions;

    constructor(options: IEmitOptions) {
        super();

        this._options = {
            closureCompilerOptionals: false,
            newline: "\n",
            emitTypes: true,
            periodBeforeApplicationTypes: false,
            compact: false,
            useTypeLiteralArrays: true,
            ...options
        };
    }

    visit(annotation: Annotation): string {
        const sb = this.createStringBuilder();

        if (annotation.description) {
            sb.append(annotation.description);
        }

        if (annotation.tags) {
            sb.append(annotation.tags.map(t => this.visitTag(t)).join(this._options.newline));
        }

        return sb.toString();
    }

    visitTag(tag: Tag): string {
        const sb = this.createStringBuilder();

        sb.append("@");
        sb.append(tag.title);

        const asOptional = !!tag.type && tag.type.type === Syntax.OptionalType ? tag.type as types.OptionalType : null;

        if (tag.type && this._options.emitTypes) {
            sb.append(" ");
            sb.append("{");

            // If this is an optional, but that is being represented as [argName], then skip past it.
            if (asOptional && !this._options.closureCompilerOptionals) {
                sb.append(this.visitType(asOptional.expression));
            }
            else {
                sb.append(this.visitType(tag.type));
            }

            if (asOptional && this._options.closureCompilerOptionals) {
                sb.append("=");
            }

            sb.append("}");
        }

        if (tag.name) {
            sb.append(" ");

            if (asOptional && !this._options.closureCompilerOptionals) {
                sb.append("[");
            }

            sb.append(tag.name);

            const defaultValue: string = (tag as any).default;
            if (defaultValue && !this._options.closureCompilerOptionals) {
                sb.append("=");
                sb.append(defaultValue);
            }

            if (asOptional && !this._options.closureCompilerOptionals) {
                sb.append("]");
            }
        }

        if (tag.description) {
            sb.append(" ");
            sb.append(tag.description);
        }

        return sb.toString();
    }

    protected visitAllLiteral(type: types.AllLiteral): string {
        return "*";
    }

    protected visitArrayType(type: types.ArrayType): string {
        const sb = this.createStringBuilder();
        sb.append("[");
        sb.append(type.elements.map(t => this.visitType(t)).join(this.getDelimiter(",")));
        sb.append("]");
        return sb.toString();
    }

    protected visitFieldType(type: types.FieldType): string {
        const sb = this.createStringBuilder();

        sb.append(type.key);

        if (type.value) {
            sb.append(this.getDelimiter(":"));
            sb.append(this.visitType(type.value));
        }

        return sb.toString();
    }

    protected visitFunctionType(type: types.FunctionType): string {
        const sb = this.createStringBuilder();

        sb.append("function(");

        const params: string[] = [];

        if (type.this) {
            params.push("this:" + this.visitType(type.this));
        }

        if (type.new) {
            params.push("new:" + this.visitType(type.new));
        }

        params.push(...type.params.map(p => this.visitType(p)));

        sb.append(params.join(this.getDelimiter(",")));

        sb.append(")");

        if (type.result) {
            sb.append(this.getDelimiter(":"));

            // TODO: Haven't seen how this can be an array yet, but the d.ts says it is?
            sb.append(this.visitType(type.result as any as Type));
        }

        return sb.toString();
    }

    protected visitNameExpression(type: types.NameExpression): string {
        return type.name;
    }

    protected visitNonNullableType(type: types.NonNullableType): string {
        return (type.prefix ? "!" : "") + this.visitType(type.expression);
    }

    protected visitNullableLiteral(type: types.NullableLiteral): string {
        return "?";
    }

    protected visitNullableType(type: types.NullableType): string {
        return (type.prefix ? "?" : "") + this.visitType(type.expression);
    }

    protected visitNullLiteral(type: types.NullLiteral): string {
        return "null";
    }

    protected visitOptionalType(type: types.OptionalType): string {
        return this.visitType(type.expression) + "=";
    }

    protected visitParameterType(type: types.ParameterType): string {
        const sb = this.createStringBuilder();

        if (type.name) {
            sb.append(type.name);
        }

        if (type.name && type.expression) {
            sb.append(this.getDelimiter(":"));
        }

        if (type.expression) {
            sb.append(this.visitType(type.expression));
        }

        return sb.toString();
    }

    protected visitRecordType(type: types.RecordType): string {
        const sb = this.createStringBuilder();

        sb.append("{");
        sb.append(type.fields.map(f => this.visitType(f)).join(this.getDelimiter(",")));
        sb.append("}");

        return sb.toString();
    }

    protected visitRestType(type: types.RestType): string {
        const sb = this.createStringBuilder();
        sb.append("...");

        if (type.expression) {
            sb.append(this.visitType(type.expression));
        }

        return sb.toString();
    }

    protected visitTypeApplication(type: types.TypeApplication): string {
        const sb = this.createStringBuilder();

        if (this._options.useTypeLiteralArrays &&
            type.expression.type === Syntax.NameExpression &&
            type.expression.name.toLowerCase() === "array" &&
            type.applications.length === 1) {

            sb.append(this.visitType(type.applications[0]));
            sb.append("[]");
        }
        else {
            sb.append(this.visitType(type.expression));
            if (this._options.periodBeforeApplicationTypes) {
                sb.append(".");
            }
            sb.append("<");
            sb.append(type.applications.map(t => this.visitType(t)).join(this.getDelimiter(",")));
            sb.append(">");
        }

        return sb.toString();
    }

    protected visitUndefinedLiteral(type: types.UndefinedLiteral): string {
        return "undefined";
    }

    protected visitUnionType(type: types.UnionType): string {
        return this.visitUnionOrIntersectionType(type, "|");
    }

    protected visitIntersectionType(type: types.IntersectionType): string {
        return this.visitUnionOrIntersectionType(type, "&");
    }

    protected visitVoidLiteral(type: types.VoidLiteral): string {
        return "void";
    }

    private visitUnionOrIntersectionType(type: types.UnionType | types.IntersectionType, delimiter: string) {
        const sb = this.createStringBuilder();

        sb.append("(");
        sb.append(type.elements.map(t => this.visitType(t)).
            join(this.getDelimiter(delimiter, true)));
        sb.append(")");

        return sb.toString();
    }

    private createStringBuilder() {
        return new StringBuilder(this._options.newline);
    }

    private getDelimiter(delimiter: string, twoSided = false) {
        const sb = this.createStringBuilder();

        if (twoSided && !this._options.compact) {
            sb.append(" ");
        }

        sb.append(delimiter);

        if (!this._options.compact) {
            sb.append(" ");
        }

        return sb.toString();
    }
}
