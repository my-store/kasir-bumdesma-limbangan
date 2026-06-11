import { indexOf } from "./helper/calendar";
import * as request from "./request";

export const GetAsetTetap = async (workTime) => {
  const _getData = await request.post("/db/get", {
    db: "AsetTetap",
    options: {
      filter: {
        timestamp: {
          // Ambil data dari tahun ini (workTime) kebawah
          tahun: {
            $lte: workTime.tahun,
          },
        },
      },
      // order: "DESC",
    },
  });

  // Prepare default response data
  let response = { data: [], perolehan: 0 };

  for (let data of _getData) {
    // Tahun ini
    if (data.timestamp.tahun == workTime.tahun) {
      // Produk lebih baru daripada worktime (beda bulan)
      const step1 = indexOf(data.timestamp.bulan) > indexOf(workTime.bulanIni);
      if (step1) {
        continue;
      } else {
        // Poduk ditambahkan bulan ini, tapi tanggal lebih baru dari worktime
        if (data.timestamp.bulan == workTime.bulanIni) {
          const step2 = data.timestamp.tanggal > workTime.tanggal;
          if (step2) {
            continue;
          }
        }
      }
    }

    // Push data
    await response.data.push(data);

    // Icrease perolehan
    response.perolehan += parseInt(data.nominal);
  }

  // Return the response
  return response;
};

// Insert
export const InsertAsetTetap = async (data) =>
  await request.post("/db/insert", { db: "AsetTetap", data });

// Update
export const UpdateAsetTetap = async (data) =>
  await request.post("/db/update", { db: "AsetTetap", data });

// Get one
export const GetOneAsetTetap = async (options) =>
  await request.post("/db/getone", {
    db: "AsetTetap",
    options,
  });

// Delete data
export const DeleteAsetTetap = async (data) =>
  await request.post("/db/delete", { db: "AsetTetap", data });
