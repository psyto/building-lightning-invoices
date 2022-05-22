import { Lnd } from "./v0.12.1-beta/Types";

export interface ILndRestClient {
    getGraph(): Promise<Lnd.Graph>;
    subscribeGraph(cb: (update: Lnd.GraphUpdate) => void): Promise<void>;
}
