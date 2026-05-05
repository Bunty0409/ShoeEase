import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useLocation, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import {
  createProducts,
  getAProduct,
  resetState,
  updateAProduct,
} from "../features/product/productSlice";

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  brand: yup.string().required("Brand is Required"),
  category: yup.string().required("Category is Required"),
  tags: yup.string().required("Tag is Required"),
  // color: yup.array().min(1, "Pick at least one color"),
  color: yup.array().notRequired(), // color is optional now
  quantity: yup.number().required("Quantity is Required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const getProductId = location.pathname.split("/")[3];

  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [color, setColor] = useState([]);

  // Redux state
  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const newProduct = useSelector((state) => state.product);

  const {
    isSuccess,
    isError,
    createdProduct,
    updatedProduct,
    productName,
    productDesc,
    productPrice,
    productBrand,
    productCategory,
    productTag,
    productColors,
    productQuantity,
    productImages,
  } = newProduct;

  // Load dropdown data
  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
  }, []);

  // Fetch product if editing
  useEffect(() => {
    if (getProductId) {
      dispatch(getAProduct(getProductId));
    } else {
      dispatch(resetState());
    }
  }, [getProductId]);

  // ─── Success / Error Handling ───────────────────────────────────────────
  //
  // BUG FIX: Two problems caused "can't re-open Edit after first update":
  //
  // 1. resetState() was never dispatched after updateAProduct succeeded, so
  //    `updatedProduct` and `isSuccess` stayed truthy in Redux indefinitely.
  //
  // 2. When the user navigated back to the list and clicked Edit again,
  //    Addproduct mounted, `getAProduct` resolved (setting isSuccess=true),
  //    and this useEffect immediately saw isSuccess && updatedProduct === truthy
  //    → it called navigate() again before the form ever rendered.
  //
  // Fix: dispatch resetState() BEFORE navigating so Redux is clean for the
  // next visit. Also track `updatedProduct` directly in the dep array so
  // the effect only fires when it genuinely changes.
  useEffect(() => {
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfully!");
    }
  }, [isSuccess, createdProduct]);

  useEffect(() => {
    if (isSuccess && updatedProduct) {
      toast.success("Product Updated Successfully!");
      // Clear Redux state FIRST so stale flags don't trigger redirect on next visit
      dispatch(resetState());
      navigate("/admin/list-product");
    }
  }, [isSuccess, updatedProduct]);

  // Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: productName || "",
      description: productDesc || "",
      price: productPrice || "",
      brand: productBrand || "",
      category: productCategory || "",
      tags: productTag || "",
      color: productColors?.map((c) => c._id) || [],
      quantity: productQuantity || "",
      images: productImages || [],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getProductId) {
        dispatch(updateAProduct({ id: getProductId, productData: values }));
        // Note: toast is shown by the useEffect above once Redux confirms success
      } else {
        dispatch(createProducts(values));
        formik.resetForm();
        setImages([]);
        setColor([]);
        setTimeout(() => {
          dispatch(resetState());
        }, 3000);
      }
    },
  });

  // Prefill images
  useEffect(() => {
    if (productImages) {
      setImages(productImages.map((img) => ({ url: img.url })));
    }
  }, [productImages]);

  // Prefill colors
  useEffect(() => {
    if (productColors) {
      setColor(productColors.map((c) => c._id));
    }
  }, [productColors]);

  // Sync images to formik
  useEffect(() => {
    formik.setFieldValue("images", images);
  }, [images]);

  // Sync colors
  useEffect(() => {
    formik.setFieldValue("color", color);
  }, [color]);

  // Color options
  const coloropt = colorState.map((i) => ({
    label: (
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: i.title,
          borderRadius: "50%",
        }}
      ></div>
    ),
    value: i._id,
  }));

  return (
    <div>
      <h3 className="mb-4 title">{getProductId ? "Edit" : "Add"} Product</h3>

      <form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-3">
        <CustomInput
          type="text"
          label="Enter Product Title"
          name="title"
          val={formik.values.title}
          onChng={formik.handleChange("title")}
          onBlr={formik.handleBlur("title")}
        />

        <ReactQuill
          theme="snow"
          value={formik.values.description}
          onChange={(value) => formik.setFieldValue("description", value)}
        />

        <CustomInput
          type="number"
          label="Enter Product Price"
          name="price"
          val={formik.values.price}
          onChng={formik.handleChange("price")}
          onBlr={formik.handleBlur("price")}
        />

        {/* Brand */}
        <select
          name="brand"
          value={formik.values.brand}
          onChange={formik.handleChange("brand")}
          className="form-control"
        >
          <option value="">Select Brand</option>
          {brandState.map((i) => (
            <option key={i._id} value={i.title}>
              {i.title}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange("category")}
          className="form-control"
        >
          <option value="">Select Category</option>
          {catState.map((i) => (
            <option key={i._id} value={i.title}>
              {i.title}
            </option>
          ))}
        </select>

        {/* Tags */}
        <select
          name="tags"
          value={formik.values.tags}
          onChange={formik.handleChange("tags")}
          className="form-control"
        >
          <option value="">Select Tag</option>
          <option value="featured">Featured</option>
          <option value="popular">Popular</option>
          <option value="special">Special</option>
        </select>

        {/* Colors */}
        <Select
          mode="multiple"
          className="w-100"
          placeholder="Select colors"
          value={formik.values.color}
          onChange={(val) => setColor(val)}
          options={coloropt}
        />

        <CustomInput
          type="number"
          label="Enter Product Quantity"
          name="quantity"
          val={formik.values.quantity}
          onChng={formik.handleChange("quantity")}
        />

        {/* Image URL */}
        <div>
          <input
            type="text"
            placeholder="Enter Image URL"
            className="form-control mb-2"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (imageUrl) {
                setImages([...images, { url: imageUrl }]);
                setImageUrl("");
              }
            }}
          >
            Add Image
          </button>
        </div>

        {/* Preview */}
        <div className="d-flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <div key={i} className="position-relative">
              <button
                type="button"
                className="btn-close position-absolute"
                onClick={() =>
                  setImages(images.filter((_, index) => index !== i))
                }
              ></button>
              <img src={img.url} width={200} height={200} alt="" />
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-success">
          {getProductId ? "Update" : "Add"} Product
        </button>
      </form>
    </div>
  );
};

export default Addproduct;
