import React from "react";
import { Link as LinkRecord } from "../../../services/ApiTypes";
import { Link } from "./Link";

export const LinkList = ({ links }: { links: LinkRecord[] }) => {
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
                {links
                    .filter(p => p.isSettled)
                    .map(link => (
                        <Link key={link.priorPreimage} link={link} />
                    ))}
            </tbody>
        </table>
    );
};
