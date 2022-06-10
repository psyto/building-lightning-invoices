import React, { useEffect, useState } from "react";
import { useApi } from "../../../hooks/UseApi";
import { CreateInvoiceResult } from "../../../services/ApiTypes";

export const InvoiceForm = ({
    priorPreimage,
    startSats,
}: {
    priorPreimage: string;
    startSats: number;
}) => {
    console.log("priorPreimage", priorPreimage);
    console.log("startSats", startSats);

    const [sig, setSig] = useState<string>();
    const [sats, setSats] = useState<number>(startSats);
    const [invoice, setInvoice] = useState<CreateInvoiceResult>();
    const api = useApi();

    function sigChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
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
    }, [priorPreimage]);

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
                <h3>{priorPreimage}</h3>
            </div>
            <div className="form-group">
                <p>Step 3. Paste your signature to receive an invoice:</p>
                <textarea className="form-control" value={sig} onChange={sigChanged}></textarea>
            </div>
            {invoice && (
                <div className="form-group">
                    <p>Step 4. Pay the invoice</p>
                    {invoice.success ? (
                        <textarea
                            className="form-control"
                            value={invoice.paymentRequest}
                            readOnly
                        />
                    ) : (
                        <small className="warning">{invoice.error}</small>
                    )}
                </div>
            )}
        </form>
    );
};
