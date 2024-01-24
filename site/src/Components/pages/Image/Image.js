import { Component } from 'react';
import './Image.scss';
import { useParams } from 'react-router-dom';
import aws from 'modules/web/aws';
import Button from 'Components/shared/Button';

class Image extends Component {
	constructor() {
		super();

		this.state = {};
	}

	async getImage() {
		const { id } = this.props;

		const image = await aws.getImage(id);
		this.setState({
			image,
			loaded: true,
		});
	}

	async componentDidMount() {
		await this.getImage();
	}

	async deleteImage() {
		const { id } = this.props;

		await aws.deleteImage(id);

		window.location = '/';
	}

	render() {
		const { image, loaded } = this.state;

		return (
			loaded && (
				<div className='image-view-container'>
					<img className='image' src={image.data} />
					<div className='image-details'></div>
					<div className='image-options'>
						<Button
							className='image-option'
							label='Delete'
							danger
							onClick={this.deleteImage.bind(this)}
						/>
						<Button className='image-option' label='Edit' primary />
					</div>
				</div>
			)
		);
	}
}

function ImageWrapper() {
	const { id } = useParams();

	return <Image id={id} />;
}

export default ImageWrapper;
