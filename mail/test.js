"use strict";
const nodemailer = require("nodemailer");

async function main() {

  let transporter = nodemailer.createTransport({
    // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
    service: 'gmail',
    // host를 gmail로 설정
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "freshmentor.db@gmail.com", // generated ethereal user
      pass: "apsxh1006+", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"프레시멘토" <freshmentor.db@gmail.com>', // sender address
    to: ["ado119@naver.com", "ado119@dcommerce.co.kr"], // list of receivers
    subject: "테스트 메일입니다. ", // Subject line
    html: `<p>안녕하세요 프레시멘토입니다.</p>
    <p>3.1절 공휴일 관련 택배 일정 문의드립니다.</p> 
    <p>송장 회신 시 아래에 마감일과 재개일 기입 부탁드립니다^^</p>
    <br>
    <p>ㅁ 택배 마감일 : </p>
    <p>ㅁ 택배 재개일 : </p>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);

exports.main = main;