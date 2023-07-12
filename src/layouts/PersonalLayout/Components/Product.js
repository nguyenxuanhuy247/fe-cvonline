import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import Pagination from '@mui/material/Pagination';
import { AiOutlineSortAscending, AiOutlineSortDescending, AiFillCloseCircle } from 'react-icons/ai';
import _ from 'lodash';
import { JpgImages } from '~/components/Image/Images.js';

import { Toast } from '~/components/Toast/Toast.js';
import styles from './Product.module.scss';
import ContentEditableTag from '~/layouts/PersonalLayout/Components/ContentEditableTag.js';
import Image from '~/components/Image/Image.js';
import TechnologyList from './TechnologyList.js';
import ChangeImageModal from '~/components/Modal/ChangeImageModal.js';
import Button from '~/components/Button/Button.js';
import EditProduct from '~/layouts/PersonalLayout/Components/EditProduct.js';

const cx = classnames.bind(styles);

class Product extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            FE_isPagination: true,
            FE_Page: 1,
            FE_PageSize: 10,
            FE_sortBy: '',
            FE_isSearch: false,
            FE_searchInputValue: '',

            BE_isPagination: true,
            BE_Page: 1,
            BE_PageSize: 10,
            BE_sortBy: '',
            BE_isSearch: false,
            BE_searchInputValue: '',

            isModalOpen: false,
        };

        this.editProductId = React.createRef();
    }

    // =================================================================
    // CHANGE PRODUCT DESCRIPTION

    handleUpdateProductName = async (e, productId) => {
        const { productInfo } = this.props?.productData ?? {};

        const value = e.target.innerText?.trim();
        const data = { productId: productId, name: value, label: 'Tên sản phẩm' };

        if (value !== productInfo?.name) {
            await this.props?.onUpdateProduct(data);
        }
    };

    handlePressEnterKeyBoard = (e, productInfo) => {
        // Press Enter to blur out product name and focus on product description
        const producDescElement = document.getElementById(`js-product-desc-${productInfo}`);
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();

            if (producDescElement) {
                producDescElement.focus();
            }
        }
    };

    handleUpdateProductDescToDatabase = async (e) => {
        const { productInfo } = this.props?.productData ?? {};
        const value = e.target.innerText;

        if (value !== productInfo?.desc) {
            const data = { productId: productInfo?.id, desc: value, label: 'mô tả sản phẩm' };
            await this.props?.onUpdateProduct(data);
        }
    };

    // ----------------------------------------------------------------

    handleUpdateImageFromChangeImageModal = async (url) => {
        const { productInfo } = this.props?.productData ?? {};
        const { image: imageDB } = productInfo ?? {};

        if (url !== imageDB) {
            // Update product image to Database
            const data = { productId: productInfo?.id, image: url, label: 'Hình ảnh sản phẩm' };
            await this.props?.onUpdateProduct(data);
        } else {
            Toast.TOP_CENTER_WARN(`Ảnh này đã được sử dụng, hãy chọn ảnh khác`, 3000);
        }
    };

    handleCloseChangeImageModal = () => {
        this.setState({ isModalOpen: false });
    };

    // =================================================================
    // PAGINATION

    handleChangePage = (event, value, side) => {
        this.setState({ [`${side === 'FE' ? 'FE_Page' : 'BE_Page'}`]: value });
    };

    handleChangePageSize = (e, side) => {
        const value = e.target.innerText;

        if (value === 'Tất cả') {
            this.setState({ [`${side === 'FE' ? 'FE_isPagination' : 'BE_isPagination'}`]: false });
        } else {
            this.setState({
                [`${side === 'FE' ? 'FE_isPagination' : 'BE_isPagination'}`]: true,
                [`${side === 'FE' ? 'FE_PageSize' : 'BE_PageSize'}`]: +value,
                [`${side === 'FE' ? 'FE_Page' : 'BE_Page'}`]: 1,
            });
        }

        // Remove active class in all buttons before set active for button is clicked
        const parentElement = e.target.parentNode;
        const allDisplayButtons = parentElement?.childNodes;
        allDisplayButtons?.forEach((displayButton) => {
            const isActive = displayButton.classList.contains(cx('active'));
            if (isActive) {
                displayButton.classList.remove(cx('active'));
            }
        });
        e.target.classList.add(cx('active'));
    };

    // =================================================================
    // SORT AND FILTER

    handeSortLibrary = (e, side, sort) => {
        const element = e.currentTarget;
        const isActive = element.classList.contains(cx('active-sort'));

        if (isActive) {
            element.classList.remove(cx('active'));
            this.setState({ [`${side === 'FE' ? 'FE_sortBy' : 'BE_sortBy'}`]: '' });
        } else {
            this.setState({ [`${side === 'FE' ? 'FE_sortBy' : 'BE_sortBy'}`]: sort });
        }
    };

    handleSearchLibrary = async (side) => {
        const { productInfo, FELibraryList, BELibraryList } = this.props?.productData ?? {};

        const isSearch = side === 'FE' ? 'FE_isSearch' : 'BE_isSearch';
        const searchInputValue = side === 'FE' ? 'FE_searchInputValue' : 'BE_searchInputValue';
        const libraryList = side === 'FE' ? FELibraryList : BELibraryList;

        const searchLibraryList = document.getElementById(`js-library-list-${side}-${productInfo?.id}`);
        const resultNotFound = document.getElementById(`js-result-not-found-${side}`);
        const searchInputElement = document.getElementById(`js-search-input-${side}-${productInfo?.id}`);
        const value = searchInputElement?.value?.trim();

        // Check value is not empty
        if (value) {
            await this.setState({ [isSearch]: true, [searchInputValue]: value });

            // Loop through all library button in list
            _.forEach(libraryList, function (library) {
                const libraryName = document.getElementById(`js-name-button-LIBRARY-${library.id}`);

                if (libraryName) {
                    const buttonContainer = libraryName.closest(`#js-container-button-LIBRARY-${library.id}`);

                    if (buttonContainer) {
                        // Clear background-color: yellow of all previous button
                        buttonContainer.style.display = 'block';
                        libraryName.innerHTML = library.name;

                        // Set background-color: yellow for button matches search value input
                        const regex = new RegExp(value, 'gi');
                        const name = libraryName.innerHTML.replace(/(<mark}>|<\/mark>)/gim);
                        const newName = name.replace(regex, `<mark  style={{ backgroundColor: 'yellow'}}>$&</mark>`);

                        // Only set background-color: yellow for result matches search value input
                        if (name !== newName) {
                            libraryName.innerHTML = newName;
                        } else {
                            // Hide library button does not match
                            buttonContainer.style.display = 'none';
                        }
                    }
                }
            });

            // Remove not found text of all buttons
            if (resultNotFound) {
                resultNotFound.remove();
            }

            if (searchLibraryList) {
                const childArray = searchLibraryList.childNodes;

                // Check whether Library List dose not have 'display: none;' or not
                const isEmptyArray = Array.from(childArray).some(
                    (item) => item.getAttribute('style') !== 'display: none;',
                );

                // if library list doesn't have nay 'display: block' button, set Not found Text
                if (!isEmptyArray) {
                    const notFoundElement = document.createElement('p');
                    notFoundElement.className = cx(`search-result-not-found-${side}`);
                    notFoundElement.id = `js-result-not-found-${side}`;
                    notFoundElement.innerText = 'Không tìm thấy kết quả';

                    searchLibraryList.appendChild(notFoundElement);
                }
            }
        } else {
            // If value is empty
            await this.setState({ [isSearch]: false, [searchInputValue]: value });

            // Remove not found text when search input is empty
            if (resultNotFound) {
                resultNotFound.remove();
            }

            // Restore the original state of the button
            _.forEach(libraryList, function (library) {
                const libraryName = document.getElementById(`js-name-button-LIBRARY-${library.id}`);

                if (libraryName) {
                    libraryName.innerHTML = library.name;
                    const closest = libraryName.closest(`#js-container-button-LIBRARY-${library.id}`);

                    if (closest) {
                        closest.style.display = 'block';
                    }
                }
            });
        }
    };

    handleClearSearchValueInput = async (side) => {
        const searchInputValue = side === 'FE' ? 'FE_searchInputValue' : 'BE_searchInputValue';
        await this.setState({ [searchInputValue]: '' });
        this.handleSearchLibrary(side);
    };

    // =================================================================

    async componentDidUpdate(prevProps) {
        const { productInfo, numberofFELibrary, numberofBELibrary } = this.props?.productData ?? {};

        // Turn to last page when add a library
        if (numberofFELibrary > prevProps?.productData?.numberofFELibrary) {
            const FE_FinalPage = Math.ceil(numberofFELibrary / this.state.FE_PageSize);
            this.setState({ FE_Page: FE_FinalPage });
        }

        if (numberofBELibrary > prevProps?.productData?.numberofBELibrary) {
            const BE_FinalPage = Math.ceil(numberofBELibrary / this.state.BE_PageSize);
            this.setState({ BE_Page: BE_FinalPage });
        }
        // Set product desc after updateing from database by JS
        if (productInfo?.desc !== prevProps?.productData?.productInfo?.desc) {
            const productDescElement = document.getElementById(`js-product-desc-${productInfo?.id}`);
            productDescElement.innerText = productInfo?.desc;
        }
    }

    async componentDidMount() {
        const { productInfo } = this.props?.productData ?? {};

        const FE_searchInputElement = document.getElementById(`js-search-input-FE-${productInfo?.id}`);
        const BE_searchInputElement = document.getElementById(`js-search-input-BE-${productInfo?.id}`);

        // Handle event Input search Library
        FE_searchInputElement.oninput = () => this.handleSearchLibrary('FE');
        BE_searchInputElement.oninput = () => this.handleSearchLibrary('BE');

        // Set product desc from database by JS
        const productDescElement = document.getElementById(`js-product-desc-${productInfo?.id}`);
        productDescElement.innerText = productInfo?.desc;

        // Hover product and show Edit Product
        const productContainer = document.getElementById(`js-product-${productInfo?.id}`);
        const editProduct = document.getElementById(`js-edit-product-${productInfo?.id}`);

        if (productContainer && editProduct) {
            productContainer.onmouseover = (e) => {
                e.stopPropagation();
                editProduct.style.display = 'flex';
            };

            productContainer.onmouseleave = (e) => {
                e.stopPropagation();
                this.editProductId.current = setTimeout(() => {
                    editProduct.style.display = 'none';
                }, 200);
            };

            editProduct.onmouseenter = () => {
                clearTimeout(this.editProductId.current);
            };
        }
    }

    componentWillUnmount() {
        clearTimeout(this.editProductId.current);
    }

    render() {
        const {
            order,
            productInfo,
            sourceCodeList,
            FETechnologyList,
            BETechnologyList,
            FELibraryList: FE_AllLibraryList,
            numberofFELibrary,
            BELibraryList: BE_AllLibraryList,
            numberofBELibrary,
        } = this.props?.productData ?? {};

        // =================================================================
        // PAGINATION

        const FETotalPage = Math.ceil(numberofFELibrary / this.state.FE_PageSize);
        const BETotalPage = Math.ceil(numberofBELibrary / this.state.BE_PageSize);

        const FE_paginatedLibraryList = _.chunk(FE_AllLibraryList, this.state.FE_PageSize);
        const FE_paginationLibraryList = FE_paginatedLibraryList[this.state.FE_Page - 1];
        const BE_paginatedLibraryList = _.chunk(BE_AllLibraryList, this.state.BE_PageSize);
        const BE_paginationLibraryList = BE_paginatedLibraryList[this.state.BE_Page - 1];

        const FELibraryListArray = this.state.FE_isPagination ? FE_paginationLibraryList : FE_AllLibraryList;
        const BELibraryListArray = this.state.BE_isPagination ? BE_paginationLibraryList : BE_AllLibraryList;

        // =================================================================
        // SORT LIST

        // Check FE_isSearch and FE_sortBy in order to use FE Library List
        const FE_LibraryList = this.state.FE_isSearch ? FE_AllLibraryList : FELibraryListArray;

        let FE_LibraryList_SortedOrNot;
        if (FE_LibraryList?.length > 0) {
            FE_LibraryList_SortedOrNot = this.state.FE_sortBy
                ? _.orderBy(
                      [...FE_LibraryList],
                      [
                          (value) => {
                              return value.name?.toLowerCase();
                          },
                      ],
                      [this.state.FE_sortBy],
                  )
                : FE_LibraryList;
        }

        // Check BE_isSearch and BE_sortBy in order to use BE Library List
        const BE_LibraryList = this.state.BE_isSearch ? BE_AllLibraryList : BELibraryListArray;

        let BE_LibraryList_SortedOrNot;
        if (BE_LibraryList?.length > 0) {
            BE_LibraryList_SortedOrNot = this.state.BE_sortBy
                ? _.orderBy(
                      [...BE_LibraryList],
                      [
                          (value) => {
                              return value.name?.toLowerCase();
                          },
                      ],
                      [this.state.BE_sortBy],
                  )
                : BE_LibraryList;
        }

        // =================================================================

        return (
            <div className={cx('product-container')} id={`js-product-${productInfo?.id}`}>
                <EditProduct
                    id={`js-edit-product-${productInfo?.id}`}
                    onMoveUpProduct={() => this.props.onMoveUpProduct(order)}
                    onMoveDownProduct={() => this.props.onMoveDownProduct(order)}
                    onCreateProduct={() => this.props.onCreateProduct()}
                    onDeleteProduct={() => this.props.onDeleteProduct(productInfo?.id)}
                />

                <div className={cx('product')}>
                    <div className={cx('product-name-desc-image')} spellCheck="false">
                        <ContentEditableTag
                            content={productInfo?.name}
                            className={cx('product-name')}
                            placeholder="Tên sản phẩm"
                            onBlur={(e) => this.handleUpdateProductName(e, productInfo?.id)}
                            onKeyPress={(e) => this.handlePressEnterKeyBoard(e, productInfo?.id)}
                        />

                        <p
                            id={`js-product-desc-${productInfo?.id}`}
                            contentEditable
                            placeholder="Mô tả sản phẩm"
                            className={cx('product-desc')}
                            spellCheck={false}
                            onBlur={(e) => this.handleUpdateProductDescToDatabase(e)}
                        ></p>

                        <div className={cx('product-image')}>
                            <div
                                className={cx('edit-image-button')}
                                onClick={() => this.setState({ isModalOpen: true })}
                            >
                                Sửa ảnh
                            </div>
                            <Image src={productInfo?.image || JpgImages.productPlaceholder} className={cx('image')} alt="Ảnh sản phẩm" />

                            {this.state.isModalOpen && (
                                <ChangeImageModal
                                    round={false}
                                    src={productInfo?.image}
                                    onClose={() => this.handleCloseChangeImageModal()}
                                    onGetUrl={this.handleUpdateImageFromChangeImageModal}
                                />
                            )}
                        </div>
                    </div>

                    <div className={cx('source-code-section')}>
                        <TechnologyList
                            technologyListID={`js-source-code-list-${productInfo?.id}`}
                            draggable
                            label="source code"
                            type="SOURCECODE"
                            keyprop="SC"
                            productId={productInfo?.id}
                            technologyList={sourceCodeList}
                            // =================================================================
                            // CRUD Source Code
                            onCreateTechnology={this.props.onCreateTechnology}
                            onUpdateTechnology={this.props.onUpdateTechnology}
                            onDeleteTechnology={this.props.onDeleteTechnology}
                        />
                    </div>

                    <div className={cx('technology')}>
                        <div className={cx('server', 'front-end')}>
                            <span className={cx('server-side-title')}>FRONT-END</span>
                            <div className={cx('technology-used')}>
                                <div className={cx('technology-used-title')}>
                                    <span className={cx('title')}>CÔNG NGHỆ SỬ DỤNG</span>
                                </div>
                                <div className={cx('list')}>
                                    <TechnologyList
                                        technologyListID={`js-technology-list-FE-${productInfo?.id}`}
                                        draggable
                                        label="công nghệ FE"
                                        type="TECHNOLOGY"
                                        keyprop="TE"
                                        side="FE"
                                        productId={productInfo?.id}
                                        technologyList={FETechnologyList}
                                        // =================================================================
                                        // CRUD FE Technology List
                                        onCreateTechnology={this.props.onCreateTechnology}
                                        onUpdateTechnology={this.props.onUpdateTechnology}
                                        onDeleteTechnology={this.props.onDeleteTechnology}
                                    />
                                </div>
                            </div>

                            <div className={cx('library-used')}>
                                <div className={cx('library-used-title')}>
                                    <span className={cx('title')}>THƯ VIỆN SỬ DỤNG</span>
                                </div>
                                <div className={cx('library-filter-sort')}>
                                    <div className={cx('library-filter')}>
                                        <input
                                            id={`js-search-input-FE-${productInfo?.id}`}
                                            value={this.state.FE_searchInputValue}
                                            onChange={() => {}}
                                            autoComplete="off"
                                            type="text"
                                            placeholder="Tìm kiếm thư viện"
                                            className={cx('library-filter-search')}
                                            spellCheck="false"
                                        />
                                        <span
                                            className={cx('library-filter-clear', {
                                                show: this.state.FE_searchInputValue,
                                            })}
                                            onClick={() => this.handleClearSearchValueInput('FE')}
                                        >
                                            <AiFillCloseCircle />
                                        </span>
                                    </div>

                                    <div className={cx('library-sort')}>
                                        <span className={cx('label')}>Sắp xếp</span>
                                        <Button
                                            className={cx('sort', {
                                                'active-sort': this.state.FE_sortBy === 'asc',
                                            })}
                                            onClick={(e) => this.handeSortLibrary(e, 'FE', 'asc')}
                                        >
                                            <AiOutlineSortAscending />
                                        </Button>
                                        <Button
                                            className={cx('sort', {
                                                'active-sort': this.state.FE_sortBy === 'desc',
                                            })}
                                            onClick={(e) => this.handeSortLibrary(e, 'FE', 'desc')}
                                        >
                                            <AiOutlineSortDescending />
                                        </Button>
                                    </div>
                                </div>

                                {!this.state.FE_isSearch && (
                                    <div className={cx('display')}>
                                        <span className={cx('label')}>Hiển thị</span>
                                        <div className={cx('select')}>
                                            {['Tất cả', 10, 20, 30, 40, 50].map((button, index) => {
                                                return (
                                                    <Button
                                                        id={`js-display-paginition-FE-${productInfo?.id}`}
                                                        key={index}
                                                        className={cx('button', {
                                                            active: button === this.state.FE_PageSize,
                                                        })}
                                                        onClick={(e) => this.handleChangePageSize(e, 'FE')}
                                                    >
                                                        {button}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <TechnologyList
                                    technologyListID={`js-library-list-FE-${productInfo?.id}`}
                                    draggable
                                    label="thư viện FE"
                                    type="LIBRARY"
                                    keyprop="LI"
                                    side="FE"
                                    productId={productInfo?.id}
                                    technologyList={FE_LibraryList_SortedOrNot}
                                    // =================================================================
                                    // CRUD FE Library List
                                    onCreateTechnology={this.props.onCreateTechnology}
                                    onUpdateTechnology={this.props.onUpdateTechnology}
                                    onDeleteTechnology={this.props.onDeleteTechnology}
                                    // =================================================================
                                    // Search - Sort
                                    isSearch={this.state.FE_isSearch}
                                    isSortBy={this.state.FE_sortBy}
                                    onSearchLibrary={() => this.handleSearchLibrary('FE')}
                                />

                                {!this.state.FE_isSearch && this.state.FE_isPagination && (
                                    <div className={cx('pagination-container')}>
                                        <Pagination
                                            count={FETotalPage}
                                            variant="outlined"
                                            size="medium"
                                            siblingCount={1}
                                            boundaryCount={1}
                                            page={this.state.FE_Page}
                                            sx={{
                                                '& .css-lqq3n7-MuiButtonBase-root-MuiPaginationItem-root': {
                                                    color: 'var(--primary-color)',
                                                    fontSize: '12px',
                                                    borderColor: 'var(--green-color-02)',
                                                },
                                                '& .css-lqq3n7-MuiButtonBase-root-MuiPaginationItem-root:hover': {
                                                    backgroundColor: 'var(--button-bgc-green-02)',
                                                },

                                                '& .css-lqq3n7-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected':
                                                    {
                                                        color: '#fff',
                                                        backgroundColor: 'var(--button-bgc-green-01)',
                                                    },

                                                '& .Mui-selected:hover': {
                                                    backgroundColor: 'var(--button-bgc-green-01) !important',
                                                },
                                            }}
                                            onChange={(e, value) => this.handleChangePage(e, value, 'FE')}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={cx('server', 'back-end')}>
                            <span className={cx('server-side-title')}>BACK-END</span>
                            <div className={cx('technology-used')}>
                                <div className={cx('technology-used-title')}>
                                    <span className={cx('title')}>CÔNG NGHỆ SỬ DỤNG</span>
                                </div>
                                <div className={cx('list')}>
                                    <TechnologyList
                                        technologyListID={`js-technology-list-BE-${productInfo?.id}`}
                                        draggable
                                        label="công nghệ BE"
                                        type="TECHNOLOGY"
                                        keyprop="TE"
                                        side="BE"
                                        productId={productInfo?.id}
                                        technologyList={BETechnologyList}
                                        // =================================================================
                                        // CRUD FE Technology List
                                        onCreateTechnology={this.props.onCreateTechnology}
                                        onUpdateTechnology={this.props.onUpdateTechnology}
                                        onDeleteTechnology={this.props.onDeleteTechnology}
                                    />
                                </div>
                            </div>
                            <div className={cx('library-used')}>
                                <div className={cx('library-used-title')}>
                                    <span className={cx('title')}>THƯ VIỆN SỬ DỤNG</span>
                                </div>

                                <div className={cx('library-filter-sort')}>
                                    <div className={cx('library-filter')}>
                                        <input
                                            id={`js-search-input-BE-${productInfo?.id}`}
                                            defaultValue={this.state.BE_searchInputValue}
                                            onChange={() => {}}
                                            autoComplete="off"
                                            type="text"
                                            placeholder="Tìm kiếm thư viện"
                                            className={cx('library-filter-search')}
                                            spellCheck="false"
                                        />
                                        <span
                                            className={cx('library-filter-clear', {
                                                show: this.state.BE_searchInputValue,
                                            })}
                                            onClick={() => this.handleClearSearchValueInput('BE')}
                                        >
                                            <AiFillCloseCircle />
                                        </span>
                                    </div>

                                    <div className={cx('library-sort')}>
                                        <span className={cx('label')}>Sắp xếp</span>
                                        <Button
                                            className={cx('sort', {
                                                'active-sort': this.state.BE_sortBy === 'asc',
                                            })}
                                            onClick={(e) => this.handeSortLibrary(e, 'BE', 'asc')}
                                        >
                                            <AiOutlineSortAscending />
                                        </Button>
                                        <Button
                                            className={cx('sort', {
                                                'active-sort': this.state.BE_sortBy === 'desc',
                                            })}
                                            onClick={(e) => this.handeSortLibrary(e, 'BE', 'desc')}
                                        >
                                            <AiOutlineSortDescending />
                                        </Button>
                                    </div>
                                </div>

                                {!this.state.BE_isSearch && (
                                    <div className={cx('display')}>
                                        <span className={cx('label')}>Hiển thị</span>
                                        <div className={cx('select')}>
                                            {['Tất cả', 10, 20, 30, 40, 50].map((button, index) => {
                                                return (
                                                    <Button
                                                        id={`js-display-paginition-BE-${productInfo?.id}`}
                                                        key={index}
                                                        className={cx('button', {
                                                            active: button === this.state.BE_PageSize,
                                                        })}
                                                        onClick={(e) => this.handleChangePageSize(e, 'BE')}
                                                    >
                                                        {button}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <TechnologyList
                                    technologyListID={`js-library-list-BE-${productInfo?.id}`}
                                    draggable
                                    label="thư viện BE"
                                    type="LIBRARY"
                                    keyprop="LI"
                                    side="BE"
                                    productId={productInfo?.id}
                                    technologyList={BE_LibraryList_SortedOrNot}
                                    // =================================================================
                                    // CRUD BE Library List
                                    onCreateTechnology={this.props.onCreateTechnology}
                                    onUpdateTechnology={this.props.onUpdateTechnology}
                                    onDeleteTechnology={this.props.onDeleteTechnology}
                                    // =================================================================
                                    // Search - Sort
                                    isSearch={this.state.BE_isSearch}
                                    isSortBy={this.state.BE_sortBy}
                                    onSearchLibrary={() => this.handleSearchLibrary('BE')}
                                />

                                {!this.state.BE_isSearch && this.state.BE_isPagination && (
                                    <div className={cx('pagination-container')}>
                                        <Pagination
                                            count={BETotalPage}
                                            variant="outlined"
                                            size="medium"
                                            siblingCount={1}
                                            boundaryCount={1}
                                            page={this.state.BE_Page}
                                            sx={{
                                                '& .css-lqq3n7-MuiButtonBase-root-MuiPaginationItem-root': {
                                                    color: 'var(--primary-color)',
                                                    fontSize: '12px',
                                                    borderColor: 'var(--green-color-02)',
                                                },
                                                '& .css-lqq3n7-MuiButtonBase-root-MuiPaginationItem-root:hover': {
                                                    backgroundColor: 'var(--button-bgc-green-02)',
                                                },

                                                '& .css-lqq3n7-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected':
                                                    {
                                                        color: '#fff',
                                                        backgroundColor: 'var(--button-bgc-green-01)',
                                                    },

                                                '& .Mui-selected:hover': {
                                                    backgroundColor: 'var(--button-bgc-green-01) !important',
                                                },
                                            }}
                                            onChange={(e, value) => this.handleChangePage(e, value, 'BE')}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Product;
