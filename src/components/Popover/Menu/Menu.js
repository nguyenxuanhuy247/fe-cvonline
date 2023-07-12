import React, { Component } from 'react';
import className from 'classnames/bind';
import { connect } from 'react-redux';
import TippyHeadless from '@tippyjs/react/headless';
import { BiArrowBack } from 'react-icons/bi';

import * as userActions from '~/store/actions/userActions.js';
import styles from './Menu.module.scss';
import Button from '~/components/Button/Button';
import { Toast } from '~/components/Toast/Toast.js';

const cx = className.bind(styles);

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuList: this.props.data,
            isHeaderShow: false,
            subMenuHeaderTitle: '',
        };
    }

    static defaultProps = {
        data: [],
    };

    handleShowMenuContent = (attrs) => (
        <div tabIndex="-1" {...attrs}>
            <div className={cx('menu-container')}>
                {this.state.isHeaderShow && (
                    <div className={cx('submenu-header')}>
                        <Button
                            className={cx('back-button')}
                            onClick={() =>
                                this.setState({
                                    menuList: this.props.data,
                                    isHeaderShow: false,
                                })
                            }
                        >
                            <span className={cx('arrow-left')}>
                                <BiArrowBack />
                            </span>
                        </Button>
                        <span className={cx('text')}>{this.state.subMenuHeaderTitle}</span>
                    </div>
                )}

                <div className={cx('container')}>
                    {this.state.menuList.length > 0 &&
                        this.state.menuList.map((item) => {
                            const isChildren = !!item.children;

                            return (
                                <Button
                                    key={item.id}
                                    className={cx('button', {
                                        separate: item.separate,
                                    })}
                                    onClick={async () => {
                                        if (isChildren) {
                                            const { title, data } = item.children;
                                            this.setState({
                                                menuList: data,
                                                isHeaderShow: true,
                                                subMenuHeaderTitle: title,
                                            });
                                        }

                                        if (item.title === 'Đăng xuất') {
                                            await this.props.userSignOut();
                                            Toast.TOP_CENTER_SUCCESS('Bạn vừa đăng xuất khỏi trang CV');
                                        }
                                    }}
                                >
                                    <i className={cx('left-icon')}>{item.leftIcon}</i>
                                    <span className={cx('text')}>{item.title}</span>
                                    <i className={cx('arrow-right')}>{item.rightIcon}</i>
                                </Button>
                            );
                        })}
                </div>
            </div>
        </div>
    );

    render() {
        return (
            <TippyHeadless
                interactive
                hideOnClick
                trigger="click"
                placement="bottom-end"
                render={() => this.handleShowMenuContent()}
            >
                {this.props.children}
            </TippyHeadless>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isSignIn: state.user.isSignIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        userSignOut: () => dispatch(userActions.userSignOut()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
