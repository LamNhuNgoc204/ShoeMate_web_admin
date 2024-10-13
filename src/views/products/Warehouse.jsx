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
  Alert
} from '@mui/material';
import { getAllBrands, getAllCategories, getAllSizes } from 'api/getAllData';
import { createCate, createSize } from 'api/createNew';
import MainCard from 'ui-component/cards/MainCard';
import { uploadToCloundinary } from 'functions/processingFunction';

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openBrandDialog, setOpenBrandDialog] = useState(false);
  const [openSizeDialog, setOpenSizeDialog] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    category: '',
    brand: '',
    size: ''
  });

  const [newCategory, setNewCategory] = useState('');
  const [newCateDes, setNewCateDes] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const secureUrl = await uploadToCloundinary(file);
      // console.log('secureUrl', secureUrl);
      if (secureUrl) {
        setNewCategoryImage(secureUrl);
      }
    }
  };

  const [newBrand, setNewBrand] = useState('');
  const [newSize, setNewSize] = useState('');

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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

  const handleOpenCategoryDialog = () => {
    setOpenCategoryDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
    setNewCategory('');
    setNewCateDes('');
    setNewCategoryImage('');
  };

  const handleOpenBrandDialog = () => {
    setOpenBrandDialog(true);
  };

  const handleCloseBrandDialog = () => {
    setOpenBrandDialog(false);
    setNewBrand('');
  };

  const handleOpenSizeDialog = () => {
    setOpenSizeDialog(true);
  };

  const handleCloseSizeDialog = () => {
    setOpenSizeDialog(false);
    setNewSize('');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // console.log('cate body: ', newCategory, '-', newCategoryImage, '-', newCateDes);

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

  const handleAddNewBrand = () => {
    if (newBrand && !brands.includes(newBrand)) {
      setBrands([...brands, newBrand]);
      setNewBrand('');
      handleCloseBrandDialog();
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

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
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
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
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
