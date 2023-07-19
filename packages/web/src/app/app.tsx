async function reportError() {
  throw new Error('HELLLLLLL WORLDD');
}

export function App() {
  return (
    <div>
      <button onClick={() => void reportError()}>throw error</button>
    </div>
  );
}

export default App;
