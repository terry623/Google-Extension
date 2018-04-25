var iconv = require("iconv-lite");
var request = require("request");
import { transform } from "./pdf2html";

function getUserName(acix) {
  request(
    {
      url:
        "https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/4/4.19/JH4j002.php?ACIXSTORE=" +
        acix,
      encoding: null
    },
    function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var str = iconv.decode(new Buffer(body), "big5");
        var temp = document.createElement("div");
        temp.innerHTML = str;
        var htmlObject = temp.firstChild;
        var found = $(
          "div > form > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(4)",
          temp
        );

        var welcome = "<div>Hi~ " + found.text() + " !</div>";
        $("#user").prepend(welcome);
        $(".content_item.homePage").show();
      }
    }
  );
}

function getCourseInfo(acix, course_no) {
  request(
    {
      url:
        "https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/common/Syllabus/1.php?ACIXSTORE=" +
        acix +
        "&c_key=" +
        course_no,
      encoding: null
    },
    function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var str = iconv.decode(new Buffer(body), "big5");
        var temp = document.createElement("div");
        temp.innerHTML = str;
        var htmlObject = temp.firstChild;

        var no = $(
          "div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)",
          temp
        );
        var name_zh = $(
          "div > table:nth-child(1) > tbody > tr:nth-child(3) > td.class3",
          temp
        );
        var name_en = $(
          "div > table:nth-child(1) > tbody > tr:nth-child(4) > td.class3",
          temp
        );
        var teacher = $(
          "div > table:nth-child(1) > tbody > tr:nth-child(5) > td.class3",
          temp
        );
        var time = $(
          "div > table:nth-child(1) > tbody > tr:nth-child(6) > td:nth-child(2)",
          temp
        );
        var classroom = $(
          "div > table:nth-child(1) > tbody > tr:nth-child(6) > td:nth-child(4)",
          temp
        );
        var description = $(
          "div > table:nth-child(4) > tbody > tr:nth-child(2) > td",
          temp
        );
        var syllabus = $(
          "div > table:nth-child(5) > tbody > tr:nth-child(2) > td",
          temp
        );
        var find_file = $(
          "div > table:nth-child(5) > tbody > tr:nth-child(2) > td > div > font:nth-child(1) > a",
          temp
        );
        $("#no").text(no.text());
        $("#course_name_zh").text(name_zh.text() + " " + name_en.text());
        $("#teacher").text(teacher.text());
        $("#time").text(time.text());
        $("#classroom").text(classroom.text());
        $("#description").append(description.html());

        if (find_file.length > 0) {
          var pdf_path =
            "https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/output/6_6.1_6.1.12/";
          $("#pdf_page").append(
            `<div align="right">
                    <button id="prev" class="tiny ui basic button">
                        <i class="angle left icon"></i>
                    </button>
                    <button id="next" class="tiny ui basic button">
                        <i class="angle right icon"></i>
                    </button>
                    &nbsp; &nbsp;
                    <span>Page:
                        <span id="page_num"></span> /
                        <span id="page_count"></span>
                    </span>
                </div>
                <canvas id="the-canvas" />
                `
          );
          transform(pdf_path + course_no + ".pdf?ACIXSTORE=" + acix);
        } else {
          $("#syllabus").append(syllabus.html());
        }
      }
    }
  );
}

export { getUserName, getCourseInfo };
