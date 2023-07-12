import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';

import styles from './CreateEditTechnology.module.scss';
import Button from '~/components/Button/Button.js';
import Image from '~/components/Image/Image.js';
import ChangeImageModal from '~/components/Modal/ChangeImageModal.js';
import { Toast } from '~/components/Toast/Toast.js';

const cx = classnames.bind(styles);
class CreateEditTechnology extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props?.data?.id || undefined,
            image: this.props?.data?.image || '',
            name: this.props?.data?.name || '',
            version: this.props?.data?.version || '',
            link: this.props?.data?.link || '',
        };
    }

    handleOpenChangeImageModal = () => {
        this.setState({ isModalOpen: true });
    };

    handleGetImageUrlFromChangeImageModal = (url) => {
        this.setState({ image: url });
    };

    handleCloseChangeImageModal = () => {
        this.setState({ isModalOpen: false });
    };

    handleInputTechnology = (e, name) => {
        const value = e.target.value;
        this.setState({ [name]: value });
    };

    handleCreateOrUpdateTechnology = async (isEdit) => {
        const data = {
            id: this.state.id,
            type: this.props?.type,
            key: this.props?.keyprop,
            side: this.props?.side,
            image: this.state.image,
            name: this.state.name?.trim(),
            version: this.state.version?.trim(),
            link: this.state.link,
            productId: this.props?.productId,
            label: this.props?.label,
        };

        if (isEdit) {
            const errorCode = await this.props?.onUpdateTechnology(data);
            if (errorCode === 0) {
                this.props.onCloseCreateTechnology();
            }
        } else {
            if (this.props?.type === 'SOURCECODE') {
                if (this.state.name && this.state.link) {
                    const errorCode = await this.props.onCreateTechnology(data);
                    if (errorCode === 0) {
                        this.props.onCloseCreateTechnology();

                        if (this.props?.isSearch) {
                            this.props?.onSearchLibrary();
                        }
                    }
                } else if (!this.state.name) {
                    Toast.TOP_CENTER_INFO(`Vui lòng nhập tên của ${this.props.label}`, 3000);
                } else if (!this.state.link) {
                    Toast.TOP_CENTER_INFO(`Vui lòng nhập link của ${this.props.label}`, 3000);
                }
            } else {
                if (this.state.name) {
                    const errorCode = await this.props.onCreateTechnology(data);
                    if (errorCode === 0) {
                        this.props.onCloseCreateTechnology();

                        if (this.props?.isSearch) {
                            this.props?.onSearchLibrary();
                        }
                    }
                } else {
                    Toast.TOP_CENTER_INFO(`Vui lòng nhập tên của ${this.props.label}`, 3000);
                }
            }
        }
    };

    componentDidMount() {
        // Press ENTER to change input field or submit
        const container = document.getElementById(this.props.id);

        const inputElementArray = container.getElementsByTagName('input');
        Array.from(inputElementArray)?.forEach((inputElement) => {
            inputElement.onkeydown = (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    let nextEl = event.target.nextElementSibling;

                    if (nextEl) {
                        while (nextEl.hidden) {
                            nextEl = nextEl.nextElementSibling;
                        }

                        if (nextEl.nodeName === 'INPUT') {
                            nextEl.focus();
                        }
                    } else {
                        this.handleCreateOrUpdateTechnology(this.props?.isedit);
                    }
                }
            };
        });
    }

    render() {
        const { id, isedit, type, label } = this.props;

        return (
            <div
                className={cx('create-edit-technology', {
                    'create-source-code': !isedit && type === 'SOURCECODE',
                    'edit-technology': isedit,
                })}
                id={id}
            >
                <div className={cx('info')}>
                    <p className={cx('heading')}>
                        {isedit
                            ? `Chỉnh sửa ${type === 'SOURCECODE' ? '' : label}`
                            : `Thêm ${type === 'SOURCECODE' ? '' : label} mới`}
                    </p>
                    <div className={cx('image-wrapper')}>
                        <HeadlessTippy
                            zIndex="10"
                            placement="bottom"
                            interactive
                            delay={[0, 300]}
                            offset={[0, -50]}
                            render={(attrs) => (
                                <div tabIndex="-1" {...attrs}>
                                    <Button
                                        className={cx('add-edit-image-button')}
                                        onClick={() => this.handleOpenChangeImageModal()}
                                    >
                                        {`${isedit ? `Sửa ảnh` : `Thêm ảnh`}`}
                                    </Button>
                                </div>
                            )}
                        >
                            <Image className={cx('image')} src={this.state.image} round />
                        </HeadlessTippy>
                        {this.state.isModalOpen && (
                            <ChangeImageModal
                                round
                                src={this.state.image}
                                onClose={this.handleCloseChangeImageModal}
                                onGetUrl={this.handleGetImageUrlFromChangeImageModal}
                            />
                        )}
                    </div>
                    <input
                        id={`js-autofocus-input-${this.props.type}`}
                        type="text"
                        spellCheck="false"
                        className={cx('input-form')}
                        placeholder={`Nhập tên ${label}`}
                        value={this.state.name}
                        onChange={(e) => this.handleInputTechnology(e, 'name')}
                    />
                    <input
                        hidden={type !== 'LIBRARY'}
                        type="text"
                        spellCheck="false"
                        className={cx('input-form')}
                        placeholder="Nhập version"
                        value={this.state.version}
                        onChange={(e) => this.handleInputTechnology(e, 'version')}
                    />
                    <input
                        type="text"
                        spellCheck="false"
                        className={cx('input-form')}
                        placeholder="Nhập link website"
                        value={this.state.link}
                        onChange={(e) => this.handleInputTechnology(e, 'link')}
                    />
                </div>
                <div className={cx('actions')}>
                    <Button
                        className={cx('btn', 'cancel', { 'source-code-edit-btn': isedit })}
                        onClick={this.props.onCloseCreateTechnology}
                    >
                        Hủy
                    </Button>
                    <Button
                        className={cx('btn', 'add', { 'source-code-edit-btn': isedit })}
                        onClick={() => this.handleCreateOrUpdateTechnology(isedit)}
                    >{`${isedit ? `Cập nhật` : `Thêm`}`}</Button>
                </div>
            </div>
        );
    }
}

export default CreateEditTechnology;
