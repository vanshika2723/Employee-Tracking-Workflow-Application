import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

const TeamPerformance = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        api.get("/productivity/team")

        .then(res => {

            setData(res.data);

        })

        .catch(err => {

            console.log(err);

        })

        .finally(() => {

            setLoading(false);

        });

    }, []);

    if (loading) {

        return (
            <div className="card p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">
                    Team Performance
                </h2>

                <div className="h-72 flex items-center justify-center">
                    Loading...
                </div>
            </div>
        );

    }

    if (data.length === 0) {

        return (
            <div className="card p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">
                    Team Performance
                </h2>

                <div className="text-slate-500">
                    No Team Data
                </div>
            </div>
        );

    }

    return (

        <div className="card p-6 mb-8">

            <h2 className="text-lg font-semibold mb-5">

                Team-wise Productivity 👥

            </h2>

            <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                    <BarChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="team" />

                        <YAxis domain={[0,100]} />

                        <Tooltip />

                        <Bar
                            dataKey="averageProductivity"
                            radius={[8,8,0,0]}
                            animationDuration={1500}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

};

export default TeamPerformance;