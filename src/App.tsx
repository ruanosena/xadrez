import { Referee } from "./components/Referee";
import { GridSizeProvider } from "./contexts/GridSizeContext";

function App() {
  return (
    <GridSizeProvider>
      <div className="grid h-dvh place-content-center bg-gray-900">
        <Referee />
      </div>
    </GridSizeProvider>
  );
}

export default App;
