import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import dayjs from "dayjs";

XLSX.set_fs(fs);

const ORIGIN_FILEPATH =
  "/Users/gihyeon.lee/Downloads/20221028_주문서확인처리_마진관리용_양식(스스).xlsx";

const pickByOrderState = (list, values) =>
  list.filter((item) => values.includes(item["주문상태"]));

const setZeroAboutDeliveryDataByOrderId = (list) => {
  const orderIdSet = new Set();

  return list.map((item) => {
    let extraValues = {};
    if (orderIdSet.has(item["쇼핑몰주문번호"])) {
      extraValues = {
        배송비: 0,
        "공급 택배비": 0,
      };
    } else {
      orderIdSet.add(item["쇼핑몰주문번호"]);
    }

    return {
      ...item,
      ...extraValues,
    };
  });
};

const splitByTraditionalWineAndRestOrders = (list) => {
  const traditionalWineOrders = [];

  const rest = list.filter((item) => {
    if (item["매입처명"].includes("[전통주]")) {
      traditionalWineOrders.push(item);
      return false;
    }

    return true;
  });

  return { traditionalWineOrders, restOrders: rest };
};

const genRestOrderSheet = (list) => {
  const channel = {
    "11번가": {
      commission: 0.12,
      deliveryCommission: 0,
    },
    배달의민족: {
      commission: 0.1,
      deliveryCommission: 0,
    },
    "배민(별미)": {
      commission: 0.1,
      deliveryCommission: 0,
    },
    스마트스토어: {
      commission: 0.05,
      deliveryCommission: 0.05,
    },
    "신세계몰(신)": {
      commission: 0.2,
      deliveryCommission: 0,
    },
    카카오_선물하기: {
      commission: 0.15,
      deliveryCommission: 0,
    },
    카카오_톡스토어: {
      commission: 0.04,
      deliveryCommission: 0,
    },
    쿠팡: {
      commission: 0.12,
      deliveryCommission: 0,
    },
    "홈&쇼핑": {
      commission: 0.3,
      deliveryCommission: 0,
    },
    ESM옥션: {
      commission: 0.12,
      deliveryCommission: 0,
    },
    ESM지마켓: {
      commission: 0.12,
      deliveryCommission: 0,
    },
    티몬: {
      commission: 0.1,
      deliveryCommission: 0,
    },
  };

  const data = list.map((item, i) => {
    const c = channel[item["쇼핑몰명"]];
    const rowNumber = i + 2;
    const __c = c?.commission > 0 ? 1 - c.commission : 1;
    const __dc = c?.deliveryCommission > 0 ? 1 - c.deliveryCommission : 1;

    return {
      ...item,
      "총 결제금액": { t: "n", f: `G${rowNumber}*I${rowNumber}` },
      "총 공급가": { t: "n", f: `K${rowNumber}*I${rowNumber}` },
      마진액: {
        t: "n",
        f: `((H${rowNumber}*${__c})-L${rowNumber})+((J${rowNumber}*${__dc})-M${rowNumber})`,
      },
      마진율: { t: "n", f: `N${rowNumber}/H${rowNumber}` },
    };
  });

  return XLSX.utils.json_to_sheet(data);
};

const genTraditionalWineOrderSheet = (list) => {
  const data = list.map((item, i) => {
    const rowNumber = i + 2;
    let marginConst = 0.1;

    if (item["매입처명"] === "[전통주]명인안동소주") {
      if (item["쇼핑몰명"] === "11번가") {
        marginConst = 0.03;
      } else if (
        [
          "스마트스토어",
          "카카오_선물하기",
          "카카오_톡스토어",
          "ESM옥션",
          "ESM지마켓",
        ].indexOf(item["쇼핑몰명"]) >= 0
      ) {
        marginConst = 0.045;
      }
    }

    return {
      ...item,
      "총 결제금액": { t: "n", f: `G${rowNumber}*E${rowNumber}` },
      "총 공급가": { t: "n", f: `G${rowNumber}*I${rowNumber}` },
      마진액: { t: "n", f: `J${rowNumber}*${marginConst}` },
      마진율: { t: "n", f: `L${rowNumber}/F${rowNumber}` },
    };
  });

  return XLSX.utils.json_to_sheet(data);
};

const main = async () => {
  const wb = XLSX.readFileSync(ORIGIN_FILEPATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const { traditionalWineOrders, restOrders } =
    splitByTraditionalWineAndRestOrders(
      setZeroAboutDeliveryDataByOrderId(
        pickByOrderState(XLSX.utils.sheet_to_json(ws), ["주문확인", "출고대기"])
      )
    );

  const newWb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    newWb,
    genRestOrderSheet(restOrders),
    "전통주 제외"
  );
  XLSX.utils.book_append_sheet(
    newWb,
    genTraditionalWineOrderSheet(traditionalWineOrders),
    "전통주"
  );
  XLSX.writeFile(
    newWb,
    `${dayjs().subtract("1", "day").format("YYYYMMDD")} 마진자동화 결과.xlsx`
  );
};

main()
  .then(() => {
    console.log("Done!");
  })
  .catch((err) => {
    console.log("Error!", err);
  });
