import * as doctrine from "doctrine";
import { default as emit } from "../index";

test("Emit matches input", () => {
    const testInput = `Internal quotes have to be escaped by backslash. This is
{@link chat."#channel"."say-\"hello\""}.
@constructor
@param {string} tr
@param {string} [t]
@param {string} [newline="f"]
@param {(jQuerySelector|Element<T>|Object|Array.<Element>|jQuery|string|function())} arg1
@param {(Element|Object|Document|Object.<string, (string|function(!jQuery.event=))>)} arg2
@return {!jQuery}`;

    const parsed = doctrine.parse(testInput, {
        preserveWhitespace: true,
        sloppy: true,
        lineNumbers: true,
        recoverable: true
    });
    console.log(JSON.stringify(parsed, null, 4));

    const emitted = emit(parsed);

    expect(emitted).toMatch(testInput);
});