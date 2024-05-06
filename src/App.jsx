import "./App.css";
import PaymentSplitter from "./components/PaymentSplitter";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1 mx-auto">
      <PaymentSplitter />
      <Analytics />
    </main>
  );
}

export default App;
