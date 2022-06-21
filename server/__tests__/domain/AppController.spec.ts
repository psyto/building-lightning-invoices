import { expect } from "chai";
import sinon from "sinon";
import { LndInvoiceDataMapper } from "../../src/data/lnd/LndInvoiceDataMapper";
import { LndMessageSigner } from "../../src/data/lnd/LndMessageSigner";
import { AppController } from "../../src/domain/AppController";
import { Link } from "../../src/domain/Link";
import { LinkFactory } from "../../src/domain/LinkFactory";

describe("AppController", () => {
    describe(".start()", () => {
        it("adds the first link to the chain", async () => {
            // arrange
            const minSats = 1000;
            const seed = "0000000000000000000000000000000000000000000000000000000000000001";
            const invoiceDataMapper = sinon.createStubInstance(LndInvoiceDataMapper);
            const messageSigner = sinon.createStubInstance(LndMessageSigner);
            const linkFactory = sinon.createStubInstance(LinkFactory);
            const fakeLink = new Link(
                "0000000000000000000000000000000000000000000000000000000000000001",
                "rypj5rexme7cqdqxzok1ygqw89h3m4qsu3dkje1xt894kmwwjr181sz5tnyz6o588bmx384sdx73ojnz3ebrnifxy67ykjfsfctjfns1",
                1000,
            );
            linkFactory.createFromSeed.resolves(fakeLink);
            const sut = new AppController(invoiceDataMapper, messageSigner, linkFactory);

            // act
            await sut.start(seed, minSats);

            // assert
            expect(linkFactory.createFromSeed.called).to.equal(
                true,
                "expect createFromSeed to be used",
            );
            expect(linkFactory.createFromSeed.args[0][0]).to.equal(
                seed,
                "expect createFromSeed to be called with the seed",
            );
            expect(linkFactory.createFromSeed.args[0][1]).to.equal(
                minSats,
                "expect minSats to be called with the provided argument",
            );
        });

        it("syncs the invoice database", async () => {
            // arrange
            const minSats = 1000;
            const seed = "0000000000000000000000000000000000000000000000000000000000000001";
            const invoiceDataMapper = sinon.createStubInstance(LndInvoiceDataMapper);
            const messageSigner = sinon.createStubInstance(LndMessageSigner);
            const linkFactory = sinon.createStubInstance(LinkFactory);
            const fakeLink = new Link(
                "0000000000000000000000000000000000000000000000000000000000000001",
                "rypj5rexme7cqdqxzok1ygqw89h3m4qsu3dkje1xt894kmwwjr181sz5tnyz6o588bmx384sdx73ojnz3ebrnifxy67ykjfsfctjfns1",
                1000,
            );
            linkFactory.createFromSeed.resolves(fakeLink);
            const sut = new AppController(invoiceDataMapper, messageSigner, linkFactory);

            // act
            await sut.start(seed, minSats);

            // assert
            expect(invoiceDataMapper.sync.called).to.equal(true, "expect sync to be called");
        });
    });
});
