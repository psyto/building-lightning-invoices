import React from "react";
import { Link as LeaderRecord } from "../../../services/ApiTypes";

export const Leader = ({ leader }: { leader: LeaderRecord }) => {
    return (
        <tr>
            <td>{leader.priorPreimage}</td>
            <td>{leader.invoice.valueSat}</td>
            <td>
                {new Date(leader.invoice.settleDate * 1000).toLocaleDateString()}{" "}
                {new Date(leader.invoice.settleDate * 1000).toLocaleTimeString()}
            </td>
        </tr>
    );
};
