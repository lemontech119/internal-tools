const email = require("./email");
const fs = require("fs");

let today = new Date();

let month = today.getMonth() + 1;
if (month < 10) {
  month = "0" + month;
}
let date = today.getDate();
if (date < 10) {
  date = "0" + date;
}

const monthDate = String(month) + String(date);

const jsonFile = fs.readFileSync("./company.json", "utf8");
const jsonData = JSON.parse(jsonFile);
// console.log(jsonData[0]);
const readDir = fs.readdirSync(`./${monthDate}`);

async function sendMain(jsonData, monthDate, readDir) {
  for (let j = 0; j < jsonData.length; j++) {
    const fileName = jsonData[j].company + ".xlsx";
    const companyName = monthDate + " " + fileName;

    if (readDir.includes(companyName)) {
      try {
        if (jsonData[j].company === "인옥이네") {
          const fileName2 = jsonData[j].company + " 발주서" + ".xlsx";
          await email.main2(jsonData[j].email, monthDate, fileName, fileName2);
          // console.log(jsonData[j].company + " 발주 메일이 완료되었습니다!! (2개 발송) ");
          fs.unlink(
            `${monthDate}/${monthDate} ${jsonData[j].company} 발주서.xlsx`,
            (err) =>
              err
                ? console.log(err)
                : console.log(
                    `발주 메일 완료 후 ${monthDate} ${jsonData[j].company} 발주서.xlsx 를 정상적으로 삭제했습니다`
                  )
          );
          fs.unlink(
            `${monthDate}/${monthDate} ${jsonData[j].company}.xlsx`,
            (err) =>
              err
                ? console.log(err)
                : console.log(
                    `발주 메일 완료 후 ${monthDate} ${jsonData[j].company}.xlsx 를 정상적으로 삭제했습니다`
                  )
          );
        } else if (
          jsonData[j].company === "컨츄리와인" ||
          jsonData[j].company === "샤토미소"
        ) {
          const fileName2 = jsonData[j].company + "_카카오" + ".xlsx";
          await email.main2(jsonData[j].email, monthDate, fileName, fileName2);
          // console.log(jsonData[j].company + " 발주 메일이 완료되었습니다!! (2개 발송) ");
          fs.unlink(
            `${monthDate}/${monthDate} ${jsonData[j].company}_카카오.xlsx`,
            (err) =>
              err
                ? console.log(err)
                : console.log(
                    `발주 메일 완료 후 ${monthDate} ${jsonData[j].company}_카카오.xlsx 를 정상적으로 삭제했습니다`
                  )
          );
          fs.unlink(
            `${monthDate}/${monthDate} ${jsonData[j].company}.xlsx`,
            (err) =>
              err
                ? console.log(err)
                : console.log(
                    `발주 메일 완료 후 ${monthDate} ${jsonData[j].company}.xlsx 를 정상적으로 삭제했습니다`
                  )
          );
        } else {
          await email.main(jsonData[j].email, monthDate, fileName);
          // console.log(jsonData[j].company + " 발주 메일이 완료되었습니다!! ");
          // fs.unlink(`${monthDate}/${monthDate} ${jsonData[j].company}.xlsx`, (err) => err ?
          //     console.log(err) : console.log(`발주 메일 완료 후 ${monthDate} ${jsonData[j].company}.xlsx 를 정상적으로 삭제했습니다`));
        }
      } catch (e) {
        console.log("에러 발생 개발자에게 문의주세요!! " + e);
      }
    } else {
      // console.log(jsonData[j].company + " 금일 발주가 없습니다. ");
    }
  }
}

sendMain(jsonData, monthDate, readDir);

// const readDir = fs.readdirSync("./0206")
// for (let i=0; i<readDir.length; i++) {
//     console.log(readDir[i]);
// }
