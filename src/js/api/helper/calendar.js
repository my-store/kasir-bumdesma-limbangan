export function setTime({ month, year }) {
  const d = new Date(parseInt(year), parseInt(month));

  // Bulan ini
  const bulanIni = d.toLocaleString("id-ID", { month: "long" });

  // Bulan lalu
  d.setMonth(parseInt(month) - 1);
  const bulanLalu = d.toLocaleString("id-ID", { month: "long" });

  return { bulanIni, bulanLalu, tahun: year };
}

export async function reloadTime() {
  let jam = "",
    menit = "",
    detik = "",
    hari = "",
    tanggal = "",
    bulan = "",
    tahun = "";
  await getDetail("Jam", (getJam) => (jam = getJam));
  await getDetail("Menit", (getMenit) => (menit = getMenit));
  await getDetail("Detik", (getDetik) => (detik = getDetik));
  await getDetail("Hari", (getHari) => (hari = getHari));
  await getDetail("Tanggal", (getTanggal) => (tanggal = getTanggal));
  await getDetail("Bulan", (getBulan) => (bulan = getBulan));
  await getDetail("Tahun", (getTahun) => (tahun = getTahun));
  return { jam, menit, detik, hari, tanggal, bulan, tahun, format: "WIB" };
}

export function getThisMonth(y, m) {
  const date = new Date(y, m);
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  return {
    awal: {
      hari: firstDay.toLocaleString("id-ID", { weekday: "long" }),
      tanggal: firstDay.toLocaleString("id-ID", { day: "numeric" }),
      bulan: firstDay.toLocaleString("id-ID", { month: "long" }),
    },
    sekarang: {
      hari: date.toLocaleString("id-ID", { weekday: "long" }),
      tanggal: date.toLocaleString("id-ID", { day: "numeric" }),
      bulan: date.toLocaleString("id-ID", { month: "long" }),
    },
    akhir: {
      hari: lastDay.toLocaleString("id-ID", { weekday: "long" }),
      tanggal: lastDay.toLocaleString("id-ID", { day: "numeric" }),
      bulan: lastDay.toLocaleString("id-ID", { month: "long" }),
    },
    tahun: firstDay.toLocaleString("id-ID", { year: "numeric" }),
  };
}

export function indexOf(params) {
  let index = null;
  switch (params) {
    case "Januari":
      index = 0;
      break;

    case "Februari":
      index = 1;
      break;

    case "Maret":
      index = 2;
      break;

    case "April":
      index = 3;
      break;

    case "Mei":
      index = 4;
      break;

    case "Juni":
      index = 5;
      break;

    case "Juli":
      index = 6;
      break;

    case "Agustus":
      index = 7;
      break;

    case "September":
      index = 8;
      break;

    case "Oktober":
      index = 9;
      break;

    case "November":
      index = 10;
      break;

    case "Desember":
      index = 11;
      break;
  }
  return index;
}

export function getDetail(getParams, callback, getUrutan = null) {
  const date = new Date();
  let tahun = date.getFullYear();
  let bulan = date.getMonth();
  let tanggal = date.getDate();
  let hari = date.getDay();
  let jam = date.getHours();
  let menit = date.getMinutes();
  let detik = date.getSeconds();

  switch (hari) {
    case 0:
      hari = "Minggu";
      break;

    case 1:
      hari = "Senin";
      break;

    case 2:
      hari = "Selasa";
      break;

    case 3:
      hari = "Rabu";
      break;

    case 4:
      hari = "Kamis";
      break;

    case 5:
      hari = "Jumat";
      break;

    case 6:
      hari = "Sabtu";
      break;
  }
  switch (bulan) {
    case 0:
      bulan = "Januari";
      break;

    case 1:
      bulan = "Februari";
      break;

    case 2:
      bulan = "Maret";
      break;

    case 3:
      bulan = "April";
      break;

    case 4:
      bulan = "Mei";
      break;

    case 5:
      bulan = "Juni";
      break;

    case 6:
      bulan = "Juli";
      break;

    case 7:
      bulan = "Agustus";
      break;

    case 8:
      bulan = "September";
      break;

    case 9:
      bulan = "Oktober";
      break;

    case 10:
      bulan = "November";
      break;

    case 11:
      bulan = "Desember";
      break;
  }

  var data =
    getParams == "Detik"
      ? detik
      : getParams == "Menit"
      ? menit
      : getParams == "Jam"
      ? jam
      : getParams == "Hari"
      ? hari
      : getParams == "Tanggal"
      ? tanggal
      : getParams == "Bulan"
      ? bulan
      : getParams == "Tahun"
      ? tahun
      : null;

  var urutan =
    getParams == "Bulan"
      ? bulan == "Januari"
        ? 1
        : bulan == "Februari"
        ? 2
        : bulan == "Maret"
        ? 3
        : bulan == "April"
        ? 4
        : bulan == "Mei"
        ? 5
        : bulan == "Juni"
        ? 6
        : bulan == "Juli"
        ? 7
        : bulan == "Agustus"
        ? 8
        : bulan == "September"
        ? 9
        : bulan == "Oktober"
        ? 10
        : bulan == "November"
        ? 11
        : bulan == "Desember"
        ? 12
        : null
      : getParams == "Hari"
      ? hari == "Minggu"
        ? 1
        : hari == "Senin"
        ? 2
        : hari == "Selasa"
        ? 3
        : hari == "Rabu"
        ? 4
        : hari == "Kamis"
        ? 5
        : hari == "Jumat"
        ? 6
        : hari == "Sabtu"
        ? 7
        : null
      : null;
  callback(getUrutan == null ? data : urutan);
}
