import React from "react";
import { AppInfo } from "../../../services/ApiTypes";
import { Owner } from "./Owner";

export const OwnerList = ({ owners }: { owners: AppInfo[] }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <td>Hash</td>
                    <td>Secret</td>
                    <td>MSat Paid</td>
                </tr>
            </thead>
            <tbody>
                {owners.map(owner => (
                    <Owner key={owner.chain} owner={owner} />
                ))}
            </tbody>
        </table>
    );
};
