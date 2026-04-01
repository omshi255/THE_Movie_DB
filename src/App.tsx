import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import People from "./pages/People"
const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const Movies = lazy(() => import("./pages/Movies"));
const TV = lazy(() => import("./pages/TV"));
const TVDetails = lazy(() => import("./pages/TVDetails"));
const PersonDetails = lazy(() => import("./pages/PersonDetails"));

import Navbar from "./components/Navbar";
import Footer from "./components/Footer"
function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/people" element={<People />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/tv/:id" element={<TVDetails />} />
          <Route path="/people/:id" element={<PersonDetails />} />

        </Routes>
       
      </Suspense>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;