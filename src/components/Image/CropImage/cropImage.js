import { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import classnames from 'classnames/bind';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';

import getCroppedImg from './getCroppedImg.js';
import Button from '~/components/Button/Button.js';
import styles from './CropImage.module.scss';

const cx = classnames.bind(styles);

const CropImage = ({ src, round = false }, ref) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [aspect, setAspect] = useState(1 / 1);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const cropImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(src, croppedAreaPixels, rotation);
            return croppedImage;
        } catch (error) {
            console.error('An error occurs in CropImage.js', error);
        }
    }, [src, croppedAreaPixels, rotation]);

    const handleChangeRatioImage = (e) => {
        setAspect(e.target.dataset.ratio);
    };

    useImperativeHandle(
        ref,
        () => {
            return {
                async crop() {
                    const image = await cropImage();
                    return image;
                },
            };
        },
        [cropImage],
    );

    return (
        <div className={cx('crop-image-container')}>
            <div className={cx('crop-container')}>
                <Cropper
                    image={src}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    cropShape={round ? 'round' : 'react'}
                />
            </div>
            {!round && (
                <div className={cx('ratio')}>
                    <p className={cx('ratio-label')}>Tỉ lệ</p>
                    <div className={cx('ratio-list')}>
                        <Button className={cx('ratio-item')} onClick={handleChangeRatioImage} data-ratio={1 / 1}>
                            1 : 1
                        </Button>
                        <Button className={cx('ratio-item')} onClick={handleChangeRatioImage} data-ratio={3 / 2}>
                            3 : 2
                        </Button>
                        <Button className={cx('ratio-item')} onClick={handleChangeRatioImage} data-ratio={4 / 3}>
                            4 : 3
                        </Button>
                        <Button className={cx('ratio-item')} onClick={handleChangeRatioImage} data-ratio={16 / 9}>
                            16 : 9
                        </Button>
                    </div>
                </div>
            )}
            <div className={cx('slider-controller')}>
                <div className={cx('slider-container')}>
                    <label className={cx('slider-label')}>Zoom</label>
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        className={cx('slider')}
                        onChange={(e, zoom) => setZoom(zoom)}
                    />
                </div>
                <div className={cx('slider-container')}>
                    <label className={cx('slider-label')}>Rotation</label>
                    <Slider
                        value={rotation}
                        min={0}
                        max={360}
                        step={1}
                        aria-labelledby="Rotation"
                        size="medium"
                        className={cx('slider')}
                        onChange={(e, rotation) => setRotation(rotation)}
                    />
                </div>
            </div>
        </div>
    );
};

export default forwardRef(CropImage);
