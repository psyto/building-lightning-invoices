import React from "react";
import { Leader } from "../../../services/ApiTypes";
import { Leader } from "./Leader";

export const LeaderBoard = ({ leaders }: { leaders: Leader[] }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <td>Identifier</td>
                    <td>Secret</td>
                </tr>
            </thead>
            <tbody>
                {leaders
                    .filter(p => p.isSettled)
                    .map(owner => (
                        <Leader key={owner.identifier} leader={owner} />
                    ))}
            </tbody>
        </table>
    );
};
