import { expect } from "chai";
import { xor } from "../../../src/domain/util/Xor";

describe("function: xor", () => {
    it("should throw when buffers are not equal length", () => {
        // arrange
        const a = Buffer.alloc(1);
        const b = Buffer.alloc(2);

        // act & assert
        expect(() => xor(a, b)).to.throw();
    });

    it("should xor equal buffers", () => {
        // arrange
        const a = Buffer.from("00000000", "hex");
        const b = Buffer.from("00000000", "hex");

        // act
        const result = xor(a, b);

        // assert
        expect(result.toString("hex")).to.equal("00000000");
    });

    it("should xor different buffers", () => {
        // arrange
        const a = Buffer.from("0000ffff", "hex");
        const b = Buffer.from("ffff0000", "hex");

        // act
        const result = xor(a, b);

        // assert
        expect(result.toString("hex")).to.equal("ffffffff");
    });
});
