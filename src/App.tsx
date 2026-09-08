import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { MobileActionBar } from './components/MobileActionBar'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Impact } from './components/sections/Impact'
import { Trajectory } from './components/sections/Trajectory'
import { Stack } from './components/sections/Stack'
import { AIFirst } from './components/sections/AIFirst'
import { Credentials } from './components/sections/Credentials'
import { Contact } from './components/sections/Contact'

export default function App() {
  return (
    <>
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <About />
        <Impact />
        <Trajectory />
        <Stack />
        <AIFirst />
        <Credentials />
        <Contact />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  )
}
