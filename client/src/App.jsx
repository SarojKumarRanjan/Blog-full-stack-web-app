

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { useTheme } from './utils/ThemeContext';
import Container from "./components/Container"


function App() {
  const { theme } = useTheme();

  return (
    <div data-theme={theme}>
    <Container>
       
        
      <Navbar />
      
      <Outlet />
      <Footer />
    
    </Container>
    </div>
   
  )
}

export default App
