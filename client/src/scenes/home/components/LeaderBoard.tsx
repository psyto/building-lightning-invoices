import React from "react";
import { Link as LeaderRecord } from "../../../services/ApiTypes";
import { Leader } from "./Leader";

export const LeaderBoard = ({ leaders }: { leaders: LeaderRecord[] }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <td>Node Id</td>
                    <td>Sats</td>
                    <td>Date</td>
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
