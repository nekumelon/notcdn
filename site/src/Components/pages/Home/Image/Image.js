import { Component } from 'react';
import './Image.scss';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import {
	faSquare,
	faSquareCheck,
	faSquareFull,
	faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import aws from 'modules/web/aws';

// 2024-0-6 -> Jan 6, 2024
function formatDate(dateString) {
	const [year, month, day] = dateString.split('-');
	const date = new Date(year, month, day);

	const monthName = date.toLocaleString('default', { month: 'short' });

	return `${monthName} ${day}, ${year}`;
}

// 20:33:45 -> 8:33:45 PM
function formatTime(timeString) {
	const [hour, minute, second] = timeString.split(':');
	const date = new Date(0, 0, 0, hour, minute);

	return date.toLocaleTimeString('default', { timeStyle: 'short' });
}

class Image extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	select() {
		const { image, selectImage } = this.props;

		selectImage(image.id);
	}

	async delete() {
		const { image, getImages } = this.props;

		await aws.deleteImage(image.id);

		getImages();
	}

	render() {
		const { image, selected } = this.props;

		return (
			<div className='image-container'>
				<Link to={`/image/${image.id}`}>
					<div className='image-content'>
						{image.data && (
							<img className='image' src={image.data} />
						)}
						<div className='image-details'>
							<span className='image-date'>
								{image.date &&
									image.time &&
									`${formatDate(image.date)} at ${formatTime(
										image.time
									)}`}
							</span>
						</div>
					</div>
				</Link>

				{image.data && (
					<div className='image-controls'>
						<FontAwesomeIcon
							className={`icon image-select-icon ${
								selected && 'select-icon-selected'
							}`}
							icon={selected ? faSquareCheck : faSquare}
							onClick={this.select.bind(this)}
						/>
						<FontAwesomeIcon
							icon={faTrashCan}
							className='icon delete-icon'
							onClick={this.delete.bind(this)}
						/>
					</div>
				)}
			</div>
		);
	}
}

export default Image;
