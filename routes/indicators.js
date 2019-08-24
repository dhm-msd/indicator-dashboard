var express = require('express');
var router = express.Router();
var worldbank_indicators = require('./../worldbank_indicators')


router.get('/:indicator_id', async function(req, res, next) {
  res.render('chart')
})

router.get('/:indicator_id/api', async function(req, res, next) {
  let indicator_id = req.params.indicator_id
  let coreData = await worldbank_indicators.getCoreData(indicator_id)
  let ind_data = await worldbank_indicators.getIndicatorInfo(indicator_id)
  let res_data_obj = []
  for(let indEntry of ind_data){
    let entry_arr= [indEntry.country.value, indEntry.country.id, indEntry.value ,  indEntry.date]
    res_data_obj.push(entry_arr)
  }
  res.send({indicator_data: coreData[1][0], data:res_data_obj});
});

module.exports = router;
