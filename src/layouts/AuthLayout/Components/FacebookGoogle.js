import { Component } from 'react';
import classnames from 'classnames/bind';
import { FaFacebook } from 'react-icons/fa';
import { BsGoogle } from 'react-icons/bs';

import styles from './FacebookGoogle.module.scss';

const cx = classnames.bind(styles);

class FacebookGoogle extends Component {
    render() {
        return (
            <div className={cx('social-network')}>
                <a href="#!" className={cx('facebook')}>
                    <FaFacebook className={cx('icon', 'facebook-icon')} />
                    <span className={cx('text')}>Facebook</span>
                </a>
                <a href="#!" className={cx('google')}>
                    <BsGoogle className={cx('icon', 'google-icon')} />
                    <span className={cx('text')}>Google</span>
                </a>
            </div>
        );
    }
}

export default FacebookGoogle;
