
// 时间戳

function zero(n) {
   return n < 10 ? '0' + n : '' + n;
}
export function formatTime(nowTime) {
    let getNowTime = new Date(nowTime * 1000);
    let year = getNowTime.getFullYear();
    let month = getNowTime.getMonth() + 1;
    let date = getNowTime.getDate();
    let hour = getNowTime.getHours();
    let minute = getNowTime.getMinutes();
    let second = getNowTime.getSeconds();
    return year + "-" + zero(month) + "-" + zero(date) + "  " + zero(hour) + ":" + zero(minute) + ":" + zero(second);
}