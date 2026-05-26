import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import BlogCard from "../components/BlogCard";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import moment from "moment";

const Blog = () => {
  const blogState = useSelector((state) => state?.blog?.blog);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (blogState) {
      const uniqueCategories = [...new Set(blogState.map((blog) => blog.category))].filter(Boolean);
      setCategories(uniqueCategories);
    }
  }, [blogState]);

  const dispatch = useDispatch();
  useEffect(() => {
    getblogs();
  }, []);
  const getblogs = () => {
    dispatch(getAllBlogs());
  };

  return (
    <>
      <Meta title={"Blogs"} />
      <BreadCrumb title="Blogs" />
      <Container class1="blog-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12 col-md-3">
            <div className="filter-card mb-3">
              <h3 className="filter-title">Find By Categories</h3>
              <div>
                <ul className="ps-0">
                  <li
                    className="mb-2"
                    onClick={() => setCategory(null)}
                    style={{ cursor: "pointer", color: category === null ? "var(--color-febd69)" : "var(--color-777777)" }}
                  >
                    All
                  </li>
                  {categories &&
                    categories.map((item, index) => (
                      <li
                        key={index}
                        className="text-capitalize mb-2"
                        onClick={() => setCategory(item)}
                        style={{ cursor: "pointer", color: category === item ? "var(--color-febd69)" : "var(--color-777777)" }}
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-9 mt-4 mt-md-0">
            <div className="row">
              {blogState &&
                blogState
                  ?.filter((item) => category === null || item.category === category)
                  ?.map((item, index) => {
                  return (
                    <div className="col-12 col-md-6 mb-3" key={index}>
                      <BlogCard
                        id={item?._id}
                        title={item?.title}
                        description={item?.description}
                        image={item?.images[0]?.url}
                        date={moment(item?.createdAt).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Blog;
