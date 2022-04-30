import express from "express";

/**
 * Constructs an Express router for handling application API calls
 * We use a function so we can easily supply dependencies to the
 * handler, making testing easier.
 * @returns
 */
export function sampleApi(): express.Router {
    // Construct a router object
    const router = express();

    // Adds a handler for returning the graph. By default express does not
    // understand async code, but we can easily adapt Express by calling
    // a promise based handler and if it fails catching the error and
    // supplying it with `next` to allow Express to handle the error.
    router.get("/api/greeting", (req, res, next) => getGreeting(req, res).catch(next));

    /**
     * Handler that obtains the graph and returns it via JSON
     */
    async function getGreeting(req: express.Request, res: express.Response) {
        res.json("Hello!");
    }

    return router;
}
