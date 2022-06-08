import React from "react";
import { Leader as LeaderRecord } from "../../../services/ApiTypes";

export const Leader = ({ leader }: { leader: LeaderRecord }) => {
    return (
        <tr>
            <td>{leader.identifier}</td>
            <td>{leader.localSignature}</td>
        </tr>
    );
};
