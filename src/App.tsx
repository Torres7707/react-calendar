import React from 'react';
import './App.scss';

import Calendar from './components/Calendar';

function App() {
	return (
		<div className="App">
			<Calendar style={{ marginTop: 16, marginLeft: -1 }} />
		</div>
	);
}

export default App;
