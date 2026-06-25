import React from "react";
import { Route, Routes } from "react-router-dom";
import Repeater from "./repeater/Repeater";

const Tools = () => {
    return (
        <div className="w-full h-full max-h-screen">
            <Routes>
                <Route path="repeater" element={<Repeater />} />
            </Routes>
        </div>
    );
};

export default Tools;
