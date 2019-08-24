
var indicator_data = 'https://api.worldbank.org/v2/country/all/indicator/';
var request = require('request');
var fs = require('fs')

let array = ["CC.PER.RNK","GE.PER.RNK","PV.PER.RNK","RL.PER.RNK","RQ.PER.RNK", "VA.PER.RNK"];

//get general data for the index
worldbank_indicators = {}
worldbank_indicators.getCoreData = function(indicatorId){
    return new Promise(function(resolve,reject){
        let core_indicators_info = 'https://api.worldbank.org/v2/sources/3/indicators/';
        if(indicatorId){
            core_indicators_info = core_indicators_info+indicatorId
        }
        request(core_indicators_info+"?format=json",{ method:"GET"},function(err,res,body){
            if(err){
                reject(err)
            }else{
                let data = JSON.parse(body)   
                resolve(data)
            }
        })
    })    
}

worldbank_indicators.getCoreDataFiltered = async function(){
    return new Promise(async function(resolve,reject){
        coreData = await worldbank_indicators.getCoreData();
        let filteredData = coreData[1].filter(entry =>{
            if(array.indexOf(entry.id) > -1){
                return true;
            }else{ return false;}
        })
        resolve(filteredData);
    })
}

worldbank_indicators.getIndicatorInfo = function(indicatorId,page){
    return new Promise(function(resolve,reject){
        let cache_object = worldbank_indicators.readCache(indicatorId)
        if(cache_object){
            cache_object.cached = true;
            resolve(cache_object)
        }else{
            let indicator_data_parameters = '?date=2017:2019&format=json';
            if(page){
                indicator_data_parameters = indicator_data_parameters+"&page="+page
            }
            request(indicator_data+indicatorId+indicator_data_parameters,{ method:"GET"},async function(err,res,body){
                if(err){
                    reject(err)
                }else{
                    let data = JSON.parse(body)
                    if(data[0].pages && data[0].page <= data[0].pages){
                        console.log("[GETTING PAGE] "+indicatorId+ " "+ data[0].page+"/"+data[0].pages)
                        let newpagedata = await worldbank_indicators.getIndicatorInfo(indicatorId,data[0].page+1)
                        resolve(data[1].concat(newpagedata))
                    }else{
                        resolve(data[1])
                    }   
                    
                }
            })
        }
        
    })    
}

worldbank_indicators.readCache = function(indicatorId){
    if(fs.existsSync('cache/wordbank_'+indicatorId+'_cache.json')){
        return JSON.parse(fs.readFileSync('cache/wordbank_'+indicatorId+'_cache.json'))
    }else{
        return false;
    }
}

worldbank_indicators.cacheObject = function(indicatorId,data){
    fs.writeFileSync('cache/wordbank_'+indicatorId+"_cache.json", JSON.stringify(data))
}

module.exports = worldbank_indicators