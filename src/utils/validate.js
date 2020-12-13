/**
 *  过滤特殊字符
 * * */
export function stripscript(str) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < str.length; i++) {
        rs = rs + str.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

//验证邮箱
export function validateEmail(value) {
    let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    return !reg.test(value) ? true : false;
}

//验证密码  密码为6至20位的数字+字母

export function validatePass(value){
    let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
    return !reg.test(value) ? true : false;
}

//验证验证码 长度为6 格式a-z 0-9的字母或者数字

export function validateVcode(value){
    let reg = /^[a-z0-9]{6}$/;
    return !reg.test(value) ? true : false;
}