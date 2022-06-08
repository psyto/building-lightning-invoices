import React from "react";
import { Leader } from "../../../services/ApiTypes";

export const Leader = ({ leader }: { leader: Leader }) => {
    return (
        <tr>
            <td>{leader.identifier}</td>
            <td>{leader.localSignature}</td>
        </tr>
    );
};
