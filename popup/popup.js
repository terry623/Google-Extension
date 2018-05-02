window._crypto = null;
import { getUrlVars } from "./helper";
import { getUserName, getCourseInfo, getResultCourse, getGrade } from "./api";
import { getCart } from "./cart";
import { collectionOfCourse, searchByKeyword } from "./server";

$(document).ready(function() {
  $(".content_item").hide();

  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function(tabs) {
      var acix = getUrlVars(tabs[0].url)["ACIXSTORE"];
      console.log("ACIXSTORE is " + acix);
      getUserName(acix);

      var stu_no = getUrlVars(tabs[0].url)["hint"];

      // FIXME: 科目空白數很不固定，0 ~ 2 個都有，而且不是全站統一
      const course_no_file = "10620CS  342300";
      const course_have_file = "10620CS  340400";
      const course_from_ISS = "10620ISS 508400";
      getCourseInfo(acix, course_from_ISS);

      // TODO: 要可以切換不同的選課紀錄
      //  選課紀錄
      //  100  第 1 次選課 log 記錄
      //  100P 第 1 次選課亂數結果
      //  101  第 2 次選課 log 記錄
      //  101P 第 2 次選課結束(已亂數處理)
      //  200  第 3 次選課 log 記錄
      //  200P 第 3 次選課結束(已亂數處理)
      //  200S 加退選開始前(含擋修、衝堂)
      //  300  加退選 log 記錄
      //  300P 加退選結束(已處理)
      //  400  停修 log 記錄
      var phaseNo = "100";
      getResultCourse(acix, stu_no, phaseNo, "106", "20");
      getCart();
      getGrade(acix, stu_no);
      collectionOfCourse();

      $("#change_phase").dropdown({
        on: "click",
        action: function(text, value, element) {
          getResultCourse(acix, stu_no, value, "106", "20");
          $("#change_phase").dropdown("set text", text);
          $("#change_phase").dropdown("hide");
        }
      });
    }
  );
});

$(".shape").shape();
$(".ui.accordion").accordion();
$("#clicktoflip").click(function() {
  $(".shape").shape("flip right");
});
$(".ui.tabular.menu").on("click", ".item", function() {
  if (!$(this).hasClass("dropdown")) {
    $(this)
      .addClass("active")
      .siblings(".item")
      .removeClass("active");

    var t = $(".ui.compact.table");
    t.show();

    if ($(this).hasClass("tab1")) {
      t.not(".tab1").hide();
      $("#change_phase").show();
    } else if ($(this).hasClass("tab2")) {
      t.not(".tab2").hide();
      $("#change_phase").hide();
    }
  }
});
$(".ui.pointing.menu").on("click", ".item", function() {
  if (!$(this).hasClass("dropdown")) {
    $(this)
      .addClass("active")
      .siblings(".item")
      .removeClass("active");

    var t = $(".content_item");
    t.show();

    if ($(this).hasClass("homePage")) t.not(".homePage").hide();
    else if ($(this).hasClass("searchPage")) t.not(".searchPage").hide();
    else if ($(this).hasClass("choosePage")) {
      t.not(".choosePage").hide();
      $(".ui.tab2").hide();
    } else if ($(this).hasClass("recommendPage"))
      t.not(".recommendPage").hide();
    else if ($(this).hasClass("singlePage")) t.not(".singlePage").hide();
  }
});
$("#clickme").click(function() {
  // TODO: 按送出後跳到搜尋結果頁
  searchByKeyword($("#keyword").val());
});
