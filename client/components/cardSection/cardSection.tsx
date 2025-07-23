import NavBar from "../navBar/navBar"
import ItemMenu from "./itemMenu"
export default function CardSection() {
  return (
    <section className="flex flex-col justify-start items-start gap-5">
      <NavBar />
      <ItemMenu />
    </section>
  )
}