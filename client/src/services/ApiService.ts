import { Leader, CreateInvoiceRequest, CreateInvoiceResult } from "./ApiTypes";

export class ApiService {
    constructor(readonly host: string = "http://127.0.0.1:8001") {}

    protected async get<T>(path: string): Promise<T> {
        const res = await fetch(path, { credentials: "include" });
        return await res.json();
    }

    protected async post<T>(path: string, data: unknown): Promise<T> {
        const res = await fetch(path, {
            credentials: "include",
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return await res.json();
    }

    public async getOwners(): Promise<Leader[]> {
        return this.get("/api/owners");
    }

    public async createInvoice(signature: string): Promise<CreateInvoiceResult> {
        const data: CreateInvoiceRequest = {
            signature,
        };
        return this.post("/api/invoices", data);
    }
}
