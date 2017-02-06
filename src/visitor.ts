import * as doctrine from "doctrine";
import Annotation = doctrine.Annotation;
import Syntax = doctrine.Syntax;
import Tag = doctrine.Tag;
import Type = doctrine.Type;
import types = doctrine.type;

export abstract class DoctrineVisitor<TOutput> {
    abstract visit(annotation: Annotation): string;
    abstract visitTag(tag: Tag): string;

    visitType(type: Type | string): TOutput {
        if (typeof type === "string") {
            return this.visitRawType(type);
        }

        switch (type.type) {
            case Syntax.AllLiteral:
                return this.visitAllLiteral(type);
            case Syntax.ArrayType:
                return this.visitArrayType(type);
            case Syntax.FieldType:
                return this.visitFieldType(type);
            case Syntax.FunctionType:
                return this.visitFunctionType(type);
            case Syntax.NameExpression:
                return this.visitNameExpression(type);
            case Syntax.NonNullableType:
                return this.visitNonNullableType(type);
            case Syntax.NullableLiteral:
                return this.visitNullableLiteral(type);
            case Syntax.NullableType:
                return this.visitNullableType(type);
            case Syntax.NullLiteral:
                return this.visitNullLiteral(type);
            case Syntax.OptionalType:
                return this.visitOptionalType(type);
            case Syntax.ParameterType:
                return this.visitParameterType(type);
            case Syntax.RecordType:
                return this.visitRecordType(type);
            case Syntax.RestType:
                return this.visitRestType(type);
            case Syntax.TypeApplication:
                return this.visitTypeApplication(type);
            case Syntax.UndefinedLiteral:
                return this.visitUndefinedLiteral(type);
            case Syntax.UnionType:
                return this.visitUnionType(type);
            case Syntax.IntersectionType:
                return this.visitIntersectionType(type);
            case Syntax.VoidLiteral:
                return this.visitVoidLiteral(type);
            default:
                throw new Error("Attempted to visit an unknown Doctrine type.");
        }
    }

    protected abstract visitRawType(type: string): TOutput;
    protected abstract visitAllLiteral(type: types.AllLiteral): TOutput;
    protected abstract visitArrayType(type: types.ArrayType): TOutput;
    protected abstract visitFieldType(type: types.FieldType): TOutput;
    protected abstract visitFunctionType(type: types.FunctionType): TOutput;
    protected abstract visitIntersectionType(type: types.IntersectionType): TOutput;
    protected abstract visitNameExpression(type: types.NameExpression): TOutput;
    protected abstract visitNonNullableType(type: types.NonNullableType): TOutput;
    protected abstract visitNullableLiteral(type: types.NullableLiteral): TOutput;
    protected abstract visitNullableType(type: types.NullableType): TOutput;
    protected abstract visitNullLiteral(type: types.NullLiteral): TOutput;
    protected abstract visitOptionalType(type: types.OptionalType): TOutput;
    protected abstract visitParameterType(type: types.ParameterType): TOutput;
    protected abstract visitRecordType(type: types.RecordType): TOutput;
    protected abstract visitRestType(type: types.RestType): TOutput;
    protected abstract visitTypeApplication(type: types.TypeApplication): TOutput;
    protected abstract visitUndefinedLiteral(type: types.UndefinedLiteral): TOutput;
    protected abstract visitUnionType(type: types.UnionType): TOutput;
    protected abstract visitVoidLiteral(type: types.VoidLiteral): TOutput;
}