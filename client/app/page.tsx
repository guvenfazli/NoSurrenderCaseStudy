import EnergyBarSection from "@/components/energyBar/energyBarSection";
import CardSection from "@/components/cardSection/cardSection";
export default function Home() {
  return (
    <main className="flex flex-col gap-5">
      <EnergyBarSection />
      <CardSection />
    </main>
  );
}
