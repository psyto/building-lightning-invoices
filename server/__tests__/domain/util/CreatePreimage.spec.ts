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
            "ab6ed44ee4d408c47b02b6c175164efe1a55c65a605f6155fbd922da82a36349",
        );
    });
});
