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
        <td class="S1 selectable"> </td>
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
        <td class="S2 selectable"> </td>
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
        <td class="S3 selectable"> </td>
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
        <td class="S4 selectable"> </td>
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
        <td class="Sn selectable"> </td>
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
        <td class="S5 selectable"> </td>
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
        <td class="S6 selectable"> </td>
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
        <td class="S7 selectable"> </td>
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
        <td class="S8 selectable"> </td>
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
        <td class="S9 selectable"> </td>
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
        <td class="Sa selectable"> </td>
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
        <td class="Sb selectable"> </td>
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
        <td class="Sc selectable"> </td>
    </tr>
    <tr class="">
        <td>無上課時間</td>
        <td class="none selectable" colspan="6">
        </td>
    </tr>
    </tbody>`;

function getUrlVars(url) {
  let values = [];
  let hash;
  let hashes = url.slice(url.indexOf('?') + 1).split('&');
  for (let i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    values.push(hash[0]);
    values[hash[0]] = hash[1];
  }
  return values;
}

function courseAddSpace(course_no) {
  let myRe = /[0-9]+[A-Za-z]+/g;
  let output = [
    course_no.slice(0, myRe.lastIndex),
    course_no.slice(myRe.lastIndex),
  ].join(' ');
  return output;
}

function translateTopic(topic) {
  let result;
  switch (topic) {
    case '開課代碼':
      result = '開課代碼';
      break;
    case '課程名稱':
      result = '課程中文名稱';
      break;
    case '授課教師':
      result = '教師';
      break;
    case '上課時間':
      result = '時間';
      break;
    case '教室地點':
      result = '教室';
      break;
    case '課程內容':
      result = '課綱';
      break;
    case '通識對象':
      result = '通識對象';
      break;
    case '通識類別':
      result = '通識類別';
      break;
    case '系必選修':
      result = '必選修';
      break;
    case '學分學程':
      result = '學程';
      break;
    case '第一二專長':
      result = '第一二專長';
      break;
    default:
      break;
  }
  return result;
}

function removeLongCourseName(course_name) {
  let after;
  after = course_name.replace('全民國防教育軍事訓練--', '');
  return after;
}

function oldyear_to_newyear(course_no) {
  course_no = course_no.replace('100', '107');
  course_no = course_no.replace('101', '107');
  course_no = course_no.replace('102', '107');
  course_no = course_no.replace('103', '107');
  course_no = course_no.replace('104', '107');
  course_no = course_no.replace('105', '107');
  course_no = course_no.replace('106', '107');
  return course_no;
}

function trans(slice) {
  switch (slice) {
    case 'n':
      slice = '4.5';
      break;
    case 'a':
      slice = '10';
      break;
    case 'b':
      slice = '11';
      break;
    case 'c':
      slice = '12';
      break;
  }
  return slice;
}

function sort_weekday(time_array) {
  time_array.sort((a, b) => {
    const weekday = ['M', 'T', 'W', 'R', 'F', 'S'];
    let week_a = weekday.findIndex(element => {
      return element == a.slice(0, 1);
    });
    let week_b = weekday.findIndex(element => {
      return element == b.slice(0, 1);
    });
    if (week_a == week_b) {
      let digitday_a = parseFloat(trans(a.slice(1, 2)));
      let digitday_b = parseFloat(trans(b.slice(1, 2)));
      return digitday_a - digitday_b;
    } else return week_a - week_b;
  });
  return time_array;
}

function addSpace_course_no(course_no) {
  let check_patt = /[0-9]+[A-Za-z]+\s*[0-9]+/g;
  if (course_no.match(check_patt) == null) return course_no;
  else {
    let head = course_no.match(/[0-9]+[A-Za-z]+/g)[0];
    let tail = course_no.match(/[0-9]+/g)[1];
    let remain = 15 - head.length - tail.length;
    let space = '';
    for (let i = 0; i < remain; i++) space = space.concat(' ');
    let new_course_no = head.concat(space).concat(tail);
    return new_course_no;
  }
}

const all_time = [
  'M1',
  'M2',
  'M3',
  'M4',
  'Mn',
  'M5',
  'M6',
  'M7',
  'M8',
  'M9',
  'Ma',
  'Mb',
  'Mc',
  'T1',
  'T2',
  'T3',
  'T4',
  'Tn',
  'T5',
  'T6',
  'T7',
  'T8',
  'T9',
  'Ta',
  'Tb',
  'Tc',
  'W1',
  'W2',
  'W3',
  'W4',
  'Wn',
  'W5',
  'W6',
  'W7',
  'W8',
  'W9',
  'Wa',
  'Wb',
  'Wc',
  'R1',
  'R2',
  'R3',
  'R4',
  'Rn',
  'R5',
  'R6',
  'R7',
  'R8',
  'R9',
  'Ra',
  'Rb',
  'Rc',
  'F1',
  'F2',
  'F3',
  'F4',
  'Fn',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'Fa',
  'Fb',
  'Fc',
  'S1',
  'S2',
  'S3',
  'S4',
  'Sn',
  'S5',
  'S6',
  'S7',
  'S8',
  'S9',
  'Sa',
  'Sb',
  'Sc',
];

function miniMessageAlert(header, content_1, content_2) {
  $('#mini_alert_header').text(header);
  if (content_2) {
    $('#mini_alert_content').html(`<p>${content_1}</p><p>${content_2}</p>`);
  } else $('#mini_alert_content').html(`<p>${content_1}</p>`);
  $('#mini_alert').modal('show');
}

export {
  getUrlVars,
  courseAddSpace,
  translateTopic,
  course_table,
  removeLongCourseName,
  oldyear_to_newyear,
  sort_weekday,
  addSpace_course_no,
  all_time,
  miniMessageAlert,
};
