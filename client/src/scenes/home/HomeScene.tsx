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

    useSocket("leaders", (leaders: Leader[]) => {
        const copy = owners.slice();
        for (const leader of leaders) {
            const index = copy.findIndex(p => p.identifier === leader.identifier);
            if (index >= 0) {
                copy[index] = leader;
                continue;
            } else {
                copy.unshift(leader);
            }
        }
        setOwners(copy);
    });

    console.log(owners);
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <InvoiceForm
                        identifier={owners[0]?.identifier}
                        startSats={Number(owners[0]?.minSats || 0)}
                    />
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
