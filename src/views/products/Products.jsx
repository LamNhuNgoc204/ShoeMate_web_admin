import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from 'redux/thunks/productsThunk';
import { getAllBrands, getAllCategories } from 'api/getAllData';

const Typography = () => {
  const [listProducts, setListProducts] = useState([]);
  const [ListBrands, setListBrands] = useState([]);
  const [ListCategories, setListCategories] = useState([]);

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);

  useEffect(() => {
    const fetchdata = async () => {
      await dispatch(fetchProducts());
    };
    fetchdata();
  }, []);

  // console.log('products data: ', products);

  useEffect(() => {
    if (products && products.products && products.products.length > 0) {
      setListProducts(products.products);
    }
  }, [products]);

  useEffect(() => {
    const fetchdata = async () => {
      const result = await getAllBrands();
      const cate = await getAllCategories();
      if (result) {
        setListBrands(result);
      }
      if (cate) {
        setListCategories(cate);
      }
    };
    fetchdata();
  }, []);

  // console.log('listProducts', listProducts);
  // console.log('ListBrands', ListBrands);

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

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');

  const handleOpenDialog = (product = null) => {
    setSelectedProduct(product);
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        quantity: product.quantity || '',
        description: product.description || '',
        discount: product.discount || '',
        brand: product.brand ? product.brand._id : '',
        size: product.size || [],
        category: product.category ? product.category._id : '',
        assets: product.assets || []
      });
    } else {
      setFormData({
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
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = () => {
    if (selectedProduct) {
      setListProducts(listProducts.map((p) => (p._id === selectedProduct._id ? { ...formData, _id: p._id } : p)));
    } else {
      setListProducts([...listProducts, { ...formData, _id: listProducts.length + 1 }]);
    }
    handleCloseDialog();
  };

  const handleDeleteProduct = (id) => {
    setListProducts(listProducts.filter((product) => product._id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, assets: files });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      assets: [...prev.assets.filter((file) => file.type.startsWith('video/') || file.type.startsWith('image/')), ...files]
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        assets: [...prev.assets.filter((file) => file.type.startsWith('video/')), file]
      }));
    }
  };

  const filteredProducts = listProducts.filter((product) => {
    const matchesPrice = (minPrice === '' || product.price >= minPrice) && (maxPrice === '' || product.price <= maxPrice);
    const matchesCategory = category === '' || product.category === category;
    const matchesStockStatus =
      stockStatus === '' ||
      (stockStatus === 'in-stock' && product.quantity > 0) ||
      (stockStatus === 'out-of-stock' && product.quantity === 0);
    return matchesPrice && matchesCategory && matchesStockStatus;
  });

  console.log('filteredProducts', filteredProducts);

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
              <TableCell>Thương hiệu</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Đã bán</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts ? (
              filteredProducts.map((product, index) => (
                <TableRow key={product._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.category ? product.category.name : 'Không có danh mục'}</TableCell>
                  <TableCell>{product.brand ? product.brand.name : 'Không có thương hiệu'}</TableCell>
                  <TableCell>
                    {product.size && product.size.length > 0
                      ? product.size.map((s, index) => (
                          <span key={s._id}>
                            {s.name}
                            {index < product.size.length - 1 && ', '}
                          </span>
                        ))
                      : 'Không có kích thước'}
                  </TableCell>
                  <TableCell>{product.sold}</TableCell>
                  <TableCell>{product.status}</TableCell>
                  {/* <TableCell>{product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}</TableCell> */}
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleOpenDialog(product)} style={{ marginRight: 10 }}>
                      Chỉnh sửa
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleDeleteProduct(product.id)}>
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent>
          <TextField label="Tên sản phẩm" name="name" fullWidth margin="normal" value={formData.name} onChange={handleInputChange} />
          <TextField label="Giá" name="price" fullWidth margin="normal" type="number" value={formData.price} onChange={handleInputChange} />
          <TextField
            label="Số lượng"
            name="quantity"
            fullWidth
            margin="normal"
            type="number"
            value={formData.quantity}
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

          <div style={{ display: 'flex', marginTop: 20 }}>
            {/* Input cho hình ảnh */}
            <label htmlFor="image-upload" style={{ display: 'block', marginRight: 10 }}>
              <Button variant="outlined" component="span">
                Chọn ảnh
              </Button>
              <input id="image-upload" type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
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
