import { HexColorPicker } from "react-colorful";
import "../../scss/templates/color-picker.scss";
import React from "react";

export default function ColorPicker(props) {
  const {
    theme,
    changeTheme,
    prepareTheme,
    removeColorPicker,
    openColorPicker,
  } = props;

  return (
    <div
      className={
        openColorPicker ? "color-picker color-picker-active" : "color-picker"
      }
    >
      <div className="color-picker-box">
        <h1 style={{ backgroundColor: theme }} className="color-picker-title">
          PILIH WARNA
        </h1>
        <div className="form-group">
          <HexColorPicker
            color={theme}
            style={{ width: "100%" }}
            onChange={(value) => prepareTheme(value)} // Ganti warna pada state (ROOT/index.js)
          />
        </div>
        <div className="form-group form-btns">
          <button
            onClick={async () => {
              // Save before close
              await changeTheme(theme);

              // Tutup modal-box
              removeColorPicker();
            }}
            type="button"
          >
            Oke
          </button>
        </div>
      </div>
    </div>
  );
}
