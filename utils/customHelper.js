exports.parseBool = function(str) 
{
    // console.log(typeof str);
    // strict: JSON.parse(str)
    
    if(str == null)
        return false;
    
    if (typeof str === 'boolean')
    {
        return (str === true);
    } 
    
    if(typeof str === 'string')
    {
        if(str == "")
            return false;
            
        str = str.replace(/^\s+|\s+$/g, '');
        if(str.toLowerCase() == 'true' || str.toLowerCase() == 'yes')
            return true;
        
        str = str.replace(/,/g, '.');
        str = str.replace(/^\s*\-\s*/g, '-');
    }
    
    // var isNum = string.match(/^[0-9]+$/) != null;
    // var isNum = /^\d+$/.test(str);
    if(!isNaN(str))
        return (parseFloat(str) != 0);
        
    return false;
}

exports.formatDate = function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

exports.getExtension = function getExtension(filename) {
    return filename.split('.').pop();
}

// parameter tahun, bulan = range 1-12
exports.lastDay = function(tahun, bulan){
    return  new Date(tahun, bulan, 0).getDate();
}