import { Component } from 'react';
import aws from 'modules/web/aws';
import Image from './Image';
import './Home.scss';
import Input from 'Components/shared/Input';
import Button from 'Components/shared/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowCircleLeft,
	faArrowRotateLeft,
	faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

class Home extends Component {
	constructor() {
		super();

		this.state = {
			selected: [],
		};
	}

	selectImage(id) {
		const { selected } = this.state;

		if (selected.includes(id)) {
			this.setState({
				selected: selected.filter((selectedId) => selectedId !== id),
			});
		} else {
			this.setState({
				selected: [...selected, id],
			});
		}
	}

	async getImages() {
		const images = await aws.getAllImages();
		this.setState({
			images,
			loaded: true,
		});
	}

	async componentDidMount() {
		await this.getImages();
	}

	async deleteSelected() {
		let { selected, images } = this.state;

		images = images.filter((image) => !selected.includes(image.id));

		this.setState({
			images,
		});

		await aws.deleteImages(selected);

		this.setState({
			selected: [],
		});

		await this.getImages();
	}

	imageFilter(image) {
		const { searchQuery } = this.props;

		if (!searchQuery) {
			return true;
		}

		const searchQueryLower = searchQuery.toLowerCase();

		const date = image.date.toLowerCase();
		const time = image.time.toLowerCase();
		const tags = image.tags?.map((tag) => tag.toLowerCase());

		return (
			date.includes(searchQueryLower) ||
			time.includes(searchQueryLower) ||
			tags?.some((tag) => tag.includes(searchQueryLower))
		);
	}

	imagesSort(imageA, imageB) {
		// Sort by date and time

		const dateA = imageA.date;
		const dateB = imageB.date;

		const timeA = imageA.time;
		const timeB = imageB.time;

		if (dateA !== dateB) {
			return dateA > dateB ? -1 : 1;
		}

		if (timeA !== timeB) {
			return timeA > timeB ? -1 : 1;
		}

		return 0;
	}

	render() {
		let { loaded, images, selected } = this.state;

		if (!loaded) {
			images = [{}, {}, {}, {}];
		}

		const imagesMap = images
			?.sort(this.imagesSort.bind(this))
			?.filter(this.imageFilter.bind(this))
			?.map((image, index) => {
				return (
					<Image
						key={index}
						getImages={this.getImages.bind(this)}
						image={image}
						selectImage={this.selectImage.bind(this)}
						selected={selected.includes(image.id)}
					/>
				);
			});

		return (
			<div className='home'>
				<div className='home-controls'>
					<FontAwesomeIcon
						icon={faArrowRotateLeft}
						className='icon'
						onClick={this.getImages.bind(this)}
					/>
					{selected.length > 0 && (
						<>
							<span className='selected-count'>
								{selected.length} selected
							</span>
							<div className='selected-buttons'>
								<FontAwesomeIcon
									icon={faTrashCan}
									className='icon delete-icon'
									onClick={this.deleteSelected.bind(this)}
								/>
							</div>
						</>
					)}
				</div>

				{loaded && !imagesMap.length && (
					<div className='no-images'>No images found</div>
				)}
				<div className='images'>{imagesMap}</div>
			</div>
		);
	}
}

export default Home;
