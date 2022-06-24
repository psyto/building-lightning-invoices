import React from "react";
import { Link as LinkRecord } from "../../../services/ApiTypes";

export const Leader = ({ link }: { link: LinkRecord }) => {
    if (!link || !link.isSettled) {
        return <h2>No ruler, be the first!</h2>;
    }
    return (
        <div>
            <h2>The Ruler</h2>
            <img src="/public/imgs/bitcoin.png" width="200" />
            <div>Lightning Node:</div>
            <h4 style={{ wordBreak: "break-all" }}>{link.invoice.buyerNodeId}</h4>
        </div>
    );
};
