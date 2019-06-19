// 根据两个经纬度计算之间的距离
export function calculatedDistance(longitude1, latitude1, longitude2, latitude2) {
    // 纬度
    let lat1 = getRad(latitude1);
    let lat2 = getRad(latitude2);
    // 经度
    let lon1 = getRad(longitude1);
    let lon2 = getRad(longitude2);
    // 地球半径
    const r = 6371;
    // 两点之间距离，单位为km
    let d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * r;
    // 单位为m
    let distance = d * 1000
    distance = formatDistance(distance);
    return distance;

}
function getRad(d) {
    const PI = Math.PI;
    return d * (PI / 180.0);
}

// 格式化距离
function formatDistance(distance) {
    if (distance < 1000) {
        distance = distance.toFixed(0);
        distance = distance + 'm';
    } else {
        distance = distance / 1000;
        distance = distance.toFixed(1);
        distance = distance + 'km';
    }
    return distance;
}

// 获取当前时间
export function getNow() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let date = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    return year + '/' + month + '/' + date + ' ' + hour + ':' + minute + ':' + second;
}

export function phoneTest(){
    var reg=/^1[3|4|5|7|8|9]\d{9}$/;
    if(reg.test(str)){
    return true;
    }else{
    return false
    }
}

export const imgUrl = 'http://localhost:3030/upload/'