import { expect } from "chai";
import { createPreimage } from "../../../src/domain/util/CreatePreimage";

describe("function: createPreimage", () => {
    it("returns sha256(previous || signature)", () => {
        // arrange
        const previous = "0000000000000000000000000000000000000000000000000000000000000000";
        const signature =
            "rnqyje9tkhhmeaq1yjuok7nqkqumyhduxwijjahqaff718o8q45b6in883uit5dxoq7z59r8bhso99nwinbjo6efb8coro734jebete6";

        // act
        const result = createPreimage(previous, signature, 1);

        // assert
        expect(result.toString("hex")).to.equal(
            "f9e15e200f506f2519fd5fbd3b64bb2add4adab97897f01022b86a5710166ecb",
        );
    });
});
