import CircularGallery from "./components/CircularGallery";
import "./index.css";

function App() {
  return (
  <div className="relative w-full h-screen overflow-hidden">
  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/40 to-transparent pointer-events-none"/>  
    <CircularGallery /> 
  </div>


  );
}

export default App;

