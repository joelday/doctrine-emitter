import * as doctrine from "doctrine";
import Annotation = doctrine.Annotation;
import Syntax = doctrine.Syntax;
import Tag = doctrine.Tag;
import Type = doctrine.Type;
import types = doctrine.type;

import { StringBuilder } from "./utils";
import { DoctrineVisitor } from "./visitor";

export function emit(annotation: Annotation, options: IEmitOptions = {}) {
    options = {
        useClosureCompilerSyntax: false,
        newline: "\r\n",
        ...options
    };

    const sb = new StringBuilder(options.newline);
    const visitor = new EmitVisitor(sb, options.useClosureCompilerSyntax);

    visitor.visit(annotation);

    return sb.toString();
}

export interface IEmitOptions {
    useClosureCompilerSyntax?: boolean;
    newline?: string;
}

export class EmitVisitor extends DoctrineVisitor {
    private readonly _sb: StringBuilder;
    private readonly _useClosureCompilerSyntax: boolean;

    constructor(sb: StringBuilder, useClosureCompilerSyntax: boolean) {
        super();
        this._sb = sb;
        this._useClosureCompilerSyntax = useClosureCompilerSyntax;
    }

    visit(annotation: Annotation): void {
        if (annotation.description) {
            this._sb.append(annotation.description);
        }

        if (annotation.tags) {
            annotation.tags.forEach(t => {
                this.visitTag(t);
                this._sb.appendLine();
            });
        }
    }

    visitTag(tag: Tag): void {
        this._sb.append("@");
        this._sb.append(tag.title);

        const optional = tag.type && tag.type.type === Syntax.OptionalType;

        if (tag.type) {
            this._sb.append(" ");
            this._sb.append("{");

            if (this._useClosureCompilerSyntax && optional) {
                this._sb.append("=");
            }

            this._sb.append("}");
        }

        if (tag.name) {
            this._sb.append(" ");

            if (optional && !this._useClosureCompilerSyntax) {
                this._sb.append("[");
            }

            this._sb.append(tag.name);

            const defaultValue: string = (tag as any).default;
            if (defaultValue && !this._useClosureCompilerSyntax) {
                this._sb.append("=");
                this._sb.append(defaultValue);
            }

            if (optional && !this._useClosureCompilerSyntax) {
                this._sb.append("]");
            }
        }

        if (tag.description) {
            this._sb.append(" ");
            this._sb.append(tag.description);
        }
    }

    protected visitAllLiteral(type: types.AllLiteral): void {
        return;
    }

    protected visitArrayType(type: types.ArrayType): void {
        return;
    }

    protected visitFieldType(type: types.FieldType): void {
        return;
    }

    protected visitFunctionType(type: types.FunctionType): void {
        return;
    }

    protected visitNameExpression(type: types.NameExpression): void {
        return;
    }

    protected visitNonNullableType(type: types.NonNullableType): void {
        return;
    }

    protected visitNullableLiteral(type: types.NullableLiteral): void {
        return;
    }

    protected visitNullableType(type: types.NullableType): void {
        return;
    }

    protected visitNullLiteral(type: types.NullLiteral): void {
        return;
    }

    protected visitOptionalType(type: types.OptionalType): void {
        return;
    }

    protected visitParameterType(type: types.ParameterType): void {
        return;
    }

    protected visitRecordType(type: types.RecordType): void {
        return;
    }

    protected visitRestType(type: types.RestType): void {
        return;
    }

    protected visitTypeApplication(type: types.TypeApplication): void {
        return;
    }

    protected visitUndefinedLiteral(type: types.UndefinedLiteral): void {
        return;
    }

    protected visitUnionType(type: types.UnionType): void {
        return;
    }

    protected visitVoidLiteral(type: types.VoidLiteral): void {
        return;
    }
}
