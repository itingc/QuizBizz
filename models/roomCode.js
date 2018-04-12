String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}


var randomCode = () => {
    var code = "";
    var possible = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    for (var i = 0; i < 4; i++){ 
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
};

var generateCode = (codeArr) => {
    var code;
    var isDuplicate ;
    
    do{
        code = randomCode();
        isDuplicate = codeArr.includes(code); //check if code alrdy exist
    }while (isDuplicate === true);
    
    return code;
};

var addCode = (codeArr) =>{
    var code = generateCode(codeArr);
    codeArr.push(code);
};

var deleteCode = (codeArr, codeTodelete) =>{
    var idx = codeArr.indexOf(codeTodelete);
    codeArr.splice(idx, 1);
};

module.exports = {
    //addCode,
    //deleteCode,
    generateCode
};

