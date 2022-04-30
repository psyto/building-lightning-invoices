import React, { useEffect, useState } from "react";
import { useSocket } from "../../hooks/UseSocket";
import { useApi } from "../../hooks/UseApi";
import { Greeting } from "./components/Greeting";
import { Time } from "./components/Time";

export const HomeScene = () => {
    const api = useApi();
    const [greeting, setGreeting] = useState<string>();
    const [time, setTime] = useState<string>();

    useEffect(() => {
        api.fetchGreeting().then(setGreeting);
    }, []);

    useSocket("time", (time: string) => {
        setTime(time);
    });

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <Greeting greeting={greeting} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Time time={time} />
                </div>
            </div>
        </div>
    );
};
