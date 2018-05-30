import { getCourseInfo } from "./api";
import { course_table } from "./helper";
import { storeSliceTime } from "./conflict";

function getCart(acix) {
  chrome.storage.local.get("cart", function(items) {
    let parse_table = $.parseHTML(course_table);
    $(parse_table).attr("id", "cart");

    let all_time = [];
    for (let key in items.cart) {
      if (items.cart.hasOwnProperty(key)) {
        let name = items.cart[key].course_name.split(" ");
        let content =
          `<a href="#do_not_jump" id="` +
          key +
          `" course_no="` +
          items.cart[key].course_no +
          `">` +
          name[0] +
          `</a>`;

        if (items.cart[key].time.length == 1) {
          $(parse_table)
            .find(".none")
            .append(content);
        } else {
          let slice_time = [];
          for (let each in items.cart[key].time) {
            let each_time = items.cart[key].time[each];
            slice_time.push(each_time);
            all_time.push(each_time);
          }

          for (let each in slice_time) {
            $(parse_table)
              .find("." + slice_time[each])
              .append(content);
          }
        }
      }
    }
    storeSliceTime(all_time, "from_cart");
    $("#cart").replaceWith(parse_table);
    $("#cart > tr").on("click", "td", function() {
      $("#multiple_class_list").empty();
      if ($(this).children().length > 1) {
        $("a", this).each(function() {
          let content =
            `<div id="` +
            $(this).attr("id") +
            `" course_no="` +
            $(this).attr("course_no") +
            `" class="item">
            <div class="content">
            <div class="description">` +
            $(this).text() +
            `</div>
            </div>
            </div>`;
          $("#multiple_class_list").append(content);
        });

        //TODO: 通識的話，可以在此 modal 看志願
        $("#multiple_class").modal("show");
      } else {
        let course_no = $("a", this).attr("course_no");
        let id = $("a", this).attr("id");
        getCourseInfo(
          acix,
          course_no,
          id,
          function() {
            $(".course_action").hide();
            $("#delete").show();
            $("#back").show();
            $("#course_info_loading").removeClass("active");
          },
          false
        );
      }
    });
  });
}

export { getCart };
