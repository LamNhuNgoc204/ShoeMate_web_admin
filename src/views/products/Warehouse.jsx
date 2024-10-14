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
  Pagination
} from '@mui/material';
import { getAllBrands, getAllCategories, getAllSizes, getProductOfBrand } from 'api/getAllData';
import { createCate, createNewBrand, createSize } from 'api/createNew';
import MainCard from 'ui-component/cards/MainCard';
import { uploadToCloundinary } from 'functions/processingFunction';
import { updateLogoBrand } from 'api/updateData';

const InventoryManagement = () => {
  //PRODUCTS
  const [products, setProducts] = useState([]);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  //CATEGORIES
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCateDes, setNewCateDes] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [categories, setCategories] = useState([]);

  //BRANDS
  const [newBrand, setNewBrand] = useState('');
  const [newBrandImg, setNewBrandImg] = useState('');
  const [openBrandDialog, setOpenBrandDialog] = useState(false);
  const [openBrandDetailDialog, setopenBrandDetailDialog] = useState(false);
  const [brands, setBrands] = useState([]);
  const [productOfBrands, setProductOfBrands] = useState([]);
  const [filterBrand, setFilterBrand] = useState('');
  const [selectedBrandsName, setSelectedBrandsName] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [currBrandLogo, setCurrBrandLogo] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('');
  const [openEditBrandDialog, setopenEditBrandDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //SIZES
  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState('');
  const [openSizeDialog, setOpenSizeDialog] = useState(false);
  const [filterSize, setFilterSize] = useState('');

  //COMMON
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
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

  //FUN PRODUCTS
  const handleOpenProductDialog = (product = null) => {
    setSelectedProduct(product);
    setFormData(product ? { ...product } : { name: '', quantity: '', price: '', category: '', brand: '', size: '' });
    setOpenProductDialog(true);
  };
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setSelectedProduct(null);
    resetFormData();
  };
  const handleSaveProduct = () => {
    if (selectedProduct) {
      setProducts(products.map((p) => (p.id === selectedProduct.id ? { ...formData, id: p.id } : p)));
    } else {
      setProducts([...products, { ...formData, id: products.length + 1 }]);
    }
    handleCloseProductDialog();
  };
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

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
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const filteredBrands = brands.filter((brand) => brand.name.toLowerCase().includes(filterBrand.toLowerCase()));
  const paginatedBrands = filteredBrands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  //FUN SIZES
  const handleOpenSizeDialog = () => {
    setOpenSizeDialog(true);
  };
  const handleCloseSizeDialog = () => {
    setOpenSizeDialog(false);
    setNewSize('');
  };

  //INPUT
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  //RESET FORM
  const resetFormData = () => {
    setNewCategory('');
    setNewBrand('');
    setNewSize('');
  };

  return (
    <MainCard title="QUẢN LÝ KHO HÀNG" style={{ padding: 20 }}>
      <Button variant="contained" color="primary" onClick={() => handleOpenProductDialog()}>
        Thêm sản phẩm
      </Button>
      <Button variant="contained" color="secondary" onClick={handleOpenCategoryDialog} style={{ marginLeft: 10 }}>
        Thêm danh mục
      </Button>
      <Button variant="contained" color="success" onClick={handleOpenBrandDialog} style={{ marginLeft: 10 }}>
        Thêm thương hiệu
      </Button>
      <Button variant="contained" color="warning" onClick={handleOpenSizeDialog} style={{ marginLeft: 10 }}>
        Thêm kích thước
      </Button>

      <TableContainer component={Paper} style={{ marginTop: 20, marginBottom: 20 }}>
        <h2>Quản lý sản phẩm</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell>Kích thước</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenProductDialog(product)}
                    style={{ marginRight: 10 }}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDeleteProduct(product.id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Brands Table */}
      <div style={{ marginTop: 20 }}>
        <h2>Quản lý thương hiệu</h2>
        <FormControl fullWidth margin="normal">
          <InputLabel>Tìm kiếm thương hiệu</InputLabel>
          <Select name="brands" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
            {brands.map((brand) => (
              <MenuItem key={brand._id} value={brand._id}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
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
          count={Math.ceil(filteredBrands.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
        />
      </div>

      {/* Sizes Table */}
      <div>
        <h2>Quản lý kích thước</h2>
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

      {/* Dialog for Product */}
      <Dialog open={openProductDialog} onClose={handleCloseProductDialog}>
        <DialogTitle>{selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent>
          <TextField label="Tên sản phẩm" name="name" fullWidth margin="normal" value={formData.name} onChange={handleInputChange} />
          <TextField
            label="Số lượng"
            name="quantity"
            fullWidth
            margin="normal"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
          />
          <TextField label="Giá" name="price" fullWidth margin="normal" type="number" value={formData.price} onChange={handleInputChange} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Danh mục</InputLabel>
            <Select name="category" value={formData.category} onChange={handleInputChange}>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Thương hiệu</InputLabel>
            <Select name="brand" value={formData.brand} onChange={handleInputChange}>
              {brands.map((brand, index) => (
                <MenuItem key={index} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Kích thước</InputLabel>
            <Select name="size" value={formData.size} onChange={handleInputChange}>
              {sizes.map((size, index) => (
                <MenuItem key={index} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveProduct} color="primary">
            Lưu
          </Button>
        </DialogActions>
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
