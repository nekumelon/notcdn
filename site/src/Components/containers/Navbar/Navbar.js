import { Component } from 'react';
import './Navbar.scss';
import Input from 'Components/shared/Input';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Gradient } from 'react-gradient';

const gradients = [
	['#bd19d6', '#ea7d10'],
	['#ff2121', '#25c668'],
];

class Navbar extends Component {
	render() {
		const { onSearch } = this.props;

		return (
			<div className='navbar'>
				<div className='section'>
					<Link to='/'>
						<Gradient
							gradients={gradients}
							property='text'
							duration={3000}
							element='span'
							angle='45deg'>
							notcdn
						</Gradient>
					</Link>
				</div>
				<div className='section search-section'>
					<Input
						className='searchbar'
						icon={faMagnifyingGlass}
						placeholder='Enter text, date, or time to search'
						onChange={onSearch}
					/>
				</div>
				<div className='section'>
					<div className='button'>Home</div>
				</div>
			</div>
		);
	}
}

export default Navbar;
