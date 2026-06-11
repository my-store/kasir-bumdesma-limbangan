import { BiAlarm, BiBrushAlt } from "react-icons/bi";
import { AiOutlineWhatsApp } from "react-icons/ai";
import "../../scss/templates/footer.scss";
import { FaHome } from "react-icons/fa";
import React from "react";

export default function Footer({ workTime, openWorkTime, openColorPicker }) {
  return (
    <div className="footer">
      <div className="footer-left">
        <h1 className="footer-head">DEVELOPED BY PERMATA KOMPUTER</h1>
        <div className="github">
          <FaHome size={16} style={{ marginRight: 3, marginLeft: 3 }} />
          <p className="text">Bentarsari, Salem Brebes Jawa tengah</p>
        </div>
        <div className="phone">
          <AiOutlineWhatsApp
            size={16}
            style={{ marginRight: 3, marginLeft: 3 }}
          />
          <p className="text">0823-2438-0852</p>
        </div>
      </div>
      <div className="footer-right">
        <p className="footer-theme" onClick={openColorPicker}>
          <BiBrushAlt size={17} style={{ marginRight: 3 }} />
          Warna
        </p>
        <p className="footer-worktime" onClick={openWorkTime}>
          <BiAlarm size={17} style={{ marginRight: 3 }} />
          {workTime != null
            ? workTime.hari +
              ", " +
              workTime.tanggal +
              " " +
              workTime.bulanIni +
              " " +
              workTime.tahun
            : null}
        </p>
      </div>
    </div>
  );
}
