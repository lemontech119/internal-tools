"use strict";
const nodemailer = require("nodemailer");

const html = `<p>안녕하세요. 프레시멘토입니다.</p>
<br>
<p>금일 발주서 보내드립니다.</p>
<p>오늘도 수고하세요, 감사합니다 :)</p>
<br>
<p> ▶ 발주서 파일은 개인정보가 포함된 자료로 상품 발송 외 다른 목적으로 사용을 금합니다.</p>
<p> 3개월이 지난 파일은 반드시 파기 부탁드립니다. 감사합니다 ^^ </p>
<br><br>
<img src="https://postfiles.pstatic.net/MjAyMTAyMTVfMTE3/MDAxNjEzMzU3MjA5NTM1.Fd0eFZytaAkR6krXHfpQC2xqru7nrgRng6pTA4H0p9og.3JgZEn-4EM_iHcQatVqVPi9i8N8flZcOlFUvSNAJX_Mg.JPEG.ado119/freshmentor_image.jpeg?type=w773"></img>`;

async function main(toMail, date, companyName) {
  let transporter = nodemailer.createTransport({
    // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
    service: "gmail",
    // host를 gmail로 설정
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "freshmentor.db@gmail.com", // generated ethereal user
      pass: "yzcibnwpepmyjeop", // generated ethereal password // lbannuboirchdzdm
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"프레시멘토" <freshmentor.db@gmail.com>', // sender address
    to: toMail, // list of receivers
    subject: `${date} ${companyName}`, // Subject line
    attachments: [
      {
        filename: `${date} ${companyName}`,
        path: `${date}/${date} ${companyName}`,
      },
    ],
    // html: `<p>안녕하세요 프레시멘토입니다.</p>
    //   <br>
    //   <p>5월 부처님오신날 대체휴일 및 6월 현충일 공휴일 관련하여 </p>
    //   <p>사용중이신 택배사의 매송마감 일정 및 재개 일정을 확인하여 송장 회신시 함께 공유 부탁드립니다.</p>
    //   <br>
    //   <p>일정 회신시, 마지막으로 발주서를 받으시는 날짜로 기재 부탁드립니다.</p>
    //   <p>(ex. 부처님오신날 > 05/26 택배 출고 마감 , 05/30 배송재개  </p>
    //   <p>&nbsp;&nbsp;&nbsp;&nbsp;>현충일 > 06/02 출고마감 , 06/07 배송재개 )</p>
    //   <br>
    //   <br>
    //   <p>상품을 구매하시는 고객님들께 정확한 안내를 위해 꼭 마감일정 확인을 부탁드리며,</p>
    //   <p>해당 메일은 발주시 자동으로 첨부되는 내용이므로 배송마감 일정을 이미 전달주셨다면 무시해주셔도 됩니다.</p>
    //   <br>
    //   <p>감사합니다 : )</p>
    //   <br><br>
    //   <img src="https://postfiles.pstatic.net/MjAyMTAyMTVfMTE3/MDAxNjEzMzU3MjA5NTM1.Fd0eFZytaAkR6krXHfpQC2xqru7nrgRng6pTA4H0p9og.3JgZEn-4EM_iHcQatVqVPi9i8N8flZcOlFUvSNAJX_Mg.JPEG.ado119/freshmentor_image.jpeg?type=w773"></img>
    // `,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

async function main2(toMail, date, companyName, fileName2) {
  let transporter = nodemailer.createTransport({
    // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
    service: "gmail",
    // host를 gmail로 설정
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "freshmentor.db@gmail.com", // generated ethereal user
      pass: "yzcibnwpepmyjeop", // generated ethereal password // qxfbtjmmxnaywana // apsxh1006+ // lbannuboirchdzdm
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"프레시멘토" <freshmentor.db@gmail.com>', // sender address
    to: toMail, // list of receivers
    subject: `${date} ${companyName}`, // Subject line
    attachments: [
      {
        filename: `${date} ${companyName}`,
        path: `${date}/${date} ${companyName}`,
      },
      {
        filename: `${date} ${fileName2}`,
        path: `${date}/${date} ${fileName2}`,
      },
    ],
    // html: `<p>안녕하세요 프레시멘토입니다.</p>
    //   <br>
    //   <p>▶ 5월 부처님오신날 대체휴일 및 6월 현충일 공휴일 관련하여 </p>
    //   <p>사용중이신 택배사의 매송마감 일정 및 재개 일정을 확인하여 송장 회신시 함께 공유 부탁드립니다.</p>
    //   <br>
    //   <p>일정 회신시, 마지막으로 발주서를 받으시는 날짜로 기재 부탁드립니다.</p>
    //   <p>(ex. 부처님오신날 > 05/26 택배 출고 마감 , 05/30 배송재개  </p>
    //   <p>&nbsp;&nbsp;&nbsp;&nbsp;>현충일 > 06/02 출고마감 , 06/07 배송재개 ) ◀</p>
    //   <br>
    //   <br>
    //   <p>상품을 구매하시는 고객님들께 정확한 안내를 위해 꼭 마감일정 확인을 부탁드리며,</p>
    //   <p>해당 메일은 발주시 자동으로 첨부되는 내용이므로 배송마감 일정을 이미 전달주셨다면 무시해주셔도 됩니다.</p>
    //   <br>
    //   <p>감사합니다 : )</p>
    //   <br><br>
    //   <img src="https://postfiles.pstatic.net/MjAyMTAyMTVfMTE3/MDAxNjEzMzU3MjA5NTM1.Fd0eFZytaAkR6krXHfpQC2xqru7nrgRng6pTA4H0p9og.3JgZEn-4EM_iHcQatVqVPi9i8N8flZcOlFUvSNAJX_Mg.JPEG.ado119/freshmentor_image.jpeg?type=w773"></img>
    // `,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou…
}

// main().catch(console.error);

exports.main = main;
exports.main2 = main2;
