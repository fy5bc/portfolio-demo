//import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import About from './components/About';
import Projects from './components/Project';
import Skills from './components/Skills';
import ContactMe from './components/ContactMe';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="App">
          <h1>Welcome</h1>
          <Chatbot />
          <main><Header /><About /><Projects /><Skills /><ContactMe /></main>

    </div>
  );
}

export default App;

/*<header className="App-header">
      	<img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.js</code> and save to reload.</p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">Learn React</a>
      </header>*/