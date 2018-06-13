import { getCart } from "./cart";
import { removeTimeOfCourse } from "./conflict";
import { acix } from "./popup";

var correct_list = [];
var wrong_list = [];
var course_list = [];

function serialize(obj) {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(p + "=" + obj[p]);
    }
  return str.join("&");
}

// FIXME: 體育有分 PE、PE1、PE3 等
function getCourseFormInfo(course_no, callback) {
  let patt = /[A-Za-z]+/;
  let target = course_no.match(patt);

  let url =
    "https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.1/7.1.3/JH713004.php";
  let form = {
    ACIXSTORE: acix,
    toChk: 1,
    new_dept: target[0]
  };
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    }),
    credentials: "include",
    redirect: "follow",
    body: serialize(form)
  })
    .then(res => res.arrayBuffer())
    .then(data => {
      let temp = document.createElement("div");
      let decode_data = new TextDecoder("big5").decode(data);
      temp.innerHTML = decode_data;
      // console.log.apply(console, $(temp));

      if (
        $(temp)
          .text()
          .indexOf("session is interrupted!") >= 0
      ) {
        $("#session_alert").modal("show");
      } else {
        let found = $("#T1 > tbody > tr", temp).filter(function() {
          return $("td:nth-child(2) > div", this).text() == course_no;
        });

        let input, form;
        if ($("td:nth-child(1) > div > input.btn2", found).length > 0)
          input = $("td:nth-child(1) > div > input.btn2", found);
        else input = $("td:nth-child(1) > div > input", found);

        if ($(input).length != 0) {
          // 正式選課
          let input_array = $(input)
            .attr("onclick")
            .split(";");
          let check = input_array[1].split("'");
          form = {
            aspr: "",
            ckey: check[1],
            code: check[3],
            div: check[5],
            real: check[7],
            cred: check[9],
            ctime: check[11],
            num: check[13],
            glimit: check[15],
            type: check[17],
            pre: check[19],
            range: check[21]
          };
        } else {
          // 預排系統
          form = {
            aspr: "",
            ckey: course_no,
            code: "",
            div: "",
            real: "",
            cred: "",
            ctime: "",
            num: "",
            glimit: "",
            type: "",
            pre: "",
            range: ""
          };
        }
        callback(form);
      }
    });
}

function selectEachCourse(course_no_order, callback) {
  let course_no = course_no_order.course_no;
  let aspr = course_no_order.order;
  if (aspr == "-1") aspr = "";

  getCourseFormInfo(course_no, function(r_form) {
    // TODO: 選擇要正式選課還是預排系統
    // 預排系統
    let url = `https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.6/7.6.1/JH761005.php`;
    let needReload = false;
    // 正式選課
    // let url = `https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.1/7.1.3/JH7130041.php`;
    // let needReload = true;

    let form = {
      ACIXSTORE: acix,
      toChk: "",
      new_dept: "",
      new_class: "",
      chks: "",
      aspr: aspr,
      ckey: r_form.ckey,
      code: r_form.code,
      div: r_form.div,
      real: r_form.real,
      cred: r_form.cred,
      ctime: r_form.ctime,
      num: r_form.num,
      glimit: r_form.glimit,
      type: r_form.type,
      pre: r_form.pre,
      range: r_form.range,
      chkbtn: "add"
    };

    fetch(url, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
      }),
      credentials: "include",
      redirect: "follow",
      body: serialize(form)
    })
      .then(res => res.arrayBuffer())
      .then(data => {
        let temp = document.createElement("div");
        let decode_data = new TextDecoder("big5").decode(data);
        decode_data = decode_data.replace(
          `<img src="templates/pic1.gif" width="351" height="30">`,
          ``
        );
        temp.innerHTML = decode_data;
        console.log.apply(console, $(temp));

        let alert = "無任何警告訊息";
        if (
          $(temp)
            .text()
            .indexOf("session is interrupted!") >= 0 ||
          $(temp)
            .text()
            .indexOf("Time longer than permitted!") >= 0
        ) {
          $("#session_alert").modal("show");
          $("#send_to_nthu_loading").removeClass("active");
        } else if (
          $(temp)
            .text()
            .indexOf("alert") >= 0
        ) {
          alert = $("script:contains('alert')", temp)
            .first()
            .text();

          let message = alert.split("'")[1];
          let success_in_random = "加選此科目僅列入亂數處理!";
          if (message.indexOf(success_in_random) >= 0) {
            let isSuccess = true;
            callback(isSuccess, message, needReload);
          } else {
            let isSuccess = false;
            callback(isSuccess, message, needReload);
          }
        } else {
          let isSuccess = true;
          callback(isSuccess, "無任何警告訊息");
        }
        console.log(course_no);
        console.log.apply(console, $(temp));
        console.log(form);
        console.log(alert);
        console.log("\n");
      });
  });
}

function callSelectEachCourse(course_num, count, callback) {
  if (count > course_num) return;
  let course_no_order = course_list[count - 1];
  let course_no = course_no_order.course_no;
  $("#nthu_loading_text").html("正 在 選 課 中<br/><br/>" + course_no);
  selectEachCourse(course_no_order, function(isSuccess, message, needReload) {
    if (isSuccess == true) correct_list.push({ course_no, message });
    else wrong_list.push({ course_no, message });

    callback(count, needReload);
    count++;
    callSelectEachCourse(course_num, count, callback);
  });
}

function selectAllCourse(course_num, cart, callback) {
  let count = 1;
  correct_list = [];
  wrong_list = [];
  course_list = [];

  for (let key in cart) {
    let course_no = cart[key].course_no;
    let order = cart[key].order;
    course_list.push({ course_no, order });
  }
  callSelectEachCourse(course_num, count, callback);
}

function findIdFromObject(obj, course_no) {
  let id = null;
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (obj[prop].course_no == course_no) {
        id = prop;
        break;
      }
    }
  }
  return id;
}

function removeSuccessSelectCourse(callback) {
  chrome.storage.local.get("cart", function(items) {
    let temp = {};
    Object.assign(temp, items.cart);
    for (let each in correct_list) {
      let course_id = findIdFromObject(temp, correct_list[each].course_no);
      removeTimeOfCourse(temp[course_id].time);
      delete temp[course_id];
    }
    chrome.storage.local.remove("cart", function() {
      chrome.storage.local.set({ cart: temp }, function() {
        chrome.storage.local.get("cart", function(items) {
          // console.log(items);
          getCart();
          callback();
        });
      });
    });
  });
}

function showCourseModal(callback) {
  $("#select_course_status").empty();
  let patt = /[^A-Za-z\\]+/;
  if (correct_list.length != 0) {
    $("#select_course_status").append(`<div class="item">成功：</div>`);
    for (let each in correct_list) {
      let message = correct_list[each].message.match(patt);
      // console.log(correct_list[each].message);
      // console.log(message);
      let content =
        `<div class="item">` +
        correct_list[each].course_no +
        ` ( ` +
        message +
        ` )` +
        `</div>`;
      $("#select_course_status").append(content);
    }
  }
  if (wrong_list.length != 0) {
    $("#select_course_status").append(`<div class="item">失敗：</div>`);
    for (let each in wrong_list) {
      let message = wrong_list[each].message.match(patt);
      // console.log(wrong_list[each].message);
      // console.log(message);
      let content =
        `<div class="item">` +
        wrong_list[each].course_no +
        ` ( ` +
        message +
        ` )` +
        `</div>`;
      $("#select_course_status").append(content);
    }
  }
  $("#select_state").modal("show");
  callback();
}

function submitToNTHU() {
  chrome.storage.local.get("cart", function(items) {
    if (items.cart != undefined) {
      const course_num = Object.keys(items.cart).length;
      selectAllCourse(course_num, items.cart, function(count, needReload) {
        if (count == course_num) {
          chrome.tabs.query(
            { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
            function(tabs) {
              if (needReload == true) chrome.tabs.reload(tabs[0].id);
              removeSuccessSelectCourse(function() {
                showCourseModal(function() {
                  $("#send_to_nthu_loading").removeClass("active");
                });
              });
            }
          );
        }
      });
    } else {
      $("#send_to_nthu_loading").removeClass("active");
    }
  });
}

function storeOrderToStorage(course_id_group, callback) {
  chrome.storage.local.get("cart", function(items) {
    let temp = {};
    Object.assign(temp, items.cart);
    for (let each in course_id_group) {
      let id = course_id_group[each].course_id;
      let order = course_id_group[each].order;
      temp[id].order = order;
    }

    chrome.storage.local.remove("cart", function() {
      chrome.storage.local.set({ cart: temp }, function() {
        chrome.storage.local.get("cart", function(items) {
          // console.log(items);
          callback();
        });
      });
    });
  });
}

$("#send_to_nthu").on("click", function() {
  let isSelect = $("#course_order_list > div > .number")
    .first()
    .text();
  if (isSelect == 0) return;
  $("#course_order").modal("hide");
  $("#send_to_nthu_loading").addClass("active");
  let course_id_group = [];
  $("#course_order_list > div > .number").each(function() {
    let course_id = $(this).attr("id");
    let order = $(this).text();
    course_id_group.push({ course_id, order });
  });
  storeOrderToStorage(course_id_group, function() {
    submitToNTHU();
  });
});

export { submitToNTHU };
