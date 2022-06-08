import React, { useEffect, useState } from "react";
import { useSocket } from "../../hooks/UseSocket";
import { useApi } from "../../hooks/UseApi";
import { Leader } from "../../services/ApiTypes";
import { LeaderBoard } from "./components/LeaderBoard";
import { InvoiceForm } from "./components/InvoiceForm";

export const HomeScene = () => {
    const api = useApi();
    const [owners, setOwners] = useState<Leader[]>([]);

    useEffect(() => {
        api.getOwners().then(allOwners => setOwners(allOwners.reverse()));
    }, []);

    useSocket("owner", (owner: Leader) => {
        const copy = owners.slice();
        copy.unshift(owner);
        setOwners(copy);
    });

    console.log(owners);
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <InvoiceForm identifier={owners[0]?.identifier} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <LeaderBoard leaders={owners} />
                </div>
            </div>
        </div>
    );
};
