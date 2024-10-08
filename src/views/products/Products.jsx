import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';

const Typography = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product A', price: 100, stock: 10, description: '', discount: 0, brand: '', category: '', assets: [] },
    { id: 2, name: 'Product B', price: 200, stock: 5, description: '', discount: 0, brand: '', category: '', assets: [] }
  ]);

  const brands = ['Brand A', 'Brand B', 'Brand C'];
  const categories = ['Category A', 'Category B', 'Category C'];

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    discount: '',
    brand: '',
    category: '',
    assets: []
  });

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');

  const handleOpenDialog = (product = null) => {
    setSelectedProduct(product);
    setFormData(
      product ? { ...product } : { name: '', price: '', stock: '', description: '', discount: '', brand: '', category: '', assets: [] }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = () => {
    if (selectedProduct) {
      setProducts(products.map((p) => (p.id === selectedProduct.id ? { ...formData, id: p.id } : p)));
    } else {
      setProducts([...products, { ...formData, id: products.length + 1 }]);
    }
    handleCloseDialog();
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, assets: files });
  };

  const filteredProducts = products.filter((product) => {
    const matchesPrice = (minPrice === '' || product.price >= minPrice) && (maxPrice === '' || product.price <= maxPrice);
    const matchesCategory = category === '' || product.category === category;
    const matchesStockStatus =
      stockStatus === '' || (stockStatus === 'in-stock' && product.stock > 0) || (stockStatus === 'out-of-stock' && product.stock === 0);
    return matchesPrice && matchesCategory && matchesStockStatus;
  });

  return (
    <MainCard title="QUẢN LÝ SẢN PHẨM">
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Thêm sản phẩm
      </Button>

      {/* Filter Section */}
      <div style={{ marginTop: 20 }}>
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
        <TextField label="Danh mục" value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginRight: 20 }} />
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

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleOpenDialog(product)} style={{ marginRight: 10 }}>
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent>
          <TextField label="Tên sản phẩm" name="name" fullWidth margin="normal" value={formData.name} onChange={handleInputChange} />
          <TextField label="Giá" name="price" fullWidth margin="normal" type="number" value={formData.price} onChange={handleInputChange} />
          <TextField
            label="Số lượng"
            name="stock"
            fullWidth
            margin="normal"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
          />
          <TextField label="Mô tả" name="description" fullWidth margin="normal" value={formData.description} onChange={handleInputChange} />
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
              {brands.map((brand, index) => (
                <MenuItem key={index} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Danh mục Select */}
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
          {/* Input cho hình ảnh và video */}
          <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} style={{ marginTop: 20, width: '100%' }} />
          <div style={{ marginTop: 10 }}>
            <strong>Các file đã chọn:</strong>
            <ul>{formData.assets.length > 0 && formData.assets.map((file, index) => <li key={index}>{file.name}</li>)}</ul>
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
  );
};

export default Typography;
