import React from "react";

const Color = (props) => {
  const { colorData, setColor, selectedColor } = props;
  return (
    <>
      <ul className="colors ps-0">
        {colorData &&
          colorData?.map((item, index) => {
            const isSelected = selectedColor === item?._id;
            return (
              <li
                onClick={() => setColor(item?._id)}
                style={{ backgroundColor: item?.title }}
                className={`color-swatch${isSelected ? " color-selected" : ""}`}
                key={index}
                title={item?.title}
              />
            );
          })}
      </ul>
    </>
  );
};

export default Color;
