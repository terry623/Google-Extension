const course_table = `<tbody>
  <tr class="">
      <td>
          <div>08:00 - 08:50</div>
      </td>
      <td class="M1 selectable"> </td>
      <td class="T1 selectable"> </td>
      <td class="W1 selectable"> </td>
      <td class="R1 selectable"> </td>
      <td class="F1 selectable"> </td>
  </tr>
  <tr class="">
      <td>
          <div>09:00 - 09:50</div>
      </td>
      <td class="M2 selectable"> </td>
      <td class="T2 selectable"> </td>
      <td class="W2 selectable"> </td>
      <td class="R2 selectable"> </td>
      <td class="F2 selectable"> </td>
  </tr>
  <tr class="">
      <td>
          <div>10:10 - 11:00</div>
      </td>
      <td class="M3 selectable"> </td>
      <td class="T3 selectable"> </td>
      <td class="W3 selectable"> </td>
      <td class="R3 selectable"> </td>
      <td class="F3 selectable"> </td>
  </tr>
  <tr class="">
      <td>
          <div>11:10 - 12:00</div>
      </td>
      <td class="M4 selectable"> </td>
      <td class="T4 selectable"> </td>
      <td class="W4 selectable"> </td>
      <td class="R4 selectable"> </td>
      <td class="F4 selectable"> </td>
  </tr>
  <tr class="">
      <td>
          <div>12:10 - 13:00</div>
      </td>
      <td class="Mn selectable"> </td>
      <td class="Tn selectable"> </td>
      <td class="Wn selectable"> </td>
      <td class="Rn selectable"> </td>
      <td class="Fn selectable"> </td>
  </tr>
  <tr class="">
      <td>
          <div>13:20 - 14:10</div>
      </td>
      <td class="M5 selectable"> </td>
      <td class="T5 selectable"> </td>
      <td class="W5 selectable"> </td>
      <td class="R5 selectable"> </td>
      <td class="F5 selectable"> </td>
  </tr>
  <tr class="">
      <td>
          <div>14:20 - 15:10</div>
      </td>
      <td class="M6 selectable"> </td>
      <td class="T6 selectable"> </td>
      <td class="W6 selectable"> </td>
      <td class="R6 selectable"> </td>
      <td class="F6 selectable"> </td>
  </tr>
  <tr class="">
      <td>
          <div>15:30 - 16:20</div>
      </td>
      <td class="M7 selectable"> </td>
      <td class="T7 selectable"> </td>
      <td class="W7 selectable"> </td>
      <td class="R7 selectable"> </td>
      <td class="F7 selectable"> </td>
  </tr>
  <tr class="">
      <td>
          <div>16:30 - 17:20</div>
      </td>
      <td class="M8 selectable"> </td>
      <td class="T8 selectable"> </td>
      <td class="W8 selectable"> </td>
      <td class="R8 selectable"> </td>
      <td class="F8 selectable"> </td>
  </tr>
  <tr class="">
      <td>
          <div>17:30 - 18:20</div>
      </td>
      <td class="M9 selectable"> </td>
      <td class="T9 selectable"> </td>
      <td class="W9 selectable"> </td>
      <td class="R9 selectable"> </td>
      <td class="F9 selectable"> </td>
  </tr>
  <tr class="">
      <td>
          <div>18:30 - 19:20</div>
      </td>
      <td class="Ma selectable"> </td>
      <td class="Ta selectable"> </td>
      <td class="Wa selectable"> </td>
      <td class="Ra selectable"> </td>
      <td class="Fa selectable"> </td>
  </tr>
  <tr class="">
      <td>
          <div>19:30 - 20:20</div>
      </td>
      <td class="Mb selectable"> </td>
      <td class="Tb selectable"> </td>
      <td class="Wb selectable"> </td>
      <td class="Rb selectable"> </td>
      <td class="Fb selectable"> </td>
  </tr>
  <tr class="">
      <td>
          <div>20:30 - 21:20</div>
      </td>
      <td class="Mc selectable"> </td>
      <td class="Tc selectable"> </td>
      <td class="Wc selectable"> </td>
      <td class="Rc selectable"> </td>
      <td class="Fc selectable"> </td>
  </tr>
  <tr class="">
      <td>無上課時間</td>
      <td class="none selectable" colspan="5">
      </td>
  </tr>
  </tbody>`;

function getUrlVars(url) {
  var vars = [];
  var hash;
  var hashes = url.slice(url.indexOf("?") + 1).split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

function courseAddSpace(course_no) {
  var myRe = /[0-9]+[A-Za-z]+/g;
  var myArray = myRe.exec(course_no);
  var output = [
    course_no.slice(0, myRe.lastIndex),
    course_no.slice(myRe.lastIndex)
  ].join(" ");
  return output;
}

function translateTopic(topic) {
  var result;
  switch (topic) {
    case "課名":
      result = "課程中文名稱";
      break;
    case "科號":
      result = "科號";
      break;
    case "教師":
      result = "教師";
      break;
    case "時間":
      result = "時間";
      break;
    case "地點":
      result = "教室";
      break;
    case "對象":
      result = "通識對象";
      break;
    case "類別":
      result = "通識類別";
      break;
    case "科系":
      result = "必選修";
      break;
    case "學程":
      result = "學程";
      break;
    case "專長":
      result = "第一二專長";
      break;
    default:
      alert("Translate Topic Wrong !");
      break;
  }
  return result;
}

function removeLongCourseName(course_name) {
  var after;
  after = course_name.replace("全民國防教育軍事訓練--", "");
  return after;
}

export {
  getUrlVars,
  courseAddSpace,
  translateTopic,
  course_table,
  removeLongCourseName
};
