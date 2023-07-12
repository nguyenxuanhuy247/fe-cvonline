import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import { HiArrowUp } from 'react-icons/hi';
import { AiOutlineDelete } from 'react-icons/ai';
import { HiArrowDown } from 'react-icons/hi';
import { AiOutlinePlus } from 'react-icons/ai';
import DefaultTippy from '@tippyjs/react';

import styles from './EditProduct.module.scss';
import Button from '~/components/Button/Button.js';

const cx = classnames.bind(styles);

class EditProduct extends PureComponent {
    render() {
        return (
            <div className={cx('wrapper')} id={this.props.id}>
                <DefaultTippy content="Di chuyển dự án này lên trên">
                    <Button className={cx('btn', 'move')} onClick={this.props.onMoveUpProduct}>
                        <HiArrowUp />
                    </Button>
                </DefaultTippy>

                <DefaultTippy content="Di chuyển dự án này xuống dưới">
                    <Button className={cx('btn', 'move')} onClick={this.props.onMoveDownProduct}>
                        <HiArrowDown />
                    </Button>
                </DefaultTippy>

                <DefaultTippy content="Thêm dự án mới">
                    <Button className={cx('btn', 'add')} onClick={this.props.onCreateProduct}>
                        <AiOutlinePlus />
                    </Button>
                </DefaultTippy>

                <DefaultTippy content="Xóa dự án này">
                    <Button className={cx('btn', 'delete')} onClick={this.props.onDeleteProduct}>
                        <AiOutlineDelete />
                    </Button>
                </DefaultTippy>
            </div>
        );
    }
}

export default EditProduct;
