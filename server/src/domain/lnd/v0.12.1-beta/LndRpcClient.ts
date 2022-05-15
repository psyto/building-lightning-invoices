/* eslint-disable @typescript-eslint/no-explicit-any */
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { Lnd } from "./Types";
import { promisify } from "util";

process.env.GRPC_SSL_CIPHER_SUITES = "HIGH+ECDSA";

/**
 * A domain specific RPC client for LND. This class makes requests using
 * the macaroon and TLS cert provided in the constructor. This class is
 * based on instructions for creating a GRPC client from
 * https://github.com/lightningnetwork/lnd/blob/master/docs/grpc/javascript.md
 */
export class LndRpcClient {
    protected lightning: any;

    constructor(host: string, macaroon: Buffer, cert: Buffer) {
        const loaderOptions = {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        };
        const protoPath = path.join(__dirname, "rpc.proto");
        const packageDefinition = protoLoader.loadSync(protoPath, loaderOptions);
        const lnrpcDescriptor = grpc.loadPackageDefinition(packageDefinition);
        const lnrpc: any = lnrpcDescriptor.lnrpc;

        const metadata = new grpc.Metadata();
        metadata.add("macaroon", macaroon.toString("hex"));
        const macaroonCreds = grpc.credentials.createFromMetadataGenerator((_args, callback) => {
            callback(null, metadata);
        });
        const sslCreds = grpc.credentials.createSsl(cert);
        const credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);

        this.lightning = new lnrpc.Lightning(host, credentials);
    }

    /**
     * GetInfo returns general information concerning the lightning node including it's identity
     * pubkey, alias, the chains it is connected to, and information concerning the number of
     * open+pending channels.
     * Reference: https://api.lightning.community/#getinfo
     * @returns
     */
    public getInfo(): Promise<Lnd.Info> {
        return promisify(this.lightning.getInfo.bind(this.lightning))({});
    }
}
