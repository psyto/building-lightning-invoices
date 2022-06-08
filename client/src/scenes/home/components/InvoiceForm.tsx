import React, { useEffect, useState } from "react";
import { useApi } from "../../../hooks/UseApi";
import { CreateInvoiceResult } from "../../../services/ApiTypes";

export const InvoiceForm = ({ identifier }: { identifier: string }) => {
    const [sig, setSig] = useState<string>();
    const [invoice, setInvoice] = useState<CreateInvoiceResult>();
    const api = useApi();

    function signatureChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = e.target.value;
        setSig(value);
        if (value) {
            api.createInvoice(value).then(setInvoice).catch(setInvoice);
        }
    }

    useEffect(() => {
        setSig("");
        setInvoice(undefined);
    }, [identifier]);

    return (
        <form className="form">
            <div className="form-group">
                <p>Step 1. Sign a message for the following:</p>
                <h3>{identifier}</h3>
            </div>
            <div className="form-group">
                <p>Step 2. Request an invoice using your signature</p>
                <textarea
                    className="form-control"
                    value={sig}
                    onChange={signatureChanged}
                ></textarea>
            </div>
            {invoice && (
                <div className="form-group">
                    <p>Step 3. Pay the invoice</p>
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
