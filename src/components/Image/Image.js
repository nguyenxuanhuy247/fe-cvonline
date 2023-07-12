import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';

import styles from './Image.module.scss';
import { JpgImages } from '~/components/Image/Images.js';

const cx = classnames.bind(styles);
class Image extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            url: '',
        };

        this.btnRef = React.createRef();
    }

    handleOpenModal = (e) => {
        e.stopPropagation();
        this.setState({ isOpen: true });
    };

    handleCloseModal = () => {
        this.setState({ isOpen: false });
    };

    getImageUrlFromModal(url) {
        this.setState({ url: url, isOpen: false });
    }

    componentWillUnmount() {
        URL.revokeObjectURL(this.state.url);
    }

    render() {
        const { forwardRef, className, round, width, height, alt, style } = this.props;

        const classes = cx('image', {
            [className]: className,
            round,
        });

        return (
            <img
                className={classes}
                style={style}
                src={this.state.url || this.props.src || JpgImages.imagePlaceholder}
                width={width || '40px'}
                height={height || '40px'}
                alt={alt}
                ref={forwardRef}
            />
        );
    }
}

export default React.forwardRef((props, ref) => <Image {...props} forwardRef={ref} />);
