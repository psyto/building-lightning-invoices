import { expect } from "chai";
import { createPreimage } from "../../../src/domain/util/CreatePreimage";

describe("function: createPreimage", () => {
    it("returns sha256(local || remote || sats)", () => {
        // arrange
        const local =
            "rypj5rexme7cqdqxzok1ygqw89h3m4qsu3dkje1xt894kmwwjr181sz5tnyz6o588bmx384sdx73ojnz3ebrnifxy67ykjfsfctjfns1";
        const remote =
            "rna7paf9c4ha5cjxwu849px7riqpdn6hd5gts8q9r4kb9sje64w4assrbithnjjipfuq3quceyp8b6rm9ifc9ddqan4ntej7yoj74snd";
        const sats = 1000;

        // act
        const result = createPreimage(local, remote, sats);

        // assert
        expect(result.toString("hex")).to.equal(
            "821c43d357903adbf257bb883e0441d8c095c0cbc595c6fcccca49f94378c860",
        );
    });
});
