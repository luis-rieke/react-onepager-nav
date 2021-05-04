import './App.css';
import { Nav } from './nav';
import { Main } from './pages';
import IntersectionProvider from './context/NavContext';

function App() {
	return (
		<IntersectionProvider>
			<div className='appContainer'>
				<Nav />
				<Main />
			</div>
		</IntersectionProvider>
	);
}

export default App;
