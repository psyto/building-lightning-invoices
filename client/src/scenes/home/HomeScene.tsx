import React, { useEffect, useState } from "react";
import { useSocket } from "../../hooks/UseSocket";
import { useApi } from "../../hooks/UseApi";
import { AppInfo } from "../../services/ApiTypes";
import { OwnerList } from "./components/OwnerList";
import { InvoiceForm } from "./components/InvoiceForm";

export const HomeScene = () => {
    const api = useApi();
    const [owners, setOwners] = useState<AppInfo[]>([]);

    useEffect(() => {
        api.getOwners().then(allOwners => setOwners(allOwners.reverse()));
    }, []);

    useSocket("owner", (owner: AppInfo) => {
        const copy = owners.slice();
        copy.unshift(owner);
        setOwners(copy);
    });

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <InvoiceForm next={owners[0]?.next} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <OwnerList owners={owners} />
                </div>
            </div>
        </div>
    );
};
