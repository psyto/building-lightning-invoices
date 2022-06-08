import React, { useEffect, useState } from "react";
import { useApi } from "../../../hooks/UseApi";
import { CreateInvoiceResult } from "../../../services/ApiTypes";

export const InvoiceForm = ({
    identifier,
    startSats,
}: {
    identifier: string;
    startSats: number;
}) => {
    const [sig, setSig] = useState<string>();
    const [sats, setSats] = useState<number>(startSats);
    const [invoice, setInvoice] = useState<CreateInvoiceResult>();
    const api = useApi();

    function signatureChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = e.target.value;
        setSig(value);
        if (value) {
            api.createInvoice(value, sats).then(setInvoice).catch(setInvoice);
        }
    }

    function satsChanges(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.target.value);
        setSats(isNaN(value) ? startSats : value);
    }

    useEffect(() => {
        setSig("");
        setSats(startSats);
        setInvoice(undefined);
    }, [identifier]);

    return (
        <form className="form">
            <div className="form-group">
                <p>Step 1. Specify the satoshis you will pay to become the new leader:</p>
                <input
                    type="number"
                    className="form-control"
                    value={sats}
                    onChange={satsChanges}
                ></input>
            </div>
            <div className="form-group">
                <p>Step 2. Sign a message for the following:</p>
                <h3>{identifier}</h3>
            </div>
            <div className="form-group">
                <p>Step 3. Request an invoice using your signature</p>
                <textarea
                    className="form-control"
                    value={sig}
                    onChange={signatureChanged}
                ></textarea>
            </div>
            {invoice && (
                <div className="form-group">
                    <p>Step 4. Pay the invoice</p>
                    {invoice.success ? (
                        <textarea className="form-control" value={invoice.paymentRequest} />
                    ) : (
                        <small className="warning">{invoice.error}</small>
                    )}
                </div>
            )}
        </form>
    );
};
