import * as doctrine from "doctrine";
import Annotation = doctrine.Annotation;
import Syntax = doctrine.Syntax;
import Tag = doctrine.Tag;
import Type = doctrine.Type;
import types = doctrine.type;

export abstract class DoctrineVisitor {
    abstract visit(annotation: Annotation);
    abstract visitTag(tag: Tag): void;

    visitType(type: Type): void {
        switch (type.type) {
            case Syntax.AllLiteral:
                this.visitAllLiteral(type);
                break;
            case Syntax.ArrayType:
                this.visitArrayType(type);
                break;
            case Syntax.FieldType:
                this.visitFieldType(type);
                break;
            case Syntax.FunctionType:
                this.visitFunctionType(type);
                break;
            case Syntax.NameExpression:
                this.visitNameExpression(type);
                break;
            case Syntax.NonNullableType:
                this.visitNonNullableType(type);
                break;
            case Syntax.NullableLiteral:
                this.visitNullableLiteral(type);
                break;
            case Syntax.NullableType:
                this.visitNullableType(type);
                break;
            case Syntax.NullLiteral:
                this.visitNullLiteral(type);
                break;
            case Syntax.OptionalType:
                this.visitOptionalType(type);
                break;
            case Syntax.ParameterType:
                this.visitParameterType(type);
                break;
            case Syntax.RecordType:
                this.visitRecordType(type);
                break;
            case Syntax.RestType:
                this.visitRestType(type);
                break;
            case Syntax.TypeApplication:
                this.visitTypeApplication(type);
                break;
            case Syntax.UndefinedLiteral:
                this.visitUndefinedLiteral(type);
                break;
            case Syntax.UnionType:
                this.visitUnionType(type);
                break;
            case Syntax.VoidLiteral:
                this.visitVoidLiteral(type);
                break;
            default:
                throw new Error("Attempted to visit an unknown Doctrine type.");
        }
    }

    protected abstract visitAllLiteral(type: types.AllLiteral): void;
    protected abstract visitArrayType(type: types.ArrayType): void;
    protected abstract visitFieldType(type: types.FieldType): void;
    protected abstract visitFunctionType(type: types.FunctionType): void;
    protected abstract visitNameExpression(type: types.NameExpression): void;
    protected abstract visitNonNullableType(type: types.NonNullableType): void;
    protected abstract visitNullableLiteral(type: types.NullableLiteral): void;
    protected abstract visitNullableType(type: types.NullableType): void;
    protected abstract visitNullLiteral(type: types.NullLiteral): void;
    protected abstract visitOptionalType(type: types.OptionalType): void;
    protected abstract visitParameterType(type: types.ParameterType): void;
    protected abstract visitRecordType(type: types.RecordType): void;
    protected abstract visitRestType(type: types.RestType): void;
    protected abstract visitTypeApplication(type: types.TypeApplication): void;
    protected abstract visitUndefinedLiteral(type: types.UndefinedLiteral): void;
    protected abstract visitUnionType(type: types.UnionType): void;
    protected abstract visitVoidLiteral(type: types.VoidLiteral): void;
}