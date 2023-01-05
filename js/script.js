const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIRL = "/api/irl";
const jpdbIML = "/api/iml";
const shipDBName = "DELIVERY-DB";
const shipRelationName = "SHIPMENT-TABLE";
const connToken = "90938185|-31949272818873463|90954815";

$("#shipId").focus();

function saveRecNo2LS(jsonObj) {
  var lvdata = JSON.parse(jsonObj.data);
  localStorage.setItem('recno', lvdata.rec_no);
}

function getShipIdAsJsonObj() {
  var shipId = $("#shipId").val();
  var jsonStr = {
    id: shipId,
  };
  return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
  saveRecNo2LS(jsonObj);
  var record = JSON.parse(jsonObj.data).record;
  $("#shipDesc").val(record.desc);
  $("#shipSrc").val(record.src);
  $("#shipDest").val(record.dest);
  $("#shipSDate").val(record.sdate);
  $("#shipEDate").val(record.edate);
}

function validateData() {
  var shipid, shipdesc, shipsrc, shipdest, shipsdate, shipedate;
  shipid = $("#shipId").val();
  shipdesc = $("#shipDesc").val();
  shipsrc = $("#shipSrc").val();
  shipdest = $("#shipDest").val();
  shipsdate = $("#shipSDate").val();
  shipedate = $("#shipEDate").val();

  if (shipid === "") {
    alert("Shipment ID Missing");
    $("#shipId").focus();
    return "";
  }
  if (shipid === "") {
    alert("Shipment Description Missing");
    $("#shipDesc").focus();
    return "";
  }
  if (shipid === "") {
    alert("Shipment Source Missing");
    $("#shipSrc").focus();
    return "";
  }
  if (shipid === "") {
    alert("Shipment Destination Missing");
    $("#shipDest").focus();
    return "";
  }
  if (shipid === "") {
    alert("Shipping Date Missing");
    $("#shipSDate").focus();
    return "";
  }
  if (shipid === "") {
    alert("Shipment Excepted Date Missing");
    $("#shipEDate").focus();
    return "";
  }

  var jsonStrObj = {
    id: shipid,
    desc: shipdesc,
    src: shipsrc,
    dest: shipdest,
    sdate: shipsdate,
    edate: shipedate,
  };
  return JSON.stringify(jsonStrObj);
}

function getShip() {
  var shipIdJsonObj = getShipIdAsJsonObj();
  var getRequest = createGET_BY_KEYRequest(
    connToken,
    shipDBName,
    shipRelationName,
    shipIdJsonObj
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    getRequest,
    jpdbBaseURL,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });
  if (resJsonObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#shipDesc").focus();
  } else if (resJsonObj.status === 200) {
    $("#shipId").prop("disabled", true);
    fillData(resJsonObj);

    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#shipDesc").focus();
  }
}

function resetForm() {
  $("#shipId").val("");
  $("#shipDesc").val("");
  $("#shipSrc").val("");
  $("#shipDest").val("");
  $("#shipSDate").val("");
  $("#shipEDate").val("");
  $("#shipId").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#change").prop("disabled", true);
  $("#reset").prop("disabled", true);
  $("#shipId").focus();
}

function saveData() {
  var jsonStrObj = validateData();
  if (jsonStrObj === "") {
    return "";
  }
  var putRequest = createPUTRequest(
    connToken,
    jsonStrObj,
    shipDBName,
    shipRelationName
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    putRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  resetForm();
  $("#shipId").focus();
}

function changeData() {
  $("#change").prop("disabled", true);
  jsonChg = validateData();
  var updateRequest = createUPDATERecordRequest(
    connToken,
    jsonChg,
    shipDBName,
    shipRelationName,
    localStorage.getItem("recno")
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    updateRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  console.log(resJsonObj);
  resetForm();
  $("#shipId").focus();
}
