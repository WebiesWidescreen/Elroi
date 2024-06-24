import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import PaymentScreen from "./Payment/paymentScreen";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<PaymentScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
