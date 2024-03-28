
//*** To Start this ***
//npm start from the /test0 directory

//*** To Run This ***
//curl -G -d 'cmd=mixpanel' -d 'id=9f00d6512b1520e8fcbdfcb297eec119' localhost:8080
//    -or-
//http://localhost:8080/?cmd=mixpanel&id=9f00d6512b1520e8fcbdfcb297eec119

const functions = require('@google-cloud/functions-framework');

//add debug library
var dbg = require('./dbg.js');
dbg("debug library loaded",2);


// This is the main starting function
functions.http('onstart', (req, res) => {

    //send the query
    doCommand(req.query,function(objDoCommandResolveReturn, objDoCommandRejectReturn){

      dbg("calling all the way back to onstart!!1!", 4);
      res.send(JSON.stringify(objDoCommandResolveReturn));

    },function (objDoCommandRejectReturn){

      dbg("objDoCommandRejectReturn: " + objDoCommandRejectReturn,4);
      res.send(JSON.stringify(objDoCommandRejectReturn));

    });

});


async function doCommand (objQuery,funcResolve,funcReject) {

  //add debug library
  var dbg = require('./dbg.js');
  dbg("debug library loaded",2);

  //variables
  var objReturn = {
    "info":"Return object from doCommand function",
    "rtn":"error",
    "rtnmsg":"unknown error",
    "rtnstack":[],
    "data":{"objQuery":objQuery}
  }

  dbg('in doCommand',4);
  dbg('running the ' + objQuery.cmd + ' command',2);

  //=== HelloWorld Command ===
  if (objQuery.cmd == "helloworld") {

    dbg('Hello World',0);
    funcResolve ({"rtnmsg":"Hello World","rtn":"ok","info":"Hello World Command Received"}); 

  }

  //=== Mixpanel Command ===
  if (objQuery.cmd == "mixpanel") {

    //add mixpanel library
    var getMixpanelData = require('./getMixpanelData.js');
    dbg("mixpanel library loaded",2);

    //build the 
    var objParameters = {"mixpanel_userid":objQuery.id};
    if (objQuery.from_date) {
      objParameters.from_date = objQuery.from_date;
    }
    if (objQuery.to_date) {
      objParameters.to_date = objQuery.to_date;
    }

    //set the promise to get Mixpanel Data
    let getMixpanelDataPromise = new Promise(function(getDataResolve, getDataReject){

        //resolve Mixpanel call
        getMixpanelData(objParameters,function(objReturn_getMixpanelData){
          dbg(objQuery.cmd + " success",1);
          //dbg(JSON.stringify(objReturn_getMixpanelData),4);
          objReturn = objReturn_getMixpanelData;
          getDataResolve(objReturn);

  
        },function(objReturn_getMixpanelData){
          dbg(objQuery.cmd + " failure",4);
          objReturn = objReturn_getMixpanelData;
          getDataReject(objReturn);


        });
  
    })

    //finish the promise
    getMixpanelDataPromise.then(
      function (objReturnData){

        funcResolve(objReturnData);
        
      }, function (objRejectData) {

        funcReject(objRejectData);

      })
  


      //=== End of doCommand ===
      dbg("doCommand sent",2);


  }
//=== End Mixpanel Command ===


}




