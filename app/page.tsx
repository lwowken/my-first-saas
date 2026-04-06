import ArcheryScoringApp from "./ArcheryScoringApp";
import { MatchStoreProvider } from "./MatchStore";

export default function Home() {
  return (
    <MatchStoreProvider>
      <ArcheryScoringApp />
    </MatchStoreProvider> 
  );
}