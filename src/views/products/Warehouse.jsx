import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Pagination,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
  FormHelperText,
  DialogContentText
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBrands, getAllCategories, getAllSizes, getProductOfBrand, getProductOfCate } from 'api/getAllData';
import { createCate, createNewBrand, createSize } from 'api/createNew';
import MainCard from 'ui-component/cards/MainCard';
import { uploadToCloundinary } from 'functions/processingFunction';
import { deleteBrand, deleteCate, updateCate, updateLogoBrand } from 'api/updateData';
import { fetchProducts } from 'redux/thunks/productsThunk';
import { addProduct, getProducts, stopSellingPd, updateProduct } from 'api/products';
import { Box } from '@mui/system';

const InventoryManagement = () => {
  //COMMON
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  //CATEGORIES
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCateDes, setNewCateDes] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [categories, setCategories] = useState([]);
  const [openCateEditDialog, setopenCateEditDialog] = useState(false);
  const [openCateDetailDialog, setopenCateDetailDialog] = useState(false);
  const [selectedCatesName, setSelectedCatesName] = useState(null);
  const [selectedCateId, setSelectedsCateId] = useState(null);
  const [selectedCateImg, setSelectedsCateImg] = useState(null);
  const [catenamefordetail, setCatenamefordetail] = useState('');
  const [newCatelogo, setNewCatelogo] = useState('');
  const [newCateName, setnewCateName] = useState('');
  const [newCateDescription, setnewCateDescription] = useState('');
  const [productOfCate, setproductOfCate] = useState([]);
  const [selectIdForDetailCate, setselectIdForDetailCate] = useState('');
  const [filterCate, setfilterCate] = useState('all');
  const [currentPageCate, setCurrentPageCate] = useState(1);
  const itemsPerPageCate = 5;
  // Lọc danh sách danh mục
  const listCateFilter = categories.filter((cate) => {
    return filterCate === 'all' || filterCate === cate._id;
  });
  // Phân trang dựa trên danh sách đã lọc
  const paginateCate = listCateFilter.slice((currentPageCate - 1) * itemsPerPageCate, currentPageCate * itemsPerPageCate);
  const handlePageCateChange = (_, value) => {
    setCurrentPageCate(value);
  };

  //BRANDS
  const [newBrand, setNewBrand] = useState('');
  const [newBrandImg, setNewBrandImg] = useState('');
  const [openBrandDialog, setOpenBrandDialog] = useState(false);
  const [openBrandDetailDialog, setopenBrandDetailDialog] = useState(false);
  const [productOfBrands, setProductOfBrands] = useState([]);
  const [selectedBrandsName, setSelectedBrandsName] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [currBrandLogo, setCurrBrandLogo] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('');
  const [openEditBrandDialog, setopenEditBrandDialog] = useState(false);
  const [brands, setBrands] = useState([]);
  const [filterBrand, setFilterBrand] = useState('all');
  const [currentBrandPage, setcurrentBrandPage] = useState(1);
  const itemsPerPagebrand = 5;
  // Lọc danh sách thương hiệu theo filterBrand
  const listBrandFilter = Array.isArray(brands)
    ? brands.filter((brand) => {
        return filterBrand === 'all' || filterBrand === brand._id;
      })
    : [];
  // Phân trang dựa trên danh sách đã lọc
  const paginatedBrands = listBrandFilter.slice((currentBrandPage - 1) * itemsPerPagebrand, currentBrandPage * itemsPerPagebrand);
  // Xử lý khi người dùng thay đổi trang
  const handlePageBrandChange = (_, value) => {
    setcurrentBrandPage(value);
  };

  //SIZES
  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState('');
  const [openSizeDialog, setOpenSizeDialog] = useState(false);
  const [filterSize, setFilterSize] = useState('all');
  const [currentSizePage, setcurrentSizePage] = useState(1);
  const itemsPerPageSize = 5;
  // Lọc danh sách thương hiệu theo filtercurrentSize
  const listSizeFilter = Array.isArray(sizes)
    ? sizes.filter((size) => {
        return filterSize === 'all' || filterSize === size._id;
      })
    : [];
  // Phân trang dựa trên danh sách đã lọc
  const paginatedSizes = listSizeFilter.slice((currentSizePage - 1) * itemsPerPageSize, currentSizePage * itemsPerPageSize);
  // Xử lý khi người dùng thay đổi trang
  const handlePageSizeChange = (_, value) => {
    setcurrentSizePage(value);
  };

  const handleImageChange = async (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const secureUrl = await uploadToCloundinary(file);
      // console.log('secureUrl', secureUrl);
      if (secureUrl) {
        if (type == 'category') {
          setNewCategoryImage(secureUrl);
        } else if (type == 'brand') {
          setNewBrandImg(secureUrl);
        } else if (type == 'newBrandLogo') {
          setNewBrandLogo(secureUrl);
        } else if (type == 'newCateLogo') {
          setNewCatelogo(secureUrl);
        }
      }
    }
  };

  //CALL API
  const [loading, setloading] = useState(false);
  useEffect(() => {
    const fetchProductData = async () => {
      setloading(true);
      try {
        const [sizes, brands, categories] = await Promise.all([getAllSizes(), getAllBrands(), getAllCategories()]);

        if (sizes) {
          const freeSize = sizes.filter((size) => size.name === 'Free size');
          const otherSizes = sizes.filter((size) => size.name !== 'Free size');
          const sortedSizes = otherSizes.sort((a, b) => {
            return parseInt(a.name) - parseInt(b.name);
          });
          const sortedListSizes = [...freeSize, ...sortedSizes];
          setSizes(sortedListSizes);
        }
        if (brands) {
          setBrands(brands.reverse());
        }
        if (categories) setCategories(categories.reverse());
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setloading(false);
      }
    };
    fetchProductData();
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      const response = await getProductOfBrand(selectedBrandId);
      console.log('Response:', response);
      if (!response || !response.data) {
        // setSnackbarMessage('Lấy dữ liệu thất bại!');
        // setOpenSnackbar(true);
        return;
      }
      setProductOfBrands(response.data);
    };

    fetchdata();
  }, [selectedBrandId]);

  //FUN CATE
  const handleOpenCategoryDialog = () => {
    setOpenCategoryDialog(true);
  };

  const handleCloseCateDetailDialog = () => {
    setopenCateDetailDialog(false);
  };

  const handleOpenCategoryDetailDialog = async (id, name) => {
    setselectIdForDetailCate(id);
    // console.log('selectIdForDetailCate', selectIdForDetailCate, '--', id);
    setCatenamefordetail(name);
    try {
      if (!productOfCate) {
        // setSnackbarMessage('Xảy ra lỗi khi lấy sản phẩm theo brands!');
        // setOpenSnackbar(true);
        return;
      }
    } catch (error) {
      // setSnackbarMessage('Xảy ra lỗi khi lấy sản phẩm theo brands!');
      // setOpenSnackbar(true);
      console.log('error==>', error);
    } finally {
      setopenCateDetailDialog(true);
    }
  };

  useEffect(() => {
    const fetchdataDetailCate = async () => {
      const response = await getProductOfCate(selectIdForDetailCate);
      console.log('Response:', response);
      if (!response || !response.data) {
        // setSnackbarMessage('Lấy dữ sản phẩm của danh mục thất bại!');
        // setOpenSnackbar(true);
        return;
      }
      setproductOfCate(response.data);
    };

    fetchdataDetailCate();
  }, [selectIdForDetailCate]);

  const handleOpenEditCateDialog = async (id, name, img, description) => {
    setSelectedsCateId(id);
    setSelectedCatesName(name);
    setnewCateName(name);
    setSelectedsCateImg(img);
    setnewCateDescription(description);
    setopenCateEditDialog(true);
  };
  const handleCloseEditCateDialog = async () => {
    setopenCateEditDialog(false);
  };

  const handleEditCate = async () => {
    try {
      const newErrors = {};

      if (!newCateName) {
        newErrors.newCategory = 'Tên danh mục không được để trống!';
        setSnackbarMessage('Vui lòng nhập tên');
        setOpenSnackbar(true);
        return;
      }

      if (Object.keys(newErrors).length > 0) {
        setCateErrors(newErrors);
        return;
      }

      const response = await updateCate(selectedCateId, newCateName, newCatelogo, newCateDescription);
      console.log('response new cate: ', response);

      if (response.status) {
        setCategories((prevCategories) =>
          prevCategories.map((category) => (category._id === selectedCateId ? { ...category, ...response.data } : category))
        );
        setSnackbarMessage('Chỉnh sửa danh mục thành công');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage('Chỉnh sửa danh mục xảy ra lỗi');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Đã xảy ra lỗi khi chỉnh sửa danh mục, thử lại sau');
      setOpenSnackbar(true);
    } finally {
      setNewCatelogo('');
      handleCloseEditCateDialog();
      setOpenSnackbar(true);
    }
  };

  //FUN BRANDS
  const handleOpenBrandDialog = () => {
    setOpenBrandDialog(true);
  };
  const handleCloseBrandDialog = () => {
    setOpenBrandDialog(false);
    setNewBrand('');
    setNewBrandImg('');
  };
  const handleOpenBrandDetailDialog = async (id, name) => {
    setSelectedBrandId(id);
    setSelectedBrandsName(name);
    try {
      if (!productOfBrands) {
        // setSnackbarMessage('Xảy ra lỗi khi lấy sản phẩm theo brands!');
        // setOpenSnackbar(true);
        return;
      }
    } catch (error) {
      // setSnackbarMessage('Xảy ra lỗi khi lấy sản phẩm theo brands!');
      // setOpenSnackbar(true);
      console.log('Lỗi lấy dữ liệu:', error);
    } finally {
      setopenBrandDetailDialog(true);
    }
  };
  const handleCloseBrandDetailDialog = () => {
    setopenBrandDetailDialog(false);
  };
  const handleCloseEditBrandDialog = () => {
    setopenEditBrandDialog(false);
    setNewBrandLogo('');
  };
  const handleOpenEditDialog = (id, name, img) => {
    setSelectedBrandId(id);
    setCurrBrandLogo(img);
    setSelectedBrandsName(name);
    setopenEditBrandDialog(true);
  };
  const handleEditBrand = async () => {
    if (!newBrandLogo) {
      setSnackbarMessage('Vui lòng chọn ảnh!');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await updateLogoBrand(selectedBrandId, newBrandLogo);
      console.log('response new logo brands: ', response);

      if (response.status) {
        setNewBrandLogo('');
        // Set brands
        setBrands((prev) => prev.map((brand) => (brand._id === selectedBrandId ? { ...brand, image: response.data.image } : brand)));
        setSnackbarMessage('Chỉnh sửa logo thành công');
      } else {
        setSnackbarMessage('Chỉnh sửa logo xảy ra lỗi');
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Đã xảy ra lỗi khi cập nhật logo thương hiệu.');
    } finally {
      handleCloseEditBrandDialog();
      setOpenSnackbar(true);
    }
  };

  //FUN SIZES
  const handleOpenSizeDialog = () => {
    setOpenSizeDialog(true);
  };
  const handleCloseSizeDialog = () => {
    setOpenSizeDialog(false);
    setNewSize('');
  };

  //CREATE NEW
  const [cateErrors, setCateErrors] = useState({});
  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
    setNewCategory('');
    setNewCateDes('');
    setNewCategoryImage('');
    setCateErrors('');
  };

  const handleAddNewCategory = async () => {
    const newErrors = {};

    if (!newCategory.trim()) {
      newErrors.newCategory = 'Tên danh mục không được để trống!';
    }
    if (!newCategoryImage) {
      newErrors.newCategoryImage = 'Vui lòng chọn ảnh!';
    }

    if (Object.keys(newErrors).length > 0) {
      setCateErrors(newErrors);
      return;
    }

    if (!newCategory || !newCategoryImage) {
      setSnackbarMessage(!newCategory ? 'Nhập tên danh mục' : 'Chọn ảnh danh mục');
      setOpenSnackbar(true);
      return;
    }

    if (newCategory && categories.includes(newCategory)) {
      setSnackbarMessage('Danh mục đã tồn tại');
      setOpenSnackbar(true);
      return;
    }

    try {
      const body = {
        name: newCategory,
        image: newCategoryImage,
        description: newCateDes
      };

      if (!body.name || !body.image) {
        setSnackbarMessage('Dữ liệu không đầy đủ, vui lòng kiểm tra lại');
        setOpenSnackbar(true);
        return;
      }

      const response = await createCate(body);

      if (response) {
        setCategories([response.data, ...categories]);
        setSnackbarMessage('Thêm danh mục thành công');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage('Thêm danh mục thất bại, thử lại sau');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Đã xảy ra lỗi, thử lại sau');
      setOpenSnackbar(true);
    } finally {
      setNewCategory('');
      setNewCateDes('');
      setNewCategoryImage('');
      handleCloseCategoryDialog();
      setOpenSnackbar(true);
    }
  };
  const handleAddNewBrand = async () => {
    if (!newBrand || !newBrandImg) {
      setSnackbarMessage(!newBrand ? 'Nhập tên thương hiệu' : 'Chọn ảnh thương hiệu');
      setOpenSnackbar(true);
      return;
    }

    try {
      const body = {
        name: newBrand,
        image: newBrandImg
      };

      if (!body) {
        setSnackbarMessage('Không được để trống form');
        setOpenSnackbar(true);
        return;
      }

      // console.log('Brand body: ', body);

      if (newBrand && !brands.includes(newBrand)) {
        const response = await createNewBrand(body);
        if (response) {
          setBrands([{ name: newBrand, image: newBrandImg }, ...brands]);
          setSnackbarMessage('Thêm thương hiệu thành công');
          setOpenSnackbar(true);
        } else {
          setSnackbarMessage('Thêm thương hiệu thất bại, thử lại sau');
          setOpenSnackbar(true);
        }
      } else {
        setSnackbarMessage('Thương hiệu đã tồn tại');
        setOpenSnackbar(true);
        return;
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Đã xảy ra lỗi, thử lại sau');
      setOpenSnackbar(true);
    } finally {
      setNewBrand('');
      setNewBrandImg('');
      handleCloseBrandDialog();
      setOpenSnackbar(true);
    }
  };

  const handleAddNewSize = async () => {
    if (newSize && !sizes.includes(newSize)) {
      const response = await createSize(newSize);
      if (response) {
        setSizes([...sizes, newSize]);
        setNewSize('');
        setSnackbarMessage('Thêm kích thước thành công!');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage('Xảy ra lỗi. Vui lòng thử lại sau!');
        setOpenSnackbar(true);
      }
      handleCloseSizeDialog();
    }
  };

  // Product
  const [listProducts, setListProducts] = useState([]);
  const [ListBrands, setListBrands] = useState([]);
  const [ListCategories, setListCategories] = useState([]);
  const [ListSizes, setListSizes] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [result, cate, sizes] = await Promise.all([getAllBrands(), getAllCategories(), getAllSizes()]);

        if (result) setListBrands(result);
        if (cate) setListCategories(cate);
        if (sizes) {
          const freeSize = sizes.filter((size) => size.name === 'Free size');
          const otherSizes = sizes.filter((size) => size.name !== 'Free size');
          const sortedSizes = otherSizes.sort((a, b) => {
            return parseInt(a.name) - parseInt(b.name);
          });
          const sortedListSizes = [...freeSize, ...sortedSizes];

          setListSizes(sortedListSizes);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    discount: '',
    brand: '',
    size: [],
    category: '',
    assets: []
  });

  useEffect(() => {
    const fetchProductData = async () => {
      setLoadingProduct(true);
      try {
        const response = await getProducts();
        if (response.status) {
          const data = response.data;
          setListProducts(data.reverse());
        }
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProductData();
  }, []);

  // Trạng thái cho lọc khác (giá, danh mục, thương hiệu, tình trạng hàng)
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [stockStatus, setStockStatus] = useState('');

  const resetFilterProduct = () => {
    setMinPrice('');
    setMaxPrice('');
    setCategory('');
    setBrand('');
    setStockStatus('');
  };

  const [currentPageProduct, setCurrentPageProduct] = useState(1);
  const itemsPerPageProduct = 5;

  // Lọc danh sách sản phẩm
  const filteredProducts =
    listProducts &&
    listProducts.filter((product) => {
      const matchesPrice = (minPrice === '' || product.price >= minPrice) && (maxPrice === '' || product.price <= maxPrice);
      const matchesCategory = category === '' || product.category._id === category;
      const matchesBrands = brand === '' || brand === product.brand._id;
      // const matchesStockStatus =
      //   stockStatus === '' ||
      //   (stockStatus === 'in-stock' && product.quantity > 0) ||
      //   (stockStatus === 'out-of-stock' && product.quantity === 0);
      const matchesStockStatus =
        stockStatus === '' ||
        (stockStatus === 'in-stock' && product.size.some((s) => s.quantity > 0)) ||
        (stockStatus === 'out-of-stock' && product.size.every((s) => s.quantity === 0));

      return matchesPrice && matchesCategory && matchesBrands && matchesStockStatus;
    });

  // Phân trang dựa trên danh sách đã lọc
  const paginateProduct = filteredProducts.slice((currentPageProduct - 1) * itemsPerPageProduct, currentPageProduct * itemsPerPageProduct);

  const handlePageProductChange = (_, value) => {
    setCurrentPageProduct(value);
  };

  // console.log('Filtered Products:', filteredProducts);

  const handleOpenDialog = (product = null) => {
    setSelectedProduct(product);
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        discount: product.discount || '',
        brand: product.brand ? product.brand._id : '',
        size: product.size ? product.size.map((s) => ({ sizeId: s.sizeId._id, quantity: s.quantity })) : [],
        category: product.category ? product.category._id : '',
        assets: product.assets || []
      });
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        discount: '',
        brand: '',
        size: [],
        category: '',
        assets: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async () => {
    try {
      if (selectedProduct) {
        if (!validateForm()) {
          return;
        }
        // Cập nhật sản phẩm hiện tại
        const updatedProduct = await updateProduct(selectedProduct._id, formData);
        if (updatedProduct && updatedProduct.status) {
          console.log('updatedProduct.data', updatedProduct.data);

          setListProducts(listProducts.map((p) => (p._id === selectedProduct._id ? updatedProduct.data : p)));
          setSnackbarMessage('Cập nhật sản phẩm thành công!');
          setOpenSnackbar(true);
        } else {
          setSnackbarMessage('Xảy ra lỗi! Cập nhật sản phẩm thất bại!');
          setOpenSnackbar(true);
        }
      } else {
        if (!validateForm()) {
          return;
        }
        // Thêm sản phẩm mới
        const newProduct = await addProduct(formData);
        console.log('newProduct.data==============>', newProduct.data);

        if (newProduct && newProduct.status) {
          setListProducts([newProduct.data, ...listProducts]);
          setSnackbarMessage('Thêm sản phẩm thành công!');
          setOpenSnackbar(true);
        } else {
          setSnackbarMessage('Lỗi!!! Thêm sản phẩm không thành công!');
          setOpenSnackbar(true);
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Có lỗi xảy ra khi lưu sản phẩm:', error);
    }
  };

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [selectPd, setselectPd] = useState('');
  const handleClickOpen = (newStatus, id) => {
    setselectPd(id);
    setStatus(newStatus);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStopSelling = async (id) => {
    try {
      const response = await stopSellingPd(id, status);
      if (response.status) {
        setListProducts((prevProducts) => prevProducts.map((product) => (product._id === id ? { ...product, status: status } : product)));
        setOpen(false);
        setSnackbarMessage('Cập nhật trạng thái thành công');
        setOpenSnackbar(true);
      } else {
        setOpen(false);
        setSnackbarMessage('Cập nhật trạng thái thất bại');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setOpen(false);
      console.log('Lỗi khi cập nhật sp: ', error);
      setSnackbarMessage('Xảy ra lỗi. Vui lòng thử lại sau.');
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageProductChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedAssets = [];

    for (const file of files) {
      if (file && file.type && (file.type.startsWith('video/') || file.type.startsWith('image/'))) {
        const secureUrl = await uploadToCloundinary(file);
        if (secureUrl) {
          uploadedAssets.push(secureUrl);
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      assets: [...prev.assets, ...uploadedAssets]
    }));
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];

    if (file && file.type) {
      const secureUrl = await uploadToCloundinary(file);
      // console.log('Video upload: ', secureUrl);

      if (secureUrl) {
        setFormData((prev) => ({
          ...prev,
          assets: [...prev.assets, secureUrl]
        }));
      }
    }
  };

  const handleRemoveFile = (file) => {
    // console.log('File remove:', file);
    // console.log('Current assets:', formData.assets);

    const newAssets = formData.assets.filter((item) => item.trim() !== file.trim());
    setFormData({
      ...formData,
      assets: newAssets
    });

    // console.log('New assets:', newAssets);
  };

  const handleSizeChange = (sizeId) => {
    const existingSize = formData.size.find((size) => size.sizeId === sizeId);

    if (!existingSize) {
      // Add the new size with default quantity of 1
      const newSize = { sizeId, quantity: 1 };
      setFormData({ ...formData, size: [...formData.size, newSize] });
    } else {
      // Remove size if it was already selected
      const newSizes = formData.size.filter((size) => size.sizeId !== sizeId);
      setFormData({ ...formData, size: newSizes });
    }
  };

  const handleQuantityChange = (sizeId, value) => {
    const newSizes = formData.size.map((size) => {
      if (size.sizeId === sizeId) {
        return { ...size, quantity: value };
      }
      return size;
    });
    setFormData({ ...formData, size: newSizes });
  };

  // PHÂN TAB
  function TabPanel({ children, value, index }) {
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [errorsProduct, setErrorsProduct] = useState({});
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Tên sản phẩm là bắt buộc.';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0.';
    if (!formData.brand) newErrors.brand = 'Vui lòng chọn thương hiệu.';
    if (!formData.category) newErrors.category = 'Vui lòng chọn danh mục.';

    if (!formData.size || formData.size.length === 0) {
      newErrors.size = 'Vui lòng chọn ít nhất một size và số lượng.';
    } else {
      formData.size.forEach((selectedSize) => {
        if (!selectedSize.quantity || selectedSize.quantity <= 0) {
          newErrors.size = 'Số lượng phải lớn hơn 0.';
        }
      });
    }

    setErrorsProduct(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // XÁC NHẬN
  const [isCate, setIsCate] = useState(false);
  const [openModalCate, setOpenModalCate] = useState(false);
  const [selectedCate, setSelectedCate] = useState(null);
  const handleCloseModalConfirmDelete = () => {
    setOpenModalCate(false);
  };

  const handleClickOpenDeleteModal = (data) => {
    setSelectedCate(data);
    setOpenModalCate(true);
  };

  const handleDeleteCate = async () => {
    if (selectedCate?.products?.length !== 0) {
      setSnackbarMessage(`Danh mục ${selectedCate.name} đang có sản phẩm. Vui lòng kiểm tra lại!`);
      setOpenSnackbar(true);
      handleCloseModalConfirmDelete();
      return;
    }

    try {
      const response = await deleteCate(selectedCate._id);
      if (response.status) {
        setCategories((prevCategories) => prevCategories.filter((category) => category._id !== selectedCate._id));
        setSnackbarMessage(`Danh mục ${selectedCate.name} đã được xóa!`);
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage(`Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.log('Xay ra loi khi xoa danh muc: ', error);
    } finally {
      handleCloseModalConfirmDelete();
    }
  };

  const [openModalDelBrand, setopenModalDelBrand] = useState(false);
  const [selectedBrand, setselectedBrand] = useState(null);

  const handleCloseModalConfirmBrand = () => {
    setopenModalDelBrand(false);
  };

  const handleClickOpenDeleteBrand = (data) => {
    setselectedBrand(data);
    setopenModalDelBrand(true);
  };

  const handleDeleteBrand = async () => {
    if (selectedBrand?.products?.length !== 0) {
      setSnackbarMessage(`Thương hiệu ${selectedBrand.name} đang có sản phẩm. Vui lòng kiểm tra lại!`);
      setOpenSnackbar(true);
      handleCloseModalConfirmBrand();
      return;
    }

    try {
      const response = await deleteBrand(selectedBrand._id);
      if (response.status) {
        setBrands((prevCategories) => prevCategories.filter((category) => category._id !== selectedBrand._id));
        setSnackbarMessage(`Thương hiệu ${selectedBrand.name} đã được xóa!`);
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage(`Xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!`);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.log('Xay ra loi khi xoa thuong hieu: ', error);
    } finally {
      handleCloseModalConfirmBrand();
    }
  };

  return (
    <MainCard title="QUẢN LÝ KHO HÀNG" style={{ padding: 20 }}>
      <Box sx={{ width: '100%' }}>
        {/* Tabs */}
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Quản lý sản phẩm" />
          <Tab label="Quản lý danh mục" />
          <Tab label="Quản lý thương hiệu" />
          <Tab label="Quản lý kích thước" />
        </Tabs>

        {/* QUẢN LÝ SẢN PHẨM  */}
        <TabPanel value={value} index={0}>
          {value === 0 && (
            <div>
              <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                Thêm sản phẩm
              </Button>

              {/* Filter Section */}
              <div style={{ display: 'flex', marginTop: 20, alignItems: 'center' }}>
                <TextField
                  label="Giá nhỏ nhất"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ marginRight: 20, width: '170px' }}
                />
                <TextField
                  label="Giá lớn nhất"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ marginRight: 20, width: '170px' }}
                />

                <FormControl style={{ width: '170px', marginRight: '20px', marginBottom: '15px' }} margin="normal">
                  <InputLabel>Danh mục</InputLabel>
                  <Select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {ListCategories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl style={{ width: '170px', marginRight: '20px', marginBottom: '15px' }} margin="normal">
                  <InputLabel>Thương hiệu</InputLabel>
                  <Select name="category" value={brand} onChange={(e) => setBrand(e.target.value)}>
                    {ListBrands.map((brand) => (
                      <MenuItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl style={{ marginRight: '20px', marginBottom: '15px' }} margin="normal">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)} displayEmpty style={{ width: 150 }}>
                    <MenuItem value="in-stock">Còn hàng</MenuItem>
                    <MenuItem value="off-stock">Hết hàng</MenuItem>
                  </Select>
                </FormControl>

                <Button style={{ marginLeft: 20 }} variant="contained" color="primary" onClick={() => resetFilterProduct()}>
                  Bỏ lọc
                </Button>
              </div>

              <div>
                {loadingProduct ? (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', height: '50vh', alignItems: 'center' }}>
                    <CircularProgress />
                  </div>
                ) : (
                  <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ textAlign: 'center' }}>ID</TableCell>
                          <TableCell style={{ width: '15%', textAlign: 'center', flex: 1 }}>Tên</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>Giá (VNĐ)</TableCell>
                          <TableCell>Kích thước</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>Số lượng</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>Danh mục</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>Thương hiệu</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>Đã bán</TableCell>
                          <TableCell style={{ width: '13%', textAlign: 'center' }}>Trạng thái</TableCell>
                          <TableCell style={{ textAlign: 'center', flex: 1 }}>Hoạt động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginateProduct ? (
                          paginateProduct.map((product, index) => {
                            // Lọc kích thước theo trạng thái
                            const filteredSizes =
                              stockStatus === 'in-stock'
                                ? product.size.filter((s) => s.quantity > 0)
                                : stockStatus === 'off-stock'
                                  ? product.size.filter((s) => s.quantity === 0)
                                  : product.size;

                            // Bỏ qua sản phẩm nếu không có kích thước phù hợp
                            if (filteredSizes.length === 0) return null;

                            const updatedProduct = {
                              ...product,
                              size: filteredSizes
                            };

                            return (
                              <TableRow key={updatedProduct._id}>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {(currentPageProduct - 1) * itemsPerPageProduct + index + 1}
                                </TableCell>
                                <TableCell>{updatedProduct?.name || 'N/A'}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{updatedProduct.price.toLocaleString('vi-VN')}</TableCell>
                                <TableCell>
                                  {updatedProduct?.size && updatedProduct?.size.length > 0
                                    ? updatedProduct?.size.map((s) => <TableRow key={s._id}>{s.sizeId && s.sizeId.name}</TableRow>)
                                    : 'Không có kích thước'}
                                </TableCell>
                                <TableCell>
                                  {updatedProduct?.size && updatedProduct?.size.length > 0
                                    ? updatedProduct?.size.map((s) => <TableRow key={s._id}>{s && s.quantity}</TableRow>)
                                    : 'Không có số lượng'}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {updatedProduct.category ? updatedProduct.category.name : 'Không có danh mục'}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {updatedProduct.brand ? updatedProduct.brand.name : 'Không có thương hiệu'}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{updatedProduct.sold}</TableCell>
                                {/* <TableCell >{product.status}</TableCell> */}
                                <TableCell>
                                  {updatedProduct?.size && updatedProduct?.size.length > 0
                                    ? updatedProduct?.size.map((s) => (
                                        <TableRow key={s._id}>{s && s.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}</TableRow>
                                      ))
                                    : 'Không có số lượng'}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {product.status === 'Ngừng bán' ? (
                                    <>
                                      <Typography>Sản phẩm này đã tạm ngừng bán</Typography>
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleClickOpen('Đang kinh doanh', product._id)}
                                        style={{ width: '125px', marginTop: 5 }}
                                      >
                                        Tiếp tục kinh doanh
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleOpenDialog(product)}
                                        style={{ width: '125px' }}
                                      >
                                        Sửa
                                      </Button>
                                      <Button
                                        style={{ marginTop: 10 }}
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleClickOpen('Ngừng bán', product._id)}
                                      >
                                        Tạm ngừng
                                      </Button>
                                    </>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7}>Không có sản phẩm nào.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <Pagination
                      count={Math.ceil(filteredProducts.length / itemsPerPageProduct)}
                      page={currentPageProduct}
                      onChange={handlePageProductChange}
                      color="primary"
                      style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                    />
                  </TableContainer>
                )}
              </div>
            </div>
          )}
        </TabPanel>

        {/* QUẢN LÝ DANH MỤC */}
        <TabPanel value={value} index={1}>
          {value === 1 && (
            <div style={{ marginBottom: 20 }}>
              <Button variant="contained" color="secondary" onClick={handleOpenCategoryDialog} style={{ marginTop: 10 }}>
                Thêm danh mục
              </Button>
              <FormControl fullWidth margin="normal">
                <InputLabel>Lọc danh mục</InputLabel>
                <Select fullWidth name="categories" value={filterCate} onChange={(e) => setfilterCate(e.target.value)}>
                  <MenuItem value="all">Tất cả</MenuItem>
                  {categories.map((cate) => (
                    <MenuItem key={cate._id} value={cate._id}>
                      {cate.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', height: '50vh', alignItems: 'center' }}>
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Logo</TableCell>
                          <TableCell>Tên danh mục</TableCell>
                          <TableCell>Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginateCate.map((category, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <img style={{ width: '100px', height: '100px' }} src={category.image} />
                            </TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>
                              <Button onClick={() => handleOpenCategoryDetailDialog(category._id, category.name)}>Xem chi tiết</Button>
                              <Button
                                onClick={() => handleOpenEditCateDialog(category._id, category.name, category.image, category.description)}
                              >
                                Chỉnh sửa
                              </Button>
                              <Button onClick={() => handleClickOpenDeleteModal(category)}>Xóa</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Pagination
                    count={Math.ceil(listCateFilter.length / itemsPerPageCate)}
                    page={currentPageCate}
                    onChange={handlePageCateChange}
                    color="primary"
                    style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                  />
                </>
              )}
            </div>
          )}
        </TabPanel>

        {/* QUẢN LÝ THƯƠNG HIỆU */}
        <TabPanel value={value} index={2}>
          {value === 2 && (
            <div>
              <Button variant="contained" color="success" onClick={handleOpenBrandDialog}>
                Thêm thương hiệu
              </Button>
              <FormControl fullWidth margin="normal">
                <InputLabel>Tìm kiếm thương hiệu</InputLabel>
                <Select fullWidth name="brands" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
                  <MenuItem value="all">Tất cả</MenuItem>
                  {ListBrands.map((brand) => (
                    <MenuItem key={brand._id} value={brand._id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', height: '50vh', alignItems: 'center' }}>
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Logo</TableCell>
                          <TableCell>Tên thương hiệu</TableCell>
                          <TableCell>Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedBrands.map((brand, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <img style={{ width: '100px', height: '100px' }} src={brand.image} />
                            </TableCell>
                            <TableCell>{brand.name}</TableCell>
                            <TableCell>
                              <Button onClick={() => handleOpenBrandDetailDialog(brand._id, brand.name)}>Xem chi tiết</Button>
                              <Button onClick={() => handleOpenEditDialog(brand._id, brand.name, brand.image)}>Chỉnh sửa</Button>
                              <Button onClick={() => handleClickOpenDeleteBrand(brand)}>Xóa</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Pagination
                    count={Math.ceil(listBrandFilter.length / itemsPerPagebrand)}
                    page={currentBrandPage}
                    color="primary"
                    onChange={handlePageBrandChange}
                    style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                  />
                </>
              )}
            </div>
          )}
        </TabPanel>

        {/* QUẢN LÝ KÍCH THƯỚC */}
        <TabPanel value={value} index={3}>
          {value === 3 && (
            <div>
              <Button variant="contained" color="warning" onClick={handleOpenSizeDialog}>
                Thêm kích thước
              </Button>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Tìm kiếm...</InputLabel>
                  <Select fullWidth name="brands" value={filterSize} onChange={(e) => setFilterSize(e.target.value)}>
                    <MenuItem value="all">Tất cả</MenuItem>
                    {ListSizes.map((size) => (
                      <MenuItem key={size._id} value={size._id}>
                        {size.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', height: '50vh', alignItems: 'center' }}>
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Kích thước</TableCell>
                          <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedSizes.map((size, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">{size.name}</TableCell>
                            <TableCell align="center">
                              <Button onClick={() => {}}>Xem chi tiết</Button>
                              <Button onClick={() => handleDeleteSize(size.id)}>Xóa</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Pagination
                    count={Math.ceil(listSizeFilter.length / itemsPerPageSize)}
                    page={currentSizePage}
                    onChange={handlePageSizeChange}
                    color="primary"
                    style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                  />
                </>
              )}
            </div>
          )}
        </TabPanel>
      </Box>

      {/* QUAN LY SP */}
      <>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>
            {selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
          </DialogTitle>
          <DialogContent>
            <TextField
              error={!!errorsProduct.name}
              helperText={errorsProduct.name}
              label="Tên sản phẩm"
              name="name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              error={!!errorsProduct.price}
              helperText={errorsProduct.price}
              label="Giá"
              name="price"
              fullWidth
              margin="normal"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
            />
            <TextField
              label="Mô tả"
              name="description"
              fullWidth
              margin="normal"
              value={formData.description}
              onChange={handleInputChange}
            />
            <TextField
              label="Giảm giá"
              name="discount"
              fullWidth
              margin="normal"
              type="number"
              value={formData.discount}
              onChange={handleInputChange}
            />

            {/* Thương hiệu Select */}
            <FormControl fullWidth margin="normal" error={!!errorsProduct.brand}>
              <InputLabel>Thương hiệu</InputLabel>
              <Select name="brand" value={formData.brand} onChange={handleInputChange}>
                {ListBrands.map((brand) => (
                  <MenuItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errorsProduct.brand}</FormHelperText>
            </FormControl>

            {/* Danh mục Select */}
            <FormControl fullWidth margin="normal" error={!!errorsProduct.category}>
              <InputLabel>Danh mục</InputLabel>
              <Select name="category" value={formData.category} onChange={handleInputChange}>
                {ListCategories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errorsProduct.category}</FormHelperText>
            </FormControl>

            <FormControl component="fieldset" error={!!errorsProduct.size}>
              <FormLabel component="legend">Kích thước:</FormLabel>
              {ListSizes.map((size) => {
                const isChecked = formData.size.some((selectedSize) => selectedSize.sizeId === size._id);
                const selectedSize = formData.size.find((selectedSize) => selectedSize.sizeId === size._id);

                return (
                  <div key={size._id}>
                    <FormControlLabel
                      control={<Checkbox checked={isChecked} onChange={() => handleSizeChange(size._id)} name={`size-${size._id}`} />}
                      label={size.name}
                    />
                    {isChecked && (
                      <TextField
                        label="Quantity"
                        type="number"
                        value={selectedSize?.quantity}
                        onChange={(e) => handleQuantityChange(size._id, e.target.value)}
                        style={{ width: '100px', marginLeft: '10px', marginTop: 10, marginBottom: 10 }}
                      />
                    )}
                  </div>
                );
              })}
              <FormHelperText>{errorsProduct.size}</FormHelperText>
            </FormControl>

            <div style={{ display: 'flex', marginTop: 20 }}>
              {/* Input cho hình ảnh */}
              <label htmlFor="image-upload" style={{ display: 'block', marginRight: 10 }}>
                <Button variant="outlined" component="span">
                  Chọn ảnh
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageProductChange}
                  style={{ display: 'none' }}
                />
              </label>

              {/* Input cho video */}
              <label htmlFor="video-upload" style={{ display: 'block' }}>
                <Button variant="outlined" component="span">
                  Chọn video
                </Button>
                <input id="video-upload" type="file" accept="video/*" onChange={handleVideoChange} style={{ display: 'none' }} />
              </label>
            </div>

            <div style={{ marginTop: 10 }}>
              <strong>Các file đã chọn:</strong>
              <ul>
                {formData.assets.length > 0 &&
                  formData.assets.map((url, index) => (
                    <li key={index} style={{ listStyle: 'none' }}>
                      {url.endsWith('.mp4') ? (
                        <video src={url} controls style={{ width: '100px', height: 'auto', marginRight: '10px' }} />
                      ) : url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') ? (
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          style={{ width: 100, height: 100, margin: 10, position: 'relative', marginRight: '10px' }}
                        />
                      ) : null}
                      <button onClick={() => handleRemoveFile(url)} style={{ marginLeft: '10px' }}>
                        Xóa
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Hủy
            </Button>
            <Button size="lg" onClick={handleSaveProduct} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

        {/* dialog doi trang thai */}
        <Dialog style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} open={open} onClose={handleClose}>
          <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
          <DialogContent>
            <p>Bạn có chắc chắn muốn thay đổi trạng thái sản phẩm này thành {status}?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Hủy
            </Button>
            <Button onClick={() => handleStopSelling(selectPd)} color="primary">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </>

      {/* QUẢN LÝ DANH MỤC */}
      <>
        {/* Dialog for Adding New Category */}
        <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog}>
          <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>Thêm danh mục mới</DialogTitle>
          <DialogContent>
            <TextField
              error={!!cateErrors.newCategory}
              helperText={cateErrors.newCategory}
              label="Tên danh mục"
              fullWidth
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <FormControl fullWidth error={!!cateErrors.newCategoryImage}>
              <label htmlFor="image-upload" style={{ display: 'block', marginRight: 10, marginTop: 10, marginBottom: 10 }}>
                <Button variant="outlined" component="span">
                  Chọn ảnh
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageChange(event, 'category')}
                  style={{ display: 'none' }}
                />
                <FormHelperText>{cateErrors.newCategoryImage}</FormHelperText>
              </label>
            </FormControl>

            {newCategoryImage && (
              <FormControl fullWidth margin="normal" style={{ marginTop: 10, marginBottom: 10 }}>
                <strong>File đã chọn:</strong>
                <br />
                <div style={{ marginTop: 10 }}>
                  <img
                    src={newCategoryImage}
                    alt="Hình ảnh danh mục"
                    style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 10 }}
                  />
                </div>
              </FormControl>
            )}

            <TextField fullWidth label="Mô tả" value={newCateDes} onChange={(e) => setNewCateDes(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCategoryDialog} color="primary">
              Hủy
            </Button>
            <Button onClick={handleAddNewCategory} color="primary">
              Thêm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diaglog thông tin chi tiết danh mục */}
        <Dialog open={openCateDetailDialog} onClose={handleCloseCateDetailDialog} fullWidth={true} maxWidth="lg">
          <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>
            Chi tiết danh mục {catenamefordetail}
          </DialogTitle>
          <DialogContent>Tổng sản phẩm: {productOfCate.length}</DialogContent>
          <TableContainer
            style={{
              maxHeight: '500px'
            }}
            component={Paper}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Tên</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Giá (VNĐ)</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Kích thước</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Số lượng</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Danh mục</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Đã bán</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productOfCate && productOfCate.length > 0 ? (
                  productOfCate.map((product, index) => (
                    <TableRow key={product._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{product?.name || 'N/A'}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{product.price.toLocaleString('vi-VN')}</TableCell>
                      <TableCell style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        {product.size && product.size.length > 0
                          ? product.size.map((s) => (
                              <TableRow style={{ textAlign: 'center' }} key={s._id}>
                                {s.sizeId && s.sizeId.name}
                              </TableRow>
                            ))
                          : 'Không có kích thước'}
                      </TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        {product.size && product.size.length > 0
                          ? product.size.map((s) => <TableRow key={s._id}>{s && s.quantity}</TableRow>)
                          : 'Không có số lượng'}
                      </TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{product.brand ? product.brand.name : 'Không có danh mục'}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{product.sold}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{product.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>Không có sản phẩm nào.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Dialog>

        {/* Dialog Chinh sua logo danh muc */}
        <Dialog style={{ textAlign: 'center' }} fullWidth open={openCateEditDialog} onClose={handleCloseEditCateDialog}>
          <div style={{ padding: 20 }}>
            <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>
              Chỉnh sửa danh mục {selectedCatesName}
            </DialogTitle>
            <TextField
              error={!!cateErrors.newCategory}
              helperText={cateErrors.newCategory}
              label="Tên danh mục"
              fullWidth
              value={newCateName}
              onChange={(e) => setnewCateName(e.target.value)}
            />
            <TextField
              style={{ marginTop: 10 }}
              label="Mô tả danh mục"
              fullWidth
              value={newCateDescription}
              onChange={(e) => setnewCateDescription(e.target.value)}
            />
            <div style={{ padding: 10 }}>
              <p>Logo hiện tại</p>
              <img style={{ width: '100px', height: '100px' }} src={selectedCateImg} />
            </div>
            <label htmlFor="image-upload" style={{ display: 'block', marginRight: 10, marginTop: 10, marginBottom: 10 }}>
              <Button variant="outlined" component="span">
                Chọn ảnh
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(event) => handleImageChange(event, 'newCateLogo')}
                style={{ display: 'none' }}
              />
            </label>
            <div style={{ padding: 10 }}>
              <p>Logo mới</p>
              <img style={{ width: '100px', height: '100px' }} src={newCatelogo} />
            </div>
            <Button type="primary" onClick={() => handleEditCate()}>
              Lưu
            </Button>
          </div>
        </Dialog>
      </>

      {/* QUẢN LÝ BRAND */}
      <>
        {/* Diaglog thông tin chi tiết thương hiệu */}
        <Dialog open={openBrandDetailDialog} fullWidth={true} maxWidth="lg" onClose={handleCloseBrandDetailDialog}>
          <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>
            Chi tiết thương hiệu {selectedBrandsName}
          </DialogTitle>
          <DialogContent>Tổng sản phẩm: {productOfBrands.length}</DialogContent>
          <TableContainer
            style={{
              maxHeight: '500px'
            }}
            component={Paper}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ textAlign: 'center' }}>ID</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Tên</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Giá (VNĐ)</TableCell>
                  <TableCell>Kích thước</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Danh mục</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Đã bán</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productOfBrands && productOfBrands.length > 0 ? (
                  productOfBrands.map((product, index) => (
                    <TableRow key={product._id}>
                      <TableCell style={{ textAlign: 'center' }}>{index + 1}</TableCell>
                      <TableCell>{product?.name || 'N/A'}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{product.price.toLocaleString('vi-VN')}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        {product.size && product.size.length > 0
                          ? product.size.map((s) => <TableRow key={s._id}>{s.sizeId && s.sizeId.name}</TableRow>)
                          : 'Không có kích thước'}
                      </TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        {product.size && product.size.length > 0
                          ? product.size.map((s) => <TableRow key={s._id}>{s && s.quantity}</TableRow>)
                          : 'Không có số lượng'}
                      </TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        {product.category ? product.category.name : 'Không có danh mục'}
                      </TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{product.sold}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{product.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>Không có sản phẩm nào.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Dialog>

        {/* Dialog Chinh sua logo thuong hieu */}
        <Dialog
          style={{ paddingInline: 10, textAlign: 'center' }}
          fullWidth
          open={openEditBrandDialog}
          onClose={handleCloseEditBrandDialog}
        >
          <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>
            Chỉnh sửa logo thương hiệu {selectedBrandsName}
          </DialogTitle>
          <div style={{ padding: 10 }}>
            <Typography>Logo hiện tại:</Typography>
            <img style={{ width: '100px', height: '100px' }} src={currBrandLogo} />
          </div>

          <div style={{ padding: 10 }}>
            <Typography>Logo mới:</Typography>
            <label htmlFor="image-upload" style={{ display: 'block', marginRight: 10, marginTop: 10, marginBottom: 10 }}>
              <Button variant="outlined" component="span">
                Chọn ảnh
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(event) => handleImageChange(event, 'newBrandLogo')}
                style={{ display: 'none' }}
              />
            </label>
            {newBrandLogo && <img style={{ width: '100px', height: '100px' }} src={newBrandLogo} />}
          </div>

          <DialogActions>
            <Button type="primary" onClick={() => handleCloseEditBrandDialog()}>
              Hủy
            </Button>
            <Button type="primary" onClick={() => handleEditBrand()}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Adding New Brand */}
        <Dialog open={openBrandDialog} onClose={handleCloseBrandDialog}>
          <DialogTitle>Thêm thương hiệu mới</DialogTitle>
          <DialogContent>
            <TextField label="Tên thương hiệu" fullWidth value={newBrand} onChange={(e) => setNewBrand(e.target.value)} />
            <label htmlFor="image-upload" style={{ display: 'block', marginRight: 10, marginTop: 10, marginBottom: 10 }}>
              <Button variant="outlined" component="span">
                Chọn ảnh
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(event) => handleImageChange(event, 'brand')}
                style={{ display: 'none' }}
              />
            </label>

            <div style={{ marginTop: 10, marginBottom: 10 }}>
              <strong>File đã chọn:</strong>
              <br />
              {newBrandImg && (
                <div style={{ marginTop: 10 }}>
                  <img src={newBrandImg} alt="Hình ảnh danh mục" style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 10 }} />
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBrandDialog} color="primary">
              Hủy
            </Button>
            <Button onClick={handleAddNewBrand} color="primary">
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
      </>

      {/* QUẢN LÝ SIZE */}
      <>
        {/* Dialog for Adding New Size */}
        <Dialog open={openSizeDialog} onClose={handleCloseSizeDialog}>
          <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>Thêm kích thước mới</DialogTitle>
          <DialogContent>
            <TextField label="Tên kích thước" fullWidth value={newSize} onChange={(e) => setNewSize(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSizeDialog} color="primary">
              Hủy
            </Button>
            <Button onClick={handleAddNewSize} color="primary">
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
      </>

      {/* Modal Xác nhận */}
      <Dialog open={openModalCate} onClose={handleCloseModalConfirmDelete}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>
          Xác nhận xóa danh mục {selectedCate?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa danh mục {selectedCate?.name} không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalConfirmDelete}>Hủy</Button>
          <Button onClick={handleDeleteCate} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModalDelBrand} onClose={handleCloseModalConfirmBrand}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>
          Xác nhận xóa thương hiệu {selectedBrand?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa thương hiệu {selectedBrand?.name} không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalConfirmBrand}>Hủy</Button>
          <Button onClick={handleDeleteBrand} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thông báo */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default InventoryManagement;
