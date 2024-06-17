

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { useTheme } from './utils/ThemeContext';
import Container from "./components/Container"

function App() {
  const { theme } = useTheme();

  return (
    <Container>
       <div data-theme={theme}>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
    </Container>
   
  )
}

export default App
