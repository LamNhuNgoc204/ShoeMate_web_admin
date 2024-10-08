import React, { useState } from 'react';
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
  MenuItem
} from '@mui/material';

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
  const [newBrand, setNewBrand] = useState('');
  const [newSize, setNewSize] = useState('');
  
  const [categories, setCategories] = useState(['Điện tử', 'Thời trang', 'Thực phẩm', 'Nhà cửa', 'Thể thao']);
  const [brands, setBrands] = useState(['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony']);
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL', 'XXL']);

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

  const handleAddNewCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      handleCloseCategoryDialog();
    }
  };

  const handleAddNewBrand = () => {
    if (newBrand && !brands.includes(newBrand)) {
      setBrands([...brands, newBrand]);
      setNewBrand('');
      handleCloseBrandDialog();
    }
  };

  const handleAddNewSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
      handleCloseSizeDialog();
    }
  };

  const resetFormData = () => {
    setNewCategory('');
    setNewBrand('');
    setNewSize('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý kho hàng</h2>
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
                  <Button variant="contained" color="secondary" onClick={() => handleOpenProductDialog(product)} style={{ marginRight: 10 }}>
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
          <TextField 
            label="Tên danh mục" 
            fullWidth 
            value={newCategory} 
            onChange={(e) => setNewCategory(e.target.value)} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategoryDialog} color="primary">Hủy</Button>
          <Button onClick={handleAddNewCategory} color="primary">Thêm</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Adding New Brand */}
      <Dialog open={openBrandDialog} onClose={handleCloseBrandDialog}>
        <DialogTitle>Thêm thương hiệu mới</DialogTitle>
        <DialogContent>
          <TextField 
            label="Tên thương hiệu" 
            fullWidth 
            value={newBrand} 
            onChange={(e) => setNewBrand(e.target.value)} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBrandDialog} color="primary">Hủy</Button>
          <Button onClick={handleAddNewBrand} color="primary">Thêm</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Adding New Size */}
      <Dialog open={openSizeDialog} onClose={handleCloseSizeDialog}>
        <DialogTitle>Thêm kích thước mới</DialogTitle>
        <DialogContent>
          <TextField 
            label="Tên kích thước" 
            fullWidth 
            value={newSize} 
            onChange={(e) => setNewSize(e.target.value)} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSizeDialog} color="primary">Hủy</Button>
          <Button onClick={handleAddNewSize} color="primary">Thêm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
