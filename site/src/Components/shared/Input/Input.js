import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Input.scss';

class Input extends Component {
	constructor() {
		super();

		this.state = {};
	}

	handleChange(event) {
		const { onChange } = this.props;

		if (onChange) {
			onChange(event.target.value || '');
		}
	}

	render() {
		const { onChange, error, label, required, className, icon, ...rest } =
			this.props;

		return (
			<>
				<div
					className={`input-container ${
						error && 'input-container-error'
					} ${className}`}>
					{label && (
						<label className='input-label'>
							{label}
							{required && (
								<span className='input-required'> *</span>
							)}
						</label>
					)}
					<div className='input-content'>
						{icon && (
							<FontAwesomeIcon
								className='input-icon'
								icon={icon}
							/>
						)}
						<input
							className={`input ${error && 'input-error'}`}
							onChange={this.handleChange.bind(this)}
							{...rest}
						/>
					</div>
				</div>
				<span className='input-error-message'>{error}</span>
			</>
		);
	}
}

export default Input;
