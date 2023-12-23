import dayjs from "dayjs";
import { ChangeEvent, useRef } from "react";
import * as XLSX from "xlsx";

const pickByOrderState = (list: any, values: any) => list.filter((item: any) => values.includes(item['주문상태']));

const setZeroAboutDeliveryDataByOrderId = (list: any) => {
  const orderIdAndStoreNameSet = new Set();

  return list.map((item: any) => {
    let extraValues = {};
    const key = `${item['쇼핑몰주문번호']}_${item['매입처명']}`;
    if (orderIdAndStoreNameSet.has(key)) {
      extraValues = {
        '배송비': 0,
        '공급 택배비': 0,
      };
    } else {
      orderIdAndStoreNameSet.add(key);
    }

    return {
      ...item,
      ...extraValues,
    }
  });
};

const splitByTraditionalWineAndRestOrders = (list: any) => {
  const traditionalWineOrders: any = [];

  const rest = list.filter((item: any) => {
    if (item['매입처명'].includes('[전통주]')) {
      traditionalWineOrders.push(item);
      return false;
    }

    return true;
  });

  return { traditionalWineOrders, restOrders: rest };
}

const genRestOrderSheet = (list: any) => {
  const channel = {
    '11번가': {
      commission: 0.12,
      deliveryCommission: 0,
    },
    '배달의민족': {
      commission: 0.10,
      deliveryCommission: 0,
    },
    '배민(별미)': {
      commission: 0.10,
      deliveryCommission: 0,
    },
    '스마트스토어': {
      commission: 0.05,
      deliveryCommission: 0.05,
    },
    'N도착보장': {
      commission: 0.05,
      deliveryCommission: 0.05,
    },
    '신세계몰(신)': {
      commission: 0.20,
      deliveryCommission: 0,
    },
    '카카오_선물하기': {
      commission: 0.15,
      deliveryCommission: 0,
    },
    '카카오_톡스토어': {
      commission: 0.04,
      deliveryCommission: 0,
    },
    '쿠팡': {
      commission: 0.12,
      deliveryCommission: 0,
    },
    '홈&쇼핑': {
      commission: 0.30,
      deliveryCommission: 0,
    },
    'ESM옥션': {
      commission: 0.12,
      deliveryCommission: 0,
    },
    'ESM지마켓': {
      commission: 0.12,
      deliveryCommission: 0,
    },
    '티몬': {
      commission: 0.1,
      deliveryCommission: 0,
    },
    '현대홈쇼핑(신)': {
      commission: 0.25,
      deliveryCommission: 0,
    }
  };

  const data = list.map((item: any, i: number) => {
    // @ts-ignore
    const c = channel[item['쇼핑몰명']];
    const rowNumber = i + 2;
    const __c = c?.commission > 0 ? 1 - c.commission : 1;
    const __dc = c?.deliveryCommission > 0 ? 1 - c.deliveryCommission : 1;

    return {
      ...item,
      '총 결제금액': { t: 'n', f: `G${rowNumber}*I${rowNumber}` },
      '총 공급가': { t: 'n', f: `K${rowNumber}*I${rowNumber}` },
      '마진액': { t: 'n', f: `((H${rowNumber}*${__c})-L${rowNumber})+((J${rowNumber}*${__dc})-M${rowNumber})` },
      '마진율': { t: 'n', f: `N${rowNumber}/H${rowNumber}` },
    };
  });

  return XLSX.utils.json_to_sheet(data);
};

const genTraditionalWineOrderSheet = (list: any) => {
  const data = list.map((item: any, i: number) => {
    const rowNumber = i + 2;
    let marginConst = 0.1;

    if (item['매입처명'] === '[전통주]명인안동소주') {
      if (item['쇼핑몰명'] === '11번가') {
        marginConst = 0.03;
      } else if([
        '스마트스토어',
        '카카오_선물하기',
        '카카오_톡스토어',
        'ESM옥션',
        'ESM지마켓',
        'N도착보장'
      ].indexOf(item['쇼핑몰명']) >= 0) {
        marginConst = 0.045;
      }
    }

    return {
      ...item,
      '총 결제금액': { t: 'n', f: `G${rowNumber}*I${rowNumber}` }, // 결제금액 x 수량
      '총 공급가': { t: 'n', f: `K${rowNumber}*I${rowNumber}` }, // 공급가(이카운트) x 수량
      '마진액': { t: 'n', f: `L${rowNumber}*${marginConst}` }, //  총 공급가 x marginConst
      '마진율': { t: 'n', f: `N${rowNumber}/H${rowNumber}` }, // 마진액 / 총 결제금액
    };
  });

  return XLSX.utils.json_to_sheet(data);
};

export default function MarginAutomation() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target?.result);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const { traditionalWineOrders, restOrders } = 
          splitByTraditionalWineAndRestOrders(
            setZeroAboutDeliveryDataByOrderId(
              pickByOrderState(XLSX.utils.sheet_to_json(ws, { defval: '' }), ['주문확인', '출고대기'])
            ),
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
          `${dayjs().format('YYYYMMDDHHmmss')} 마진자동화 결과.xlsx`
        );
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h1>마진 자동화</h1>
      <input
        ref={inputRef}
        onChange={handleInput}
        type="file"
        style={{ display: "none" }}
      />
      <button onClick={() => { inputRef.current?.click(); }}>업로드</button>
      <h5 style={{ color: 'crimson' }}>잘안되시면 새로고침 후 다시 시도해보세요!</h5>
    </div>
  )
}