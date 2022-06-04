import { expect } from "chai";
import { createPreimage } from "../../../src/domain/util/CreatePreimage";

describe("function: createPreimage", () => {
    it("returns sha256(previous || signature)", () => {
        // arrange
        const previous = "0000000000000000000000000000000000000000000000000000000000000000";
        const signature =
            "rnqyje9tkhhmeaq1yjuok7nqkqumyhduxwijjahqaff718o8q45b6in883uit5dxoq7z59r8bhso99nwinbjo6efb8coro734jebete6";

        // act
        const result = createPreimage(previous, signature);

        // assert
        expect(result.toString("hex")).to.equal(
            "a66466289243346de26921e1b135d73cef5cc7b51dd827ca0ebe70e43bb299d3",
        );
    });
});
