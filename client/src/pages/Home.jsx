
import Heropage from '../components/Hero-section';
import Blogs from './Blogs';

function Home() {
  

  
  return (
    <>
    <Heropage />
    <Blogs disable={"home"}/>
    </>
   
  );
}

export default Home;
