import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/pages/Home/';
import './App.scss';
import Navbar from 'Components/containers/Navbar';
import Image from 'Components/pages/Image';

class App extends Component {
	constructor() {
		super();

		this.state = {
			searchQuery: '',
		};
	}

	handleSearch(value) {
		this.setState({
			searchQuery: value,
		});
	}

	render() {
		const { searchQuery } = this.state;

		return (
			<BrowserRouter>
				<Navbar onSearch={this.handleSearch.bind(this)} />
				<Routes>
					<Route
						path='*'
						element={<Home searchQuery={searchQuery} />}
					/>
					<Route path='/image/:id' element={<Image />} />
				</Routes>
			</BrowserRouter>
		);
	}
}

export default App;
