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
  title: yup.string().required("Product title is required"),
  description: yup
    .string()
    .required("Description is required")
    .test("not-empty-html", "Description is required", (val) =>
      val ? val.replace(/<[^>]*>/g, "").trim().length > 0 : false
    ),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  brand: yup.string().required("Brand is required"),
  category: yup.string().required("Category is required"),
  tags: yup.string().required("Tag is required"),
  color: yup
    .array()
    .min(1, "Please select at least one color"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  images: yup
    .array()
    .min(1, "Please add at least one product image"),
});

// Helper: red error text under a field
const FieldError = ({ name, formik }) =>
  formik.touched[name] && formik.errors[name] ? (
    <div className="field-error">{formik.errors[name]}</div>
  ) : null;

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

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
  }, []);

  useEffect(() => {
    if (getProductId) {
      dispatch(getAProduct(getProductId));
    } else {
      dispatch(resetState());
    }
  }, [getProductId]);

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
      dispatch(resetState());
      navigate("/admin/list-product");
    }
  }, [isSuccess, updatedProduct]);

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

  useEffect(() => {
    if (productImages) {
      setImages(productImages.map((img) => ({ url: img.url })));
    }
  }, [productImages]);

  useEffect(() => {
    if (productColors) {
      setColor(productColors.map((c) => c._id));
    }
  }, [productColors]);

  useEffect(() => {
    formik.setFieldValue("images", images);
  }, [images]);

  useEffect(() => {
    formik.setFieldValue("color", color);
  }, [color]);

  const coloropt = colorState.map((i) => ({
    label: (
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: i.title,
          borderRadius: "50%",
        }}
      />
    ),
    value: i._id,
  }));

  return (
    <div>
      <h3 className="mb-4 title">{getProductId ? "Edit" : "Add"} Product</h3>

      <form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-3">
        {/* Title */}
        <div>
          <CustomInput
            type="text"
            label="Enter Product Title *"
            name="title"
            val={formik.values.title}
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
          />
          <FieldError name="title" formik={formik} />
        </div>

        {/* Description */}
        <div>
          <label className="field-label">Description *</label>
          <ReactQuill
            theme="snow"
            value={formik.values.description}
            onChange={(value) => {
              formik.setFieldValue("description", value);
              formik.setFieldTouched("description", true, false);
            }}
          />
          <FieldError name="description" formik={formik} />
        </div>

        {/* Price */}
        <div>
          <CustomInput
            type="number"
            label="Enter Product Price *"
            name="price"
            val={formik.values.price}
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
          />
          <FieldError name="price" formik={formik} />
        </div>

        {/* Brand */}
        <div>
          <label className="field-label">Brand *</label>
          <select
            name="brand"
            value={formik.values.brand}
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            className={`form-control${
              formik.touched.brand && formik.errors.brand ? " is-invalid" : ""
            }`}
          >
            <option value="">Select Brand</option>
            {brandState.map((i) => (
              <option key={i._id} value={i.title}>
                {i.title}
              </option>
            ))}
          </select>
          <FieldError name="brand" formik={formik} />
        </div>

        {/* Category */}
        <div>
          <label className="field-label">Category *</label>
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            className={`form-control${
              formik.touched.category && formik.errors.category ? " is-invalid" : ""
            }`}
          >
            <option value="">Select Category</option>
            {catState.map((i) => (
              <option key={i._id} value={i.title}>
                {i.title}
              </option>
            ))}
          </select>
          <FieldError name="category" formik={formik} />
        </div>

        {/* Tags */}
        <div>
          <label className="field-label">Tag *</label>
          <select
            name="tags"
            value={formik.values.tags}
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            className={`form-control${
              formik.touched.tags && formik.errors.tags ? " is-invalid" : ""
            }`}
          >
            <option value="">Select Tag</option>
            <option value="featured">Featured</option>
            <option value="popular">Popular</option>
            <option value="special">Special</option>
          </select>
          <FieldError name="tags" formik={formik} />
        </div>

        {/* Colors */}
        <div>
          <label className="field-label">Colors * <span style={{fontWeight:400, fontSize:11}}>(select at least one)</span></label>
          <Select
            mode="multiple"
            className="w-100"
            placeholder="Select colors"
            value={formik.values.color}
            onChange={(val) => {
              setColor(val);
              formik.setFieldTouched("color", true, false);
            }}
            onBlur={() => formik.setFieldTouched("color", true)}
            options={coloropt}
          />
          {formik.touched.color && formik.errors.color && (
            <div className="field-error">{formik.errors.color}</div>
          )}
        </div>

        {/* Quantity */}
        <div>
          <CustomInput
            type="number"
            label="Enter Product Quantity *"
            name="quantity"
            val={formik.values.quantity}
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
          />
          <FieldError name="quantity" formik={formik} />
        </div>

        {/* Image URL */}
        <div>
          <label className="field-label">Product Images * <span style={{fontWeight:400, fontSize:11}}>(add at least one)</span></label>
          <div className="d-flex gap-2">
            <input
              type="text"
              placeholder="Paste image URL and click Add"
              className="form-control"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onBlur={() => formik.setFieldTouched("images", true)}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (imageUrl.trim()) {
                  setImages([...images, { url: imageUrl.trim() }]);
                  setImageUrl("");
                  formik.setFieldTouched("images", true, false);
                } else {
                  toast.warning("Please enter an image URL first");
                }
              }}
            >
              Add
            </button>
          </div>
          {formik.touched.images && formik.errors.images && (
            <div className="field-error">{formik.errors.images}</div>
          )}
          {images.length === 0 && !formik.touched.images && (
            <p className="field-hint mt-1">No images added yet.</p>
          )}
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="d-flex gap-3 flex-wrap">
            {images.map((img, i) => (
              <div key={i} className="position-relative">
                <button
                  type="button"
                  className="btn-close position-absolute"
                  style={{ top: 4, right: 4, zIndex: 1 }}
                  onClick={() =>
                    setImages(images.filter((_, index) => index !== i))
                  }
                />
                <img
                  src={img.url}
                  width={120}
                  height={120}
                  alt={`preview-${i}`}
                  style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0" }}
                />
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="btn btn-success border-0 rounded-3 py-2">
          {getProductId ? "Update" : "Add"} Product
        </button>
      </form>
    </div>
  );
};

export default Addproduct;
