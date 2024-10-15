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
  Checkbox
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBrands, getAllCategories, getAllSizes, getProductOfBrand } from 'api/getAllData';
import { createCate, createNewBrand, createSize } from 'api/createNew';
import MainCard from 'ui-component/cards/MainCard';
import { uploadToCloundinary } from 'functions/processingFunction';
import { updateLogoBrand } from 'api/updateData';
import { fetchProducts } from 'redux/thunks/productsThunk';
import { addProduct, updateProduct } from 'api/products';

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
  const [openCateDetailDialog, setopenCateDetailDialog] = useState(false);
  const [selectedCatesName, setSelectedCatesName] = useState(null);
  const [selectedCateId, setSelectedsCateId] = useState(null);
  const [productOfCate, setproductOfCate] = useState([]);
  const [filterCate, setfilterCate] = useState('');
  const [currentPageCate, setCurrentPageCate] = useState(1);
  const itemsPerPageCate = 5;
  // Lọc danh sách danh mục
  const listCateFilter = categories.filter((cate) => {
    return filterCate === '' || filterCate === cate._id;
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
  const [filterBrand, setFilterBrand] = useState('');
  const [currentBrandPage, setcurrentBrandPage] = useState(1);
  const itemsPerPagebrand = 5;
  // Lọc danh sách thương hiệu theo filterBrand
  const listBrandFilter = Array.isArray(brands)
    ? brands.filter((brand) => {
        return filterBrand === '' || filterBrand === brand._id;
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
  const [filterSize, setFilterSize] = useState('');

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
        }
      }
    }
  };

  //CALL API
  useEffect(() => {
    const fetchdata = async () => {
      const sizes = await getAllSizes();
      const result = await getAllBrands();
      const cate = await getAllCategories();
      if (result) {
        setBrands(result);
      }
      if (cate) {
        setCategories(cate);
      }
      if (sizes) {
        setSizes(sizes);
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      const response = await getProductOfBrand(selectedBrandId);
      console.log('Response:', response);
      if (!response || !response.data) {
        setSnackbarMessage('Lấy dữ liệu thất bại!');
        setOpenSnackbar(true);
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
  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
    setNewCategory('');
    setNewCateDes('');
    setNewCategoryImage('');
  };
  const handleCloseCateDetailDialog = () => {
    setopenCateDetailDialog(false);
  };
  const handleOpenCateDetailDialog = async (id, name) => {
    setSelectedsCateId(id);
    setSelectedCatesName(name);
    try {
      if (!productOfCate) {
        setSnackbarMessage('Xảy ra lỗi khi lấy sản phẩm theo brands!');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Xảy ra lỗi khi lấy sản phẩm theo brands!');
      setOpenSnackbar(true);
    } finally {
      setopenBrandDetailDialog(true);
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
        setSnackbarMessage('Xảy ra lỗi khi lấy sản phẩm theo brands!');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Xảy ra lỗi khi lấy sản phẩm theo brands!');
      setOpenSnackbar(true);
    } finally {
      setopenBrandDetailDialog(true);
    }
  };
  const handleCloseBrandDetailDialog = () => {
    setopenBrandDetailDialog(false);
  };
  const handleCloseEditBrandDialog = () => {
    setopenEditBrandDialog(false);
  };
  const handleOpenEditDialog = (id, name, img) => {
    setSelectedBrandId(id);
    setCurrBrandLogo(img);
    setSelectedBrandsName(name);
    setopenEditBrandDialog(true);
  };
  const handleEditBrand = async () => {
    if (!newBrandLogo) {
      setSnackbarMessage('Vui long chon anh');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await updateLogoBrand(selectedBrandId, newBrandLogo);
      console.log('response new logo brands: ', response);

      if (response.status) {
        setSnackbarMessage('Chỉnh sửa logo thành công');
      } else {
        setSnackbarMessage('Chỉnh sửa logo xảy ra lỗi');
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Đã xảy ra lỗi khi chinh sua logo brand, thử lại sau');
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
  const handleAddNewCategory = async () => {
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

      console.log('body: ', body);

      if (!body.name || !body.image || !body.description) {
        setSnackbarMessage('Dữ liệu không đầy đủ, vui lòng kiểm tra lại');
        return;
      }

      const response = await createCate(body);

      if (response) {
        setCategories([...categories, { name: newCategory, image: newCategoryImage, description: newCateDes }]);
        setSnackbarMessage('Thêm danh mục thành công');
      } else {
        setSnackbarMessage('Thêm danh mục thất bại, thử lại sau');
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Đã xảy ra lỗi, thử lại sau');
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

      console.log('Brand body: ', body);

      if (newBrand && !brands.includes(newBrand)) {
        const response = await createNewBrand(body);
        if (response) {
          setBrands([...brands, { name: newBrand, image: newBrandImg }]);
          setSnackbarMessage('Thêm thương hiệu thành công');
        } else {
          setSnackbarMessage('Thêm thương hiệu thất bại, thử lại sau');
        }
      } else {
        setSnackbarMessage('Thương hiệu đã tồn tại');
        setOpenSnackbar(true);
        return;
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Đã xảy ra lỗi, thử lại sau');
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
      }
      handleCloseSizeDialog();
    }
  };

  // Product
  const [listProducts, setListProducts] = useState([]);
  const [ListBrands, setListBrands] = useState([]);
  const [ListCategories, setListCategories] = useState([]);
  const [ListSizes, setListSizes] = useState([]);

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

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);

  useEffect(() => {
    const fetchdata = async () => {
      await dispatch(fetchProducts());
    };
    fetchdata();
  }, []);

  useEffect(() => {
    if (products && products.products && products.products.length > 0) {
      setListProducts(products.products);
    }
  }, [products]);

  console.log('ListProducts------------------>', listProducts);

  useEffect(() => {
    const fetchdata = async () => {
      const result = await getAllBrands();
      const cate = await getAllCategories();
      const sizes = await getAllSizes();
      if (result) {
        setListBrands(result);
      }
      if (cate) {
        setListCategories(cate);
      }
      if (sizes) {
        setListSizes(sizes);
      }
    };
    fetchdata();
  }, []);

  // Trạng thái cho lọc khác (giá, danh mục, thương hiệu, tình trạng hàng)
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [stockStatus, setStockStatus] = useState('');

  const [filterProduct, setfilterProduct] = useState('');
  const [currentPageProduct, setCurrentPageProduct] = useState(1);
  const itemsPerPageProduct = 5;

  // Lọc danh sách sản phẩm
  const filteredProducts =
    listProducts &&
    listProducts.filter((product) => {
      const matchesPrice = (minPrice === '' || product.price >= minPrice) && (maxPrice === '' || product.price <= maxPrice);
      const matchesCategory = category === '' || product.category._id === category;
      const matchesBrands = brand === '' || brand === product.brand._id;
      const matchesStockStatus =
        stockStatus === '' ||
        (stockStatus === 'in-stock' && product.quantity > 0) ||
        (stockStatus === 'out-of-stock' && product.quantity === 0);

      return matchesPrice && matchesCategory && matchesBrands && matchesStockStatus;
    });

  // Phân trang dựa trên danh sách đã lọc
  const paginateProduct = filteredProducts.slice((currentPageProduct - 1) * itemsPerPageProduct, currentPageProduct * itemsPerPageProduct);

  const handlePageProductChange = (_, value) => {
    setCurrentPageProduct(value);
  };

  console.log('Filtered Products:', filteredProducts);

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
      console.log('formdata', formData);

      if (selectedProduct) {
        // Cập nhật sản phẩm hiện tại
        const updatedProduct = await updateProduct(selectedProduct._id, formData);
        setListProducts(listProducts.map((p) => (p._id === selectedProduct._id ? updatedProduct : p)));
      } else {
        // Thêm sản phẩm mới
        const newProduct = await addProduct(formData);
        setListProducts([...listProducts, newProduct]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Có lỗi xảy ra khi lưu sản phẩm:', error);
    }
  };

  const handleDeleteProduct = (id) => {
    setListProducts(listProducts.filter((product) => product._id !== id));
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
    console.log('File remove:', file);
    console.log('Current assets:', formData.assets);

    const newAssets = formData.assets.filter((item) => item.trim() !== file.trim());
    setFormData({
      ...formData,
      assets: newAssets
    });

    console.log('New assets:', newAssets);
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

  return (
    <MainCard title="QUẢN LÝ KHO HÀNG" style={{ padding: 20 }}>
      {/* QUAN LY SAN PHAM */}
      <MainCard title="QUẢN LÝ SẢN PHẨM">
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
            style={{ marginRight: 20 }}
          />
          <TextField
            label="Giá lớn nhất"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ marginRight: 20 }}
          />

          {/* <TextField label="Danh mục" value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginRight: 20 }} /> */}
          <FormControl style={{ width: '150px', marginRight: '20px', marginBottom: '15px' }} margin="normal">
            <InputLabel>Danh mục</InputLabel>
            <Select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {ListCategories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ width: '150px', marginRight: '20px', marginBottom: '15px' }} margin="normal">
            <InputLabel>Thương hiệu</InputLabel>
            <Select name="category" value={brand} onChange={(e) => setBrand(e.target.value)}>
              {ListBrands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Select
            label="Trạng thái tồn kho"
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
            displayEmpty
            style={{ width: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="in-stock">Còn hàng</MenuItem>
            <MenuItem value="out-of-stock">Hết hàng</MenuItem>
          </Select>
        </div>

        <div>
          <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Đã bán</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginateProduct ? (
                  paginateProduct.map((product, index) => (
                    <TableRow key={product._id}>
                      <TableCell>{(currentPageProduct - 1) * itemsPerPageProduct + index + 1}</TableCell>
                      <TableCell>{product?.name || 'N/A'}</TableCell>
                      <TableCell>{product.price.toLocaleString('vi-VN')}</TableCell>
                      <TableCell>
                        {product.size && product.size.length > 0
                          ? product.size.map((s) => <TableRow key={s._id}>{s.sizeId && s.sizeId.name}</TableRow>)
                          : 'Không có kích thước'}
                      </TableCell>
                      <TableCell>
                        {product.size && product.size.length > 0
                          ? product.size.map((s) => <TableRow key={s._id}>{s && s.quantity}</TableRow>)
                          : 'Không có số lượng'}
                      </TableCell>
                      <TableCell>{product.category ? product.category.name : 'Không có danh mục'}</TableCell>
                      <TableCell>{product.brand ? product.brand.name : 'Không có thương hiệu'}</TableCell>
                      <TableCell>{product.sold}</TableCell>
                      <TableCell>{product.status}</TableCell>
                      {/* <TableCell>{product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}</TableCell> */}
                      <TableCell>
                        <Button variant="contained" color="secondary" onClick={() => handleOpenDialog(product)} style={{ marginRight: 10 }}>
                          Sửa
                        </Button>
                        <Button style={{ marginTop: 10 }} variant="contained" color="error" onClick={() => handleDeleteProduct(product.id)}>
                          Xóa
                        </Button>
                      </TableCell>
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
          <Pagination
            count={Math.ceil(filteredProducts.length / itemsPerPageProduct)}
            page={currentPageProduct}
            onChange={handlePageProductChange}
            style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
          />
        </div>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
          <DialogContent>
            <TextField label="Tên sản phẩm" name="name" fullWidth margin="normal" value={formData.name} onChange={handleInputChange} />
            <TextField
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Thương hiệu</InputLabel>
              <Select name="brand" value={formData.brand} onChange={handleInputChange}>
                {ListBrands.map((brand) => (
                  <MenuItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Danh mục Select */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Danh mục</InputLabel>
              <Select name="category" value={formData.category} onChange={handleInputChange}>
                {ListCategories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl component="fieldset">
              <FormLabel component="legend">Sizes</FormLabel>
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
            <Button onClick={handleSaveProduct} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </MainCard>

      {/* QL DANH MỤC */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <h2>Quản lý danh mục</h2>
        <Button variant="contained" color="secondary" onClick={handleOpenCategoryDialog} style={{ marginTop: 10 }}>
          Thêm danh mục
        </Button>
        <FormControl fullWidth margin="normal">
          <InputLabel>Lọc danh mục</InputLabel>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Select fullWidth name="categories" value={filterCate} onChange={(e) => setfilterCate(e.target.value)}>
              {categories.map((cate) => (
                <MenuItem key={cate._id} value={cate._id}>
                  {cate.name}
                </MenuItem>
              ))}
            </Select>
            <Button variant="contained" color="warning" onClick={() => setfilterCate('')} style={{ marginLeft: 10, width: 200, flex: 1 }}>
              Bỏ lọc
            </Button>
          </div>
        </FormControl>
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
                    <Button onClick={() => handleOpenEditCateDialog(category._id, category.name, category.image)}>Chỉnh sửa</Button>
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
          style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
        />
      </div>

      {/* QL BRANDS */}
      <div style={{ marginTop: 20 }}>
        <h2>Quản lý thương hiệu</h2>
        <Button variant="contained" color="success" onClick={handleOpenBrandDialog}>
          Thêm thương hiệu
        </Button>
        <FormControl fullWidth margin="normal">
          <InputLabel>Tìm kiếm thương hiệu</InputLabel>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Select fullWidth name="brands" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
              {ListBrands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
            <Button variant="contained" color="warning" onClick={() => setFilterBrand('')} style={{ marginLeft: 10, width: 200, flex: 1 }}>
              Bỏ lọc
            </Button>
          </div>
        </FormControl>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(listBrandFilter.length / itemsPerPagebrand)}
          page={currentBrandPage}
          onChange={handlePageBrandChange}
          style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
        />
      </div>

      {/* QL Sizes */}
      <div>
        <h2>Quản lý kích thước</h2>
        <Button variant="contained" color="warning" onClick={handleOpenSizeDialog}>
          Thêm kích thước
        </Button>
        <TextField
          label="Tìm kiếm kích thước"
          variant="outlined"
          fullWidth
          margin="normal"
          value={filterSize}
          onChange={(e) => setFilterSize(e.target.value)}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kích thước</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              abg
              {/* {sizes
        .filter((size) => size.toLowerCase().includes(filterSize.toLowerCase()))
        .map((size, index) => (
          <TableRow key={index}>
            <TableCell>{size}</TableCell>
            <TableCell>
              <Button onClick={() => handleDeleteSize(size.id)}>Xóa</Button>
            </TableCell>
          </TableRow>
        ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Diaglog thông tin chi tiết thương hiệu */}
      <Dialog open={openBrandDetailDialog} onClose={handleCloseBrandDetailDialog}>
        <DialogTitle>Chi tiết thương hiệu {selectedBrandsName}</DialogTitle>
        <TableContainer component={Paper}>
          <Table style={{ width: '80%', maxWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Đã bán</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productOfBrands && productOfBrands.length > 0 ? (
                productOfBrands.map((product, index) => (
                  <TableRow key={product._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product?.name || 'N/A'}</TableCell>
                    <TableCell>{product.price.toLocaleString('vi-VN')}</TableCell>
                    <TableCell>
                      {product.size && product.size.length > 0
                        ? product.size.map((s) => <TableRow key={s._id}>{s.sizeId && s.sizeId.name}</TableRow>)
                        : 'Không có kích thước'}
                    </TableCell>
                    <TableCell>
                      {product.size && product.size.length > 0
                        ? product.size.map((s) => <TableRow key={s._id}>{s && s.quantity}</TableRow>)
                        : 'Không có số lượng'}
                    </TableCell>
                    <TableCell>{product.category ? product.category.name : 'Không có danh mục'}</TableCell>
                    <TableCell>{product.sold}</TableCell>
                    <TableCell>{product.status}</TableCell>
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
      <Dialog style={{ padding: 10, textAlign: 'center' }} fullWidth open={openEditBrandDialog} onClose={handleCloseEditBrandDialog}>
        <DialogTitle>Chỉnh sửa logo thương hiệu {selectedBrandsName}</DialogTitle>
        <div style={{ padding: 10 }}>
          <p>Logo hiện tại</p>
          <img style={{ width: '100px', height: '100px' }} src={currBrandLogo} />
        </div>
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

        <div style={{ padding: 10 }}>
          <p>Logo mới</p>
          <img style={{ width: '100px', height: '100px' }} src={newBrandLogo} />
        </div>

        <Button type="primary" onClick={() => handleEditBrand()}>
          Lưu
        </Button>
      </Dialog>

      {/* Dialog for Adding New Category */}
      <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog}>
        <DialogTitle>Thêm danh mục mới</DialogTitle>
        <DialogContent>
          <TextField label="Tên danh mục" fullWidth value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />

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
          </label>

          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <strong>File đã chọn:</strong>
            <br />
            {newCategoryImage && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={newCategoryImage}
                  alt="Hình ảnh danh mục"
                  style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 10 }}
                />
              </div>
            )}
          </div>

          <TextField label="Mô tả" fullWidth value={newCateDes} onChange={(e) => setNewCateDes(e.target.value)} />
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

      {/* Dialog for Adding New Size */}
      <Dialog open={openSizeDialog} onClose={handleCloseSizeDialog}>
        <DialogTitle>Thêm kích thước mới</DialogTitle>
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
