import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./components/Home";
import { Busca } from "./components/Busca";


function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home/>}/>
         <Route path="/busca" element={<Busca />} />
         

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
