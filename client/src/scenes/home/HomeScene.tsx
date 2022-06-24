import React, { useEffect, useState } from "react";
import { useSocket } from "../../hooks/UseSocket";
import { useApi } from "../../hooks/UseApi";
import { Link } from "../../services/ApiTypes";
import { LinkList } from "./components/LinkList";
import { InvoiceForm } from "./components/InvoiceForm";

export const HomeScene = () => {
    const api = useApi();
    const [links, setLinks] = useState<Link[]>([]);

    useEffect(() => {
        api.getOwners().then(allOwners => setLinks(allOwners.reverse()));
    }, []);

    useSocket("links", (leaders: Link[]) => {
        const copy = links.slice();
        for (const leader of leaders) {
            const index = copy.findIndex(p => p.priorPreimage === leader.priorPreimage);
            if (index >= 0) {
                copy[index] = leader;
                continue;
            } else {
                copy.unshift(leader);
            }
        }
        setLinks(copy);
    });

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1>Ruler of Satoshi</h1>
                </div>
            </div>
            <div className="row">
                <div className="col"></div>
                <div className="col">
                    <InvoiceForm
                        priorPreimage={links[0]?.priorPreimage}
                        startSats={Number(links[0]?.minSats || 0)}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <LinkList links={links} />
                </div>
            </div>
        </div>
    );
};
