import React from "react";
import { Link as LinkRecord } from "../../../services/ApiTypes";

export const Link = ({ link }: { link: LinkRecord }) => {
    return (
        <tr>
            <td>{link.priorPreimage}</td>
            <td>{link.invoice.valueSat}</td>
            <td>
                {new Date(link.invoice.settleDate * 1000).toLocaleDateString()}{" "}
                {new Date(link.invoice.settleDate * 1000).toLocaleTimeString()}
            </td>
        </tr>
    );
};
