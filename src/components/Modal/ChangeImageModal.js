import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import { toast } from 'react-toastify';

import styles from './ChangeImageModal.module.scss';
import Button from '~/components/Button/Button.js';
import Image from '~/components/Image/Image.js';
import CommonUtils from '~/utils/CommonUtils.js';
import Modal from '~/components/Modal/Modal.js';
import CropImage from '~/components/Image/CropImage/CropImage.js';
import { JpgImages } from '~/components/Image/Images.js';

const cx = classnames.bind(styles);

class ChangeImageModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            image: this.props.src || '',
            isOpenCropImageModal: false,
        };
        this.ref = React.createRef();
    }

    handleUploadImage = async () => {
        const inputEl = document.getElementById('upload');
        const file = await inputEl.files[0];

        if (file) {
            if (file.size / (1024 * 1024) <= 5) {
                const urlBase64 = await CommonUtils.getBase64(file);
                await this.setState({ image: urlBase64 });
            } else {
                toast.error(`Kích thước ảnh lớn hơn 5MB. Vui lòng chọn ảnh khác`);
            }
        } else {
            toast.error(`Tải ảnh thất bại`);
        }
    };

    handleDeleteImage = () => {
        this.setState({ image: '' });
    };

    handleFinishChangeImage = () => {
        const { onGetUrl, onClose } = this.props;

        onGetUrl(this.state.image);
        onClose();
    };

    handleOpenCropModal = () => {
        this.setState({ isOpenCropImageModal: true });
    };

    handleCloseCropImageModal = () => {
        this.setState({ isOpenCropImageModal: false });
    };

    handleFinishDropImage = async () => {
        const image = await this.ref.current.crop();
        this.setState({ isOpenCropImageModal: false, image: image });
    };

    render() {
        const { onClose, round } = this.props;
        const { isOpenCropImageModal } = this.state;

        return !isOpenCropImageModal ? (
            <Modal
                round={round}
                title="Thay đổi hình ảnh"
                onClose={() => onClose()}
                onFinish={() => this.handleFinishChangeImage()}
            >
                <label
                    className={cx('image-display')}
                    style={{
                        borderRadius: round ? '999px' : '0',
                        aspectRatio: round ? 1 : 'auto',
                    }}
                    onChange={this.handleUploadImage}
                    htmlFor="upload"
                >
                    <Image
                        src={this.state.image || (!round && JpgImages.productPlaceholder)}
                        style={{
                            borderRadius: round ? '999px' : '0',
                            aspectRatio: round ? 1 : 'auto',
                        }}
                        className={cx('image')}
                        alt="Product Image"
                    />
                </label>
                <div className={cx('actions')}>
                    <label className={cx('btn', 'change')} onChange={this.handleUploadImage} htmlFor="upload">
                        Tải ảnh
                        <input id="upload" type="file" hidden readOnly />
                    </label>
                    <Button
                        className={cx('btn', 'crop')}
                        onClick={this.handleOpenCropModal}
                        disabled={this.state.image ? false : true}
                    >
                        <span className={cx('text')}>Cắt</span>
                    </Button>
                    <Button className={cx('btn', 'delete')} onClick={this.handleDeleteImage}>
                        <span className={cx('text')}>Xóa</span>
                    </Button>
                </div>
            </Modal>
        ) : (
            <Modal
                round={round}
                title="Thay đổi hình ảnh"
                onClose={this.handleCloseCropImageModal}
                onFinish={this.handleFinishDropImage}
            >
                <CropImage round={round} src={this.state.image} ref={this.ref} />
            </Modal>
        );
    }
}

export default ChangeImageModal;
