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
  InputLabel,
  FormControlLabel,
  Checkbox,
  FormLabel,
  Input
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from 'redux/thunks/productsThunk';
import { getAllBrands, getAllCategories, getAllSizes } from 'api/getAllData';
import { addProduct, updateProduct } from 'api/products';

const Typography = () => {
  const [listProducts, setListProducts] = useState([]);
  const [ListBrands, setListBrands] = useState([]);
  const [ListCategories, setListCategories] = useState([]);
  const [ListSizes, setListSizes] = useState([]);

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

  // console.log('listProducts', listProducts);
  // console.log('ListBrands', ListBrands);
  // console.log('ListSizes', ListSizes);

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
  const [brands, setBrands] = useState('');
  const [stockStatus, setStockStatus] = useState('');

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

  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dt7755ppx/upload`;
  const cloudinaryUploadPreset = 'shoe_mate_shop';

  const uploadToCloundinary = async (file) => {
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', cloudinaryUploadPreset);
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data
      });
      const result = await response.json();
      console.log(result);
      return result.secure_url;
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = async (e) => {
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

    // console.log('Images upload: ', uploadedAssets);

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

  const filteredProducts = listProducts.filter((product) => {
    const matchesPrice = (minPrice === '' || product.price >= minPrice) && (maxPrice === '' || product.price <= maxPrice);
    const matchesCategory = category === '' || product.category._id === category;
    const matchesBrands = brands === '' || product.brand._id === brands;
    const matchesStockStatus =
      stockStatus === '' ||
      (stockStatus === 'in-stock' && product.quantity > 0) ||
      (stockStatus === 'out-of-stock' && product.quantity === 0);
    return matchesPrice && matchesCategory && matchesBrands && matchesStockStatus;
  });

  console.log('filteredProducts', filteredProducts);
  // console.log('assets', formData.assets);

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
        return { ...size, quantity: value }; // Update quantity for the selected size
      }
      return size;
    });
    setFormData({ ...formData, size: newSizes });
  };

  return (
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
          <Select name="category" value={brands} onChange={(e) => setBrands(e.target.value)}>
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
            {filteredProducts ? (
              filteredProducts.map((product, index) => (
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent>
          <TextField label="Tên sản phẩm" name="name" fullWidth margin="normal" value={formData.name} onChange={handleInputChange} />
          <TextField label="Giá" name="price" fullWidth margin="normal" type="number" value={formData.price} onChange={handleInputChange} />
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
  );
};

export default Typography;
