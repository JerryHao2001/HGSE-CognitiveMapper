import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Canvas from '../components/Canvas';
import { MapProvider } from '../context/MapContext';

export default function Home() {
  return (
    <MapProvider>
      <div className="bg-gray-50 h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
        </div>
      </div>
    </MapProvider>
  );
}
