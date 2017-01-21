import * as doctrine from "doctrine";
import * as emit from "../index";

test("Emit matches input", () => {
    const testInput = `Description

@constructor
@param {(jQuerySelector | Element | Object | Array<Element> | jQuery | string | function())} [arg1="f"] Description
@param {(Element | Object | Document | Object<string, (string | function(!jQuery.event=))>)} [arg2] Description
@return {!jQuery} Description`;

    const parsed = doctrine.parse(testInput, {
        preserveWhitespace: true,
        sloppy: true,
        lineNumbers: true,
        recoverable: true
    });

    const emitted = emit.emitAnnotation(parsed);
    expect(emitted).toEqual(testInput);
});