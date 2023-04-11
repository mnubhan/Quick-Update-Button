function initializeWidget() {
  /*
   * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
   */
  ZOHO.embeddedApp.on("PageLoad", function (data) {
    /*
     * Verify if EntityInformation is Passed
     */
    if (data && data.Entity) {
      /*
       * Get the record information
       */
      ZOHO.CRM.API.getRecord({
        Entity: data.Entity,
        RecordID: data.EntityId,
      }).then(function (response) {
        /*
         * Pass the value to the input fields at the HTML page
         */
        var record = response.data[0];
        var recordId = record["id"];
        var recordLeadStatus = record["Lead_Status"];
        var recordDescription = record["Description"];
        document.getElementById("leadStatus").value = recordLeadStatus;
        document.getElementById("description").value = recordDescription;
        /*
         * Add the onclick event to the update button
         */
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
            // ZOHO.CRM.UI.Popup.closeReload();
            // go to the next page of html
            const divLead = document.getElementById("leadInformation");
            divLead.remove();
            ZOHO.CRM.API.getRelatedRecords({
              Entity: data.Entity,
              RecordID: data.EntityId,
              RelatedList: "Tasks",
              page: 1,
            }).then(function (response) {
              var taskList = response.data;
              console.log(taskList);
              for (var i = 0; i < taskList.length; i++) {
                if (taskList[i]["Status"] !== "Completed") {
                  var newDiv = document.createElement("div");
                  var newSubject = document.createElement("h3");
                  var newSubjectText = document.createTextNode(
                    taskList[i]["Subject"]
                  );
                  newSubject.appendChild(newSubjectText);
                  newDiv.appendChild(newSubject);
                  var newStatus = document.createElement("select");
                  var newStatusOption1 = document.createElement("option");
                  var newStatusOption1Text =
                    document.createTextNode("Not Started");
                  newStatusOption1.appendChild(newStatusOption1Text);
                  newStatus.appendChild(newStatusOption1);
                  var newStatusOption2 = document.createElement("option");
                  var newStatusOption2Text =
                    document.createTextNode("In Progress");
                  newStatusOption2.appendChild(newStatusOption2Text);
                  newStatus.appendChild(newStatusOption2);
                  var newStatusOption3 = document.createElement("option");
                  var newStatusOption3Text =
                    document.createTextNode("Completed");
                  newStatusOption3.appendChild(newStatusOption3Text);
                  newStatus.appendChild(newStatusOption3);
                  var newStatusOption4 = document.createElement("option");
                  var newStatusOption4Text =
                    document.createTextNode("Deffered");
                  newStatusOption4.appendChild(newStatusOption4Text);
                  newStatus.appendChild(newStatusOption4);
                  var newStatusOption5 = document.createElement("option");
                  var newStatusOption5Text = document.createTextNode(
                    "Waiting on someone else"
                  );
                  newStatusOption5.appendChild(newStatusOption5Text);
                  newStatus.appendChild(newStatusOption5);
                  newStatus.setAttribute("id", "taskStatus" + i);
                  newDiv.appendChild(newStatus);
                  var newDescription = document.createElement("textarea");
                  newDescription.setAttribute("id", "taskDescription" + i);
                  newDiv.appendChild(newDescription);
                  var newButton = document.createElement("button");
                  var newButtonText = document.createTextNode("Update Task");
                  newButton.appendChild(newButtonText);
                  newButton.setAttribute("id", "updateTask" + i);
                  newDiv.appendChild(newButton);
                  document
                    .getElementById("mainInformation")
                    .appendChild(newDiv);
                  document.getElementById("taskDescription" + i).value =
                    taskList[i]["Description"];
                  document.getElementById("taskStatus" + i).value =
                    taskList[i]["Status"];
                  document.getElementById("updateTask" + i).onclick =
                    function () {
                      var taskStatus = document.getElementById(
                        "taskStatus" + i
                      ).value;
                      var taskDescription = document.getElementById(
                        "taskDescription" + i
                      ).value;
                      ZOHO.CRM.API.updateRecord({
                        Entity: "Tasks",
                        APIData: {
                          id: taskList[i]["id"],
                          Status: taskStatus,
                          Description: taskDescription,
                        },
                        Trigger: ["workflow"],
                      }).then(function () {});
                    };
                }
              } // end of for loop
              var closeButton = document.createElement("button");
              var closeButtonText = document.createTextNode("Close");
              closeButton.appendChild(closeButtonText);
              closeButton.setAttribute("id", "closeButton");
              document.getElementById("mainInformation").appendChild(closeButton);
              document.getElementById("closeButton").onclick = function () {
                ZOHO.CRM.UI.Popup.closeReload();
              }
            });
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
