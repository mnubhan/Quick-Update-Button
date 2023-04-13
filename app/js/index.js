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
            const divLead = document.getElementById("leadInformation");
            divLead.remove();
            ZOHO.CRM.API.getRelatedRecords({
              Entity: data.Entity,
              RecordID: data.EntityId,
              RelatedList: "Tasks",
              page: 1,
            }).then(function (response) {
              var taskList = response.data;
              var taskTable = document.createElement("table");
              taskTable.setAttribute("id", "taskTable");
              taskTable.setAttribute("class", "taskTable");
              taskTable.setAttribute("border", "1");
              taskTable.setAttribute("cellspacing", "0");
              taskTable.setAttribute("cellpadding", "5");
              taskTable.setAttribute("width", "100%");
              var taskTableHeader = document.createElement("tr");
              taskTableHeader.setAttribute("id", "taskTableHeader");
              document.getElementById("mainInformation").appendChild(taskTable);
              document.getElementById("taskTable").appendChild(taskTableHeader);
              const arrHeaders = [
                "Task Name",
                "Priotity",
                "Status",
                "End Date",
                "Action",
              ];
              arrHeaders.forEach((header, i) => {
                var taskTableHeaderSubject = document.createElement("th");
                taskTableHeaderSubject.setAttribute(
                  "id",
                  `taskTableHeader${i}`
                );
                taskTableHeaderSubject.setAttribute("class", "taskTableHeader");
                var taskTableHeaderSubjectText =
                  document.createTextNode(header);
                taskTableHeaderSubject.appendChild(taskTableHeaderSubjectText);
                document
                  .getElementById("taskTableHeader")
                  .appendChild(taskTableHeaderSubject);
              });
              for (var i = 0; i < taskList.length; i++) {
                if (taskList[i]["Status"] != "Completed") {
                  var taskTableRow = document.createElement("tr");
                  taskTableRow.setAttribute("id", `taskTableRow${i}`);
                  taskTableRow.setAttribute("class", "taskTableRow");
                  document
                    .getElementById("taskTable")
                    .appendChild(taskTableRow);
                  var taskTableSubject = document.createElement("td");
                  taskTableSubject.setAttribute("id", `taskTableSubject${i}`);
                  taskTableSubject.setAttribute("class", "taskTableSubject");
                  var taskTableSubjectText = document.createTextNode(
                    taskList[i]["Subject"]
                  );
                  taskTableSubject.appendChild(taskTableSubjectText);
                  document
                    .getElementById(`taskTableRow${i}`)
                    .appendChild(taskTableSubject);
                  var taskTablePriority = document.createElement("td");
                  taskTablePriority.setAttribute("id", `taskTablePriority${i}`);
                  taskTablePriority.setAttribute("class", "taskTablePriority");
                  var priorityText = document.createTextNode(
                    taskList[i]["Priority"]
                  );
                  taskTablePriority.appendChild(priorityText);
                  document
                    .getElementById(`taskTableRow${i}`)
                    .appendChild(taskTablePriority);
                  var taskTableStatus = document.createElement("td");
                  taskTableStatus.setAttribute("id", `taskTableStatus${i}`);
                  taskTableStatus.setAttribute("class", "taskTableStatus");
                  var taskTableStatusText = document.createTextNode(
                    taskList[i]["Status"]
                  );
                  taskTableStatus.appendChild(taskTableStatusText);
                  document
                    .getElementById(`taskTableRow${i}`)
                    .appendChild(taskTableStatus);
                  var taskTableEndDate = document.createElement("td");
                  taskTableEndDate.setAttribute("id", `taskTableEndDate${i}`);
                  taskTableEndDate.setAttribute("class", "taskTableEndDate");
                  var taskTableEndDateText = document.createTextNode(
                    taskList[i]["Due_Date"]
                  );
                  taskTableEndDate.appendChild(taskTableEndDateText);
                  document
                    .getElementById(`taskTableRow${i}`)
                    .appendChild(taskTableEndDate);
                  var taskTableAction = document.createElement("td");
                  taskTableAction.setAttribute("id", `taskTableAction${i}`);
                  taskTableAction.setAttribute("class", "taskTableAction");
                  var taskTableActionButton = document.createElement("button");
                  var taskTableActionButtonText =
                    document.createTextNode("Close");
                  taskTableActionButton.appendChild(taskTableActionButtonText);
                  taskTableActionButton.setAttribute("class", "btn-task");
                  taskTableAction.appendChild(taskTableActionButton);
                  document
                    .getElementById(`taskTableRow${i}`)
                    .appendChild(taskTableAction);
                  (function (i, taskId) {
                    taskTableActionButton.onclick = function () {
                      ZOHO.CRM.API.updateRecord({
                        Entity: "Tasks",
                        APIData: {
                          id: taskId,
                          Status: "Completed",
                        },
                        Trigger: ["workflow"],
                      }).then(function () {
                        var divTask = document.getElementById(
                          `taskTableRow${i}`
                        );
                        divTask.remove();
                      });
                    };
                  })(i, taskList[i]["id"]);
                }
              }
              var closeButton = document.createElement("button");
              var closeButtonText = document.createTextNode("Close Widget");
              closeButton.appendChild(closeButtonText);
              closeButton.setAttribute("id", "closeButton");
              closeButton.setAttribute("style", "margin-top: 20px;");
              document
                .getElementById("mainInformation")
                .appendChild(closeButton);
              document.getElementById("closeButton").onclick = function () {
                ZOHO.CRM.UI.Popup.closeReload();
              };
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
