function initializeWidget() {
  /*
   * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
   */
  ZOHO.embeddedApp.on("PageLoad", function (data) {
    /*
     * Verify if EntityInformation is Passed
     */
    if (data && data.Entity) {
      ZOHO.CRM.API.getRecord({
        Entity: data.Entity,
        RecordID: data.EntityId,
      }).then(function (response) {
        console.log(response);
        var record = response.data[0];
        var recordId = record["id"];
        var recordLeadStatus = record["Lead_Status"];
        var recordDescription = record["Description"];
        document.getElementById("leadStatus").value = recordLeadStatus;
        document.getElementById("description").value = recordDescription;
        document.getElementById("updateRecord").onclick = function () {
          var leadStatus = document.getElementById("leadStatus").value;
          var recordDescription = document.getElementById("description").value;
          ZOHO.CRM.API.updateRecord({
            Entity: "Leads",
            APIData: {
              id: recordId,
              Lead_Status: leadStatus,
              Description: recordDescription,
            },
            Trigger: ["workflow"],
          }).then(function () {
            ZOHO.CRM.UI.Popup.closeReload();
          });
        };
      });
    }
  });
  /*
   * initialize the widget.
   */
  ZOHO.embeddedApp.init();
}
