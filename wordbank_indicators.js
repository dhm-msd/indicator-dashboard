var core_indicators_info = 'https://api.worldbank.org/v2/sources/3/indicators/?format=json';
var indicator_data = 'https://api.worldbank.org/v2/country/all/indicator/';
var indicator_data_parameters = '?date=2000:2019&format=json';
var request = require('request');


//get general data for the index
worldbank_indicators = {}
worldbank_indicators.getCoreData = function(){
    return new Promise(function(resolve,reject){
        request(core_indicators_info,{ method:"GET"},function(err,res,body){
            if(err){
                reject(err)
            }else{
                let data = JSON.parse(body)   
                resolve(data)
            }
        })
    })    
}

worldbank_indicators.getIndicatorInfo = function(indicatorId){
    return new Promise(function(resolve,reject){
        request(indicator_data+indicatorId+indicator_data_parameters,{ method:"GET"},function(err,res,body){
            if(err){
                reject(err)
            }else{
                let data = JSON.parse(body)   
                resolve(data)
            }
        })
    })    
}

module.exports = worldbank_indicators