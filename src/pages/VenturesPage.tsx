import { Link } from "react-router-dom";

export function VenturesPage() {
  return (
    <>
      <h1>Ventures</h1>
      <p>Choose a retainer type</p>

      <nav aria-label="Retainer types">
        <Link to="/ventures/combat">Combat</Link>
        <Link to="/ventures/miner">Miner</Link>
        <Link to="/ventures/botanist">Botanist</Link>
        <Link to="/ventures/fisher">Fisher</Link>
      </nav>
    </>
  );
}
