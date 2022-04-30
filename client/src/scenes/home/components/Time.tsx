import React from "react";
import moment from "moment";

export const Time = ({ time }: { time: string }) => {
    const date = moment(time);

    return <div>Time: {date.format("hh:mm:ss")}</div>;
};
