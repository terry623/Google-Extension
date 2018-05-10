window._crypto = null;
import { getUrlVars } from "./helper";
import { getUserName, getResultCourse, getGrade, getCourseInfo } from "./api";
import { getCart } from "./cart";
import { collectionOfCourse } from "./server";
import { searchByKeyword } from "./search";
var acix;

$(document).ready(function() {
  // FIXME: 有時候不知道為什麼，沒有一開始全部 Hide 起來
  $(".content_item").hide();

  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function(tabs) {
      acix = getUrlVars(tabs[0].url)["ACIXSTORE"];
      getUserName(acix);
      $(".content_item.homePage").show();
      var stu_no = getUrlVars(tabs[0].url)["hint"];

      // FIXME: 科目空白數很不固定，0 ~ 2 個都有，而且不是全站統一。
      // const course_no_file = "10620CS  342300";
      // const course_have_file = "10620CS  340400";

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
      getCart(acix);
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
      $("#submit").on("click", function() {
        chrome.storage.local.get("cart", function(items) {
          var get_course_id = $(".ui.piled.segment").attr("id");
          var temp = {};
          var data = {
            course_no: $("#no").text(),
            course_name: $("#course_name").text(),
            time: $("#time").text()
          };

          if (items.cart != undefined) {
            Object.assign(temp, items.cart);
            temp[get_course_id] = data;

            chrome.storage.local.remove("cart", function() {
              chrome.storage.local.set({ cart: temp }, function() {
                chrome.storage.local.get("cart", function(items) {
                  console.log(items);
                  getCart(acix);
                });
              });
            });
          } else {
            temp[get_course_id] = data;
            chrome.storage.local.set({ cart: temp }, function() {
              chrome.storage.local.get("cart", function(items) {
                console.log(items);
                getCart(acix);
              });
            });
          }
        });
        $(".mini.modal").modal("show");
      });
      // TODO: 加搜尋不同類別 & Loader
      $(".clicktosearch").on("click", function() {
        searchByKeyword(acix, $("#keyword").val());
        $("#search_entry").hide();
        $("#search_bar").show();
        $("#search_result_page").show();
      });
    }
  );
});

chrome.storage.local.clear(function() {
  console.log("Clear Storage Data");
});

$(".ui.accordion").accordion();
$(".ui.dropdown").dropdown();
$("#change_school_table").on("click", ".item", function() {
  if (!$(this).hasClass("dropdown")) {
    // $(this)
    //   .addClass("active")
    //   .siblings(".item")
    //   .removeClass("active");
    var t = $(".ui.compact.table");
    t.show();

    if ($(this).hasClass("tab1")) {
      t.not(".tab1").hide();
      $("#change_phase").show();
      $("#cart_submit").hide();
      $("#left_pointing_to_school").hide();
    } else if ($(this).hasClass("tab2")) {
      t.not(".tab2").hide();
      $("#cart_submit").show();
      $("#left_pointing_to_school").show();
      $("#change_phase").hide();
    }
  }
});
$(".ui.pointing.menu").on("click", ".item", function() {
  if (!$(this).hasClass("dropdown") && !$(this).is(".notActive")) {
    $(this)
      .addClass("active")
      .siblings(".item")
      .removeClass("active");

    var t = $(".content_item");
    t.show();
    $("#search_bar").hide();
    $("#change_school_table").hide();

    if ($(this).hasClass("homePage")) t.not(".homePage").hide();
    else if ($(this).hasClass("searchPage")) {
      t.not(".searchPage").hide();
      $("#search_bar").hide();
      $("#search_result_page").hide();
      $("#search_entry").show();
    } else if ($(this).hasClass("choosePage")) {
      t.not(".choosePage").hide();
      $("#change_school_table").show();
    } else if ($(this).hasClass("recommendPage"))
      t.not(".recommendPage").hide();
  }
});
$(".ui.mini.modal").modal({
  inverted: true
});
$(".course_info.modal").modal({
  inverted: true
});
$("#search_result_body").on("click", "tr", function() {
  $(this).css("cursor", "pointer");
  var course_from_click = $("td:nth-child(1)", this).text();
  var course_id = $(this).attr("id");
  getCourseInfo(acix, course_from_click, course_id, true);
});
// TODO: 將存在 Storage 的課表送去校務資訊系統選課
$("#cart_submit").on("click", function() {});
