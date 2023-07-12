import React, { PureComponent } from 'react';
import className from 'classnames/bind';
import { RiDragMove2Fill } from 'react-icons/ri';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { AiOutlineDelete } from 'react-icons/ai';
import { TfiPencil } from 'react-icons/tfi';
import DefaultTippy from '@tippyjs/react';

import styles from './EditButton.module.scss';
import Button from './Button';

const cx = className.bind(styles);

class EditButton extends PureComponent {
    handleMouseDownDragButton = (editButtonID) => {
        const editItem = document.getElementById(editButtonID);

        // Only show drag button and hide the others button
        if (editItem) {
            Array.from(editItem.children).forEach((button) => {
                if (button.getAttribute('drag') === 'true') {
                    button.style.display = 'none';
                }
            });
        }
    };

    handleMouseUpDragButton = async (editButtonID) => {
        const editItem = document.getElementById(editButtonID);

        // Show all drag buttons
        if (editItem) {
            Array.from(editItem?.children).forEach((button) => {
                if (button.getAttribute('drag') === 'true') {
                    button.style.display = 'inline-flex';
                }
            });
        }
    };

    render() {
        const { editButtonID, onShowCreateTechnology, onShowEditTechnology, onDeleteTechnology } = this.props;

        return (
            <div
                id={editButtonID}
                className={cx('wrapper')}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={() => this.props.onMouseLeave(cx('hide'))}
            >
                <DefaultTippy content="Kéo thả để di chuyển mục">
                    <Button
                        id={editButtonID}
                        draggable
                        className={cx('btn', 'drag')}
                        onMouseDown={() => this.handleMouseDownDragButton(editButtonID)}
                        onMouseUp={() => this.handleMouseUpDragButton(editButtonID)}
                        {...this.props.dragDropAPIProps}
                    >
                        <RiDragMove2Fill />
                    </Button>
                </DefaultTippy>

                <DefaultTippy content="Thêm mục mới">
                    <Button className={cx('btn', 'add')} onClick={onShowCreateTechnology} drag="true">
                        <IoIosAddCircleOutline />
                    </Button>
                </DefaultTippy>

                <DefaultTippy content="Sửa mục này">
                    <Button className={cx('btn', 'edit')} onClick={onShowEditTechnology} drag="true">
                        <TfiPencil />
                    </Button>
                </DefaultTippy>

                <DefaultTippy content="Xóa mục này">
                    <Button className={cx('btn', 'delete')} onClick={onDeleteTechnology} drag="true">
                        <AiOutlineDelete />
                    </Button>
                </DefaultTippy>
            </div>
        );
    }
}

export default EditButton;
