import Navbar from "../components/navbar";
import Login from "./login";

function Main() {
  return (
    <div className="App">
      <Navbar />
      <div className="home_page">
        <div className="home_login">
          <Login />
        </div>
      </div>
    </div>
  );
}

export default Main;
