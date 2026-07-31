import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AttendancePolicyManagement = () => {
  const [policy, setPolicy] = useState({
    minimumWorkingHours: 9,

    allowedIdleTime: 60,

    breakPolicy: "FIXED",

    breakDuration: 60,

    gracePeriod: 15,

    overtimeAfter: 9,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const res = await api.get("/policy");

      setPolicy(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setPolicy({
      ...policy,

      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const updatePolicy = async () => {
    try {
      await api.put(
        "/policy",

        policy,
      );

      setMessage("Policy Updated Successfully");
    } catch (error) {
      console.log(error);

      setMessage("Update Failed");
    }
  };

  return (
    <div className="card p-6 mb-8">
      <h2 className="text-xl font-bold mb-5">Attendance Policy Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Minimum Working Hours */}

        <div>
          <label className="block mb-1">Minimum Working Hours</label>

          <input
            className="input w-full"
            type="number"
            name="minimumWorkingHours"
            value={policy.minimumWorkingHours}
            onChange={handleChange}
          />
        </div>

        {/* Allowed Idle Time */}

        <div>
          <label className="block mb-1">Allowed Idle Time (Minutes)</label>

          <input
            className="input w-full"
            type="number"
            name="allowedIdleTime"
            value={policy.allowedIdleTime}
            onChange={handleChange}
          />
        </div>

        {/* Break Policy */}

        <div>
          <label className="block mb-1">Break Policy</label>

          <select
            className="input w-full"
            name="breakPolicy"
            value={policy.breakPolicy}
            onChange={handleChange}
          >
            <option value="FIXED">Fixed Break</option>

            <option value="FLEXIBLE">Flexible Break</option>
          </select>
        </div>

        {/* Break Duration */}

        <div>
          <label className="block mb-1">Break Duration (Minutes)</label>

          <input
            className="input w-full"
            type="number"
            name="breakDuration"
            value={policy.breakDuration}
            onChange={handleChange}
          />
        </div>

        {/* Grace Period */}

        <div>
          <label className="block mb-1">Grace Period (Minutes)</label>

          <input
            className="input w-full"
            type="number"
            name="gracePeriod"
            value={policy.gracePeriod}
            onChange={handleChange}
          />
        </div>

        {/* Overtime */}

        <div>
          <label className="block mb-1">Overtime After (Hours)</label>

          <input
            className="input w-full"
            type="number"
            name="overtimeAfter"
            value={policy.overtimeAfter}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        onClick={updatePolicy}
        className="mt-5 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Save Policy
      </button>

      {message && <p className="mt-3 text-green-600">{message}</p>}
    </div>
  );
};

export default AttendancePolicyManagement;
