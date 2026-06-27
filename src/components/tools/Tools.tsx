import { Route, Routes } from "react-router-dom";
import Repeater from "./repeater/Repeater";
import Intruder from "./intruder/Intruder";

const Tools = () => {
    return (
        <div className="w-full h-full max-h-screen">
            <Routes>
                <Route path="repeater" element={<Repeater />} />
                <Route path="intruder" element={<Intruder />} />
            </Routes>
        </div>
    );
};

export default Tools;
