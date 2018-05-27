import { getCourseInfo } from "./api";
import { translateTopic } from "./helper";
import { checkConflict } from "./conflict";
var elasticsearch = require("elasticsearch");
var client = new elasticsearch.Client({
  host: "http://localhost:9200"
});
client.ping(
  {
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
  },
  function(error) {
    if (error) {
      console.trace("Elasticsearch cluster is down");
    } else {
      console.log("Elasticsearch is well");
    }
  }
);

function renderSearchResult(hits, callback) {
  storeCourseInfo(hits);
  for (let each_course in hits) {
    let id = hits[each_course]._id;
    let source = hits[each_course]._source;

    let time = source.時間;
    if (time == "") time = "無";
    let classroom = source.教室;
    if (classroom == "") classroom = "無";

    checkConflict(time, function(negative) {
      let row =
        `<tr ` +
        negative +
        ` id="` +
        id +
        `">
      <td>` +
        source.科號 +
        `</td>
          <td>` +
        source.課程中文名稱 +
        `</td>
        <td>` +
        time +
        `</td>
        <td>` +
        classroom +
        `</td>
        <td>`;

      let teacher = [];
      for (let each_teacher in source.教師)
        teacher.push(source.教師[each_teacher].split("\t")[0]);
      teacher.splice(-1, 1);
      row += teacher.join("<br>") + `</td></tr>`;
      $("#search_result_body").append(row);
      $("#search_result_body > tr")
        .filter(function(index) {
          return index >= 10;
        })
        .hide();
      $("#search_result_body > tr").hover(function() {
        $(this).css("cursor", "pointer");
      });
    });
  }
  callback();
}

function searchOnlyKeyword(search_topic, keyword, callback) {
  console.log("searchOnlyKeyword");
  client
    .search({
      index: "nthu",
      type: "course",
      body: {
        size: 50,
        query: {
          match: {
            [search_topic]: keyword
          }
        }
      }
    })
    .then(
      function(resp) {
        let hits = resp.hits.hits;
        renderSearchResult(hits, callback);
      },
      function(err) {
        console.trace(err.message);
      }
    );
}

function searchDoubleKeyword(search_topic, keyword, other_keyword, callback) {
  console.log("searchDoubleKeyword");
  client
    .search({
      index: "nthu",
      type: "course",
      body: {
        size: 50,
        query: {
          bool: {
            must: [
              {
                match: {
                  課程中文名稱: keyword
                }
              },
              {
                match: {
                  [search_topic]: other_keyword
                }
              }
            ]
          }
        }
      }
    })
    .then(
      function(resp) {
        let hits = resp.hits.hits;
        renderSearchResult(hits, callback);
      },
      function(err) {
        console.trace(err.message);
      }
    );
}

function searchByKeyword(acix, keyword, other_keyword, topic, callback) {
  $("#search_result_body").empty();
  $("#search_loading").addClass("active");
  let search_topic = translateTopic(topic);
  if (search_topic == "時間") {
    other_keyword = other_keyword.replace(",", "");
  }
  console.log("keyword:", keyword);
  console.log("other_keyword:", other_keyword);
  console.log("search_topic:", search_topic);

  // FIXME: Elastic Search 去 Match 的方式要修正
  if (other_keyword == "") {
    searchOnlyKeyword(search_topic, keyword, callback);
  } else {
    searchDoubleKeyword(search_topic, keyword, other_keyword, callback);
  }
}

function storeCourseInfo(hits, callback) {
  // console.log("storeCourseInfo");
  // console.log(hits);
  chrome.storage.local.get("course", function(items) {
    var temp = {};
    var data = {};
    for (var each_course in hits) {
      var each = hits[each_course];
      var source = each._source;
      data[each._id] = {
        不可加簽說明: source.不可加簽說明,
        人限: source.人限,
        備註: source.備註,
        學分數: source.學分數,
        授課語言: source.授課語言,
        擋修說明: source.擋修說明,
        新生保留人數: source.新生保留人數,
        科號: source.科號,
        課程中文名稱: source.課程中文名稱,
        課程英文名稱: source.課程英文名稱,
        課程限制說明: source.課程限制說明,
        通識對象: source.通識對象,
        通識類別: source.通識類別,
        開課代碼: source.開課代碼,
        教師: source.教師,
        教室: source.教室,
        時間: source.時間,
        學程: source.學程,
        必選修: source.必選修,
        第一二專長: source.第一二專長,
        相似課程: []
      };
    }

    if (items.course != undefined) {
      Object.assign(temp, items.course);
      for (var each_data in data) {
        if (!temp.hasOwnProperty(each_data)) {
          temp[each_data] = data[each_data];
        }
      }
      chrome.storage.local.remove("course", function() {
        chrome.storage.local.set({ course: temp }, function() {
          chrome.storage.local.get("course", function(items) {
            // console.log(items);
            if (callback) callback();
          });
        });
      });
    } else {
      for (var each_data in data) temp[each_data] = data[each_data];
      chrome.storage.local.set({ course: temp }, function() {
        chrome.storage.local.get("course", function(items) {
          // console.log(items);
          if (callback) callback();
        });
      });
    }
  });
}

function searchBySingleCourseNo(course_no, callback) {
  client
    .search({
      index: "nthu",
      type: "course",
      body: {
        query: {
          match: {
            科號: course_no
          }
        }
      }
    })
    .then(
      function(resp) {
        var hits = resp.hits.hits;
        callback(hits);
        // console.log(hits);
      },
      function(err) {
        console.trace(err.message);
      }
    );
}

function searchByID_Group(course_id_group, callback) {
  // console.log("searchByID_Group");
  // console.log(course_id_group);
  client
    .search({
      index: "nthu",
      type: "course",
      body: {
        query: {
          terms: {
            _id: [
              course_id_group[0].other_id,
              course_id_group[1].other_id,
              course_id_group[2].other_id
            ]
          }
        }
      }
    })
    .then(
      function(resp) {
        var hits = resp.hits.hits;
        callback(hits);
      },
      function(err) {
        console.trace(err.message);
      }
    );
}

function dependOnType(topic) {
  $(".other_entry").hide();
  $(".ui.dropdown.search_entry_item").dropdown("clear");
  if (topic == "上課時間") $("#time_select_entry").show();
  else if (topic == "通識對象") $("#ge_people_entry").show();
  else if (topic == "通識類別") $("#ge_type_select_entry").show();
  else if (topic == "系必選修") $("#dept_entry").show();
  else if (topic == "學分學程") $("#program_entry").show();
  else if (topic == "第一二專長") $("#skill_entry").show();
  else $("#main_other_entry").show();
}

export {
  searchByKeyword,
  searchBySingleCourseNo,
  storeCourseInfo,
  searchByID_Group,
  dependOnType
};
