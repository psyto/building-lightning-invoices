import "dotenv/config";

/**
 * Options and configurations used by the application
 */
export class Options {
    /**
     * Constructs an Options instance from environment variables
     * @returns
     */
    public static async fromEnv(): Promise<Options> {
        const port = Number(process.env.PORT);
        return new Options(port);
    }

    constructor(
        readonly port: number,
        readonly lndHost?: string,
        readonly lndReadonlyMacaroon?: Buffer,
        readonly lndCert?: Buffer,
    ) {}
}
