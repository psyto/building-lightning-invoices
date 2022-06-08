export class Invoice {
    constructor(
        public memo: string,
        public preimage: string,
        public hash: string,
        public valueSat: string,
        public settled?: boolean,
        public settleDate?: number,
    ) {}
}
