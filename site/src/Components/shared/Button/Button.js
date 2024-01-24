import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Button.scss';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Button({
	label,
	onClick,
	className,
	icon,
	danger,
	primary,
	success,
	loading,
	...rest
}) {
	return (
		<button
			className={`button ${
				primary
					? 'button-primary'
					: success
					? 'button-success'
					: danger
					? 'button-danger'
					: 'button-default'
			} ${className}`}
			onClick={onClick}
			{...rest}>
			{loading && <FontAwesomeIcon icon={faSpinner} spin />}
			{icon && <FontAwesomeIcon icon={icon} />}
			<span className='button-label'>{label}</span>
		</button>
	);
}

export default Button;
