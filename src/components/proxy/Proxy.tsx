import Target from "./Target"
import { Routes, Route } from 'react-router-dom';
import ProxyControls from "./ProxyControls";
import Logs from "./Logs";
import Interceptor from "./Interceptor";

const Proxy = () => {
  return (
    <div className="w-full h-full max-h-screen grid grid-rows-[70px_1fr]">
        <ProxyControls/>
        <div className="w-full h-full min-h-0 flex flex-col">
          <Routes>
              <Route path="target" element={<Target />}/>
              <Route path="logs" element={<Logs />}/>
              <Route path="interceptor" element={<Interceptor />}/>
          </Routes>
        </div>
    </div>
  )
}

export default Proxy
