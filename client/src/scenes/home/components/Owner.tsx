import React from "react";
import { AppInfo } from "../../../services/ApiTypes";

export const Owner = ({ owner }: { owner: AppInfo }) => {
    return (
        <tr>
            <td>{owner.chain}</td>
            <td>{owner.signature}</td>
            <td>{owner.valueMsat}</td>
        </tr>
    );
};
