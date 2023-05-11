const DateFormat = function(dateStr){
    let time = new Date(dateStr).getTime();
    let date = new Date(time);
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}
module.exports = {DateFormat}
