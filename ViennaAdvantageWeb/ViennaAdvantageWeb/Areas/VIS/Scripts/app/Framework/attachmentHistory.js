﻿; (function (VIS, $) {

    VIS.AttachmentHistory = function (_AD_Table_ID, _Record_ID, c_BPartner_ID, ad_User_ID, keyColumnName) {

        var windowNo = VIS.Env.getWindowNo();
        var ctx = VIS.Env.getCtx();
        var columns = [], rows = [], colkeys = [];
        var relatedcolumns = [], relatedrows = [], relatedcolkeys = [], isAppointment, userColumns = [], userRows = [], usercolKeys = [];
        var ch, $mainDiv, $inboxDiv, $datagrdRecordInfo, $relatedInfoDiv, $datagrdRaltedRecordInfo, $datagrdUserRecordInfo, $userInfoDiv;
        var self = this;
        var $historycontentwrap, $historyleftwrap, $historysearch, $visattachhistorysearchwrap, $historytabletop, $visapaneltabcontrol, $visattachhistoryappsactionul, $historytablewrap, $visattachhistoryrightwrap, $visattachhistoryrightcontentFormail;
        var $visattachhistoryrightcontentForAppoint, $visattachhistorygriddataForAppoint, resltGrdforMail, resltGrdforAppoint, $visattachhistoryrightwrapNotFound, hisCommentforMail, hisCommentforAppoint;
        var $visattachhistorygriddata, $ulAttach;
        var bpColumnName = "C_BPartnerID"; var userColumnName = "AD_User_ID";
        var $title, $to, $from, $subject, $detail, $date, $txtArea, $bcc, $cc, $titleIcon, $btnSave, $btnSaveAppoint, $txtAreaAppoint, $zoomIcon, $bpzoomIcon, $emaildropdown;
        var $subjectApp, $location, $description, $category, $contacts, $label, $startDate, $endDate, $allDay, $bsyDiv;
        var PAGESIZE = 50, historyPageNo, BPhistoryPageNo, userPageNo, historyCount, BPhistoryCount, userHistoryCount, historyTotalpages, bphistoryTotalpages, userTotalPages, userhistoryPageNo;
        var ulPagging, $firstPage, $lastPage, $nextPage, $previousPage, $pageCombo, $selectPages, searchTextbox, $printBtn;
        var isip, hisSearch, bpSearch, UserSearch;
        var $menu;

        /* Starts Form */
        this.initializeComponent = function () {
            isip = /ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase());
            historyPageNo = 1; BPhistoryPageNo = 1; userhistoryPageNo = 1;
            createPageSettings();
            createContainer();
            busyIndicatior();
            loadRecordDataCount();
            loadRecordData();
            eventHandling();
        };

        function busyIndicatior() {
            $bsyDiv = $("<div>");
            $bsyDiv.css({
                "position": "absolute", "bottom": "0", "background": "url('" + VIS.Application.contextUrl + "Areas/VIS/Images/busy.gif') no-repeat", "background-position": "center center",
                "width": "98%", "height": "98%", 'text-align': 'center', 'opacity': '.1'
            });
            $bsyDiv[0].style.visibility = "hidden";
            $mainDiv.append($bsyDiv);
        };

        /* Containers likes left continer,right container */
        function createContainer() {
            $mainDiv = $('<div style="height:100%">');
            //$mainLeftDiv = $('<div  class="vis-history-mainLeftDiv">');

            $inboxDiv = $('<div class="vis-history-inboxDiv">');
            $relatedInfoDiv = $('<div style="display:none" class="vis-history-mainRelatedDiv">');
            $userInfoDiv = $('<div style="display:none" class="vis-history-mainRelatedDiv">');

            //$mainLeftDiv.append($inboxDiv).append($relatedInfoDiv);

            //$rightmainDiv = $('<div  class="vis-history-mainrightDiv" >');

            //$mainDiv.append($mainLeftDiv).append($rightmainDiv);

            $historycontentwrap = $('<div class="vis-attachhistory-content-wrap">');


            $historyleftwrap = $('<div class="vis-attachhistory-left-wrap">');


            $historytabletop = $('<div class="vis-attachhistory-table-top">');

            $visattachhistorysearchwrap = $('<div class="vis-attachhistory-search-wrap">');
            $historysearch = $('<div class="vis-attachhistory-search">').append(' <input placeholder="' + VIS.Msg.getMsg("Search") + '" type="text">').append('<span class="vis-attachhistory-search-icon"></span>');
            $visattachhistorysearchwrap.append('<img class="prthistory" style="margin-top:15px;margin-left:40px" title="' + VIS.Msg.getMsg("Print") + '" src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-print.png"  />').append($historysearch);



            $visattachhistoryrightwrap = $('<div class="vis-attachhistory-right-wrap">');

            $visattachhistoryrightwrapNotFound = $('<div class="vis-attachhistory-right-wrap">').hide();
            if (isip == true) {
                $visattachhistoryrightwrapNotFound.append('<label class="vis-attachhistory-noRecFoundforIP" > ' + VIS.Msg.getMsg("NoRecordFound") + ' </label>');
            }
            else {
                $visattachhistoryrightwrapNotFound.append('<label class="vis-attachhistory-noRecFound" > ' + VIS.Msg.getMsg("NoRecordFound") + ' </label>');
            }


            $visapaneltabcontrol = $('<div class="vis-attachhistory-apanel-tabcontrol">');
            $visattachhistoryappsactionul = $('<ul class="vis-attachhistory-appsaction-ul vis-attachhistory-apanel-tabcontrol-ul">');
            $visattachhistoryappsactionul.append('<li data-type="History" class="vis-attachhistory-apanel-tab-selected" style="opacity: 1;">' + VIS.Msg.getMsg("History") + '</li><li  data-type="RelatedHistory"  style="opacity: 1;">' + VIS.Msg.getMsg("RelatedHistory") + '</li>');

            if (c_BPartner_ID > 0) {
                $visattachhistoryappsactionul.append('<li  data-type="UserHistory"  style="opacity: 1;">' + VIS.Msg.getMsg("UserHistory") + '</li>');
            }

            $historytabletop.append($visapaneltabcontrol.append($visattachhistoryappsactionul));
            $historytablewrap = $('<div class="vis-attachhistory-table-wrap">').append($inboxDiv).append($relatedInfoDiv).append($userInfoDiv).append(ulPagging);




            $mainDiv.append($historycontentwrap.append($historyleftwrap.append($historytabletop).append($historytablewrap)));
            $historycontentwrap.append($visattachhistorysearchwrap).append($visattachhistoryrightwrap).append($visattachhistoryrightwrapNotFound);


            searchTextbox = $visattachhistorysearchwrap.find('input');
            $printBtn = $historysearch.find('.prthistory');

            $ulAttach = $('<ul class="vis-his-attachs">');

            //$btnSave = $('<div class="vis-attachhistory-save-btn"><a> ' + VIS.Msg.getMsg("Save") + '</a>');
            //$btnSaveAppoint = $('<div class="vis-attachhistory-save-btn"><a> ' + VIS.Msg.getMsg("Save") + '</a>');

            $menu = $("<ul class='vis-apanel-rb-ul'>");
            $menu.append('<li style="display:none" data-type="R"><a><span class="vis-attachhistory-email-icon vis-attachhistory-reply-icon"></span>' + VIS.Msg.getMsg('Reply') + '</a></li> <li data-type="F"><a style="color: rgb(111, 111, 111); "><span class="vis-attachhistory-email-icon vis-attachhistory-forword-icon"></span>' + VIS.Msg.getMsg('Forward') + '</a></li>');


        };

        function createPageSettings() {
            ulPagging = $('<ul style="float:right;margin-top:10px" class="vis-statusbar-ul">');

            $firstPage = $('<li style="opacity: 1;"><div><img src="' + VIS.Application.contextUrl + 'Areas/VIS/Images/base/PageFirst16.png" alt="First Page" title="First Page" style="opacity: 0.6;"></div></li>');

            $previousPage = $('<li style="opacity: 1;"><div><img src="' + VIS.Application.contextUrl + 'Areas/VIS/Images/base/PageUp16.png" alt="Page Up" title="Page Up" style="opacity: 0.6;"></div></li>');

            $pageCombo = $('<li><select class="vis-statusbar-combo"></select></li>');

            $nextPage = $('<li style="opacity: 1;"><div><img src="' + VIS.Application.contextUrl + 'Areas/VIS/Images/base/PageDown16.png" alt="Page Down" title="Page Down" style="opacity: 0.6;"></div></li>');

            $lastPage = $('<li style="opacity: 1;"><div><img src="' + VIS.Application.contextUrl + 'Areas/VIS/Images/base/PageLast16.png" alt="Last Page" title="Last Page" style="opacity: 0.6;"></div></li>');


            ulPagging.append($firstPage).append($previousPage).append($pageCombo).append($nextPage).append($lastPage);

        }

        function loadRecordDataCount(searchText) {
            $bsyDiv[0].style.visibility = "visible";

            var strAppCount = "SELECT count(*) FROM " +
                    "( SELECT AppointmentsInfo_ID AS ID, record_ID, created,'" + VIS.Msg.getMsg("Appointment") + "' AS TYPE,Subject FROM AppointmentsInfo WHERE record_Id =" + _Record_ID;
            if (searchText != "undefined" && searchText != null && searchText != "") {
                strAppCount += " AND upper(Subject)  like upper('%" + searchText + "%')";
            }
            strAppCount += " And Ad_Table_Id = " + _AD_Table_ID + " And AD_User_ID = " + ctx.getAD_User_ID() + " UNION" +
            " SELECT MAILATTACHMENT1_ID AS ID, record_ID,created,'" + VIS.Msg.getMsg("SentMail") + "' AS TYPE, TITLE AS Subject FROM mailattachment1 WHERE record_id=" + _Record_ID;
            if (searchText != "undefined" && searchText != null && searchText != "") {
                strAppCount += " AND upper(title)  like upper('%" + searchText + "%')";
            }
            strAppCount += " And attachmenttype='M' And ad_table_id=" + _AD_Table_ID + " UNION" +
            " SELECT MAILATTACHMENT1_ID AS ID, record_ID,created,'" + VIS.Msg.getMsg("InboxMail") + "' AS TYPE, TITLE AS Subject FROM mailattachment1 WHERE record_id=" + _Record_ID;
            if (searchText != "undefined" && searchText != null && searchText != "") {
                strAppCount += " AND upper(title)  like upper('%" + searchText + "%')";
            }
            strAppCount += " And attachmenttype='I' And ad_table_id=" + _AD_Table_ID + " UNION" +
            " SELECT MAILATTACHMENT1_ID AS ID, record_ID,created,'" + VIS.Msg.getMsg("Letter") + "' AS TYPE, TITLE AS Subject FROM mailattachment1  WHERE record_id=" + _Record_ID;
            if (searchText != "undefined" && searchText != null && searchText != "") {
                strAppCount += " AND upper(title)  like upper('%" + searchText + "%')";
            }
            strAppCount += " And attachmenttype='L' And ad_table_id=" + _AD_Table_ID + ") ORDER BY created DESC";
            historyCount = VIS.DB.executeScalar(strAppCount);

            var tp = parseInt(historyCount / PAGESIZE);

            historyTotalpages = tp + ((historyCount % PAGESIZE) > 0 ? 1 : 0);
            historyPageNo = 1;
            $selectPages = $pageCombo.find('select');
            $selectPages.empty();

            for (var c = 1; c <= historyTotalpages; c++) {
                $selectPages.append('<option>' + c + '</option>');
            }

            $firstPage.css("opacity", "0.6");
            $previousPage.css("opacity", "0.6");

        };

        /* Loads info for showing in attached history of current record */
        function loadRecordData(searchText) {
            var strApp = "SELECT * FROM " +
                    "( SELECT ai.AppointmentsInfo_ID AS ID, ai.record_ID, ai.created,'" + VIS.Msg.getMsg("Appointment") + "' AS TYPE,ai.Subject,au.name  FROM AppointmentsInfo ai JOIN AD_User au on au.AD_User_ID=ai.createdby WHERE ai.record_Id =" + _Record_ID;
            if (searchText != "undefined" && searchText != null && searchText != "") {
                strApp += " AND upper(ai.Subject)  like upper('%" + searchText + "%')";
            }
            strApp += " AND ai.IsTask='N' And ai.Ad_Table_Id = " + _AD_Table_ID + " And ai.AD_User_ID = " + ctx.getAD_User_ID() + ")   UNION" +


                "( SELECT ai.AppointmentsInfo_ID AS ID, ai.record_ID, ai.created,'" + VIS.Msg.getMsg("Appointment") + "' AS TYPE,ai.Subject,au.name  FROM AppointmentsInfo ai JOIN AD_User au on au.AD_User_ID=ai.createdby WHERE ai.record_Id =" + _Record_ID;
            if (searchText != "undefined" && searchText != null && searchText != "") {
                strApp += " AND upper(ai.Subject)  like upper('%" + searchText + "%')";
            }
            strApp += " AND ai.IsTask='Y' And ai.Ad_Table_Id = " + _AD_Table_ID + "   UNION" +



            " SELECT ai.MAILATTACHMENT1_ID AS ID, ai.record_ID,ai.created,'" + VIS.Msg.getMsg("SentMail") + "' AS TYPE, ai.TITLE AS Subject,au.name  FROM mailattachment1 ai JOIN AD_User au on au.AD_User_ID=ai.createdby WHERE ai.record_id=" + _Record_ID;
            if (searchText != "undefined" && searchText != null && searchText != "") {
                strApp += " AND upper(ai.title)  like upper('%" + searchText + "%')";
            }
            strApp += " And ai.attachmenttype='M' And ai.ad_table_id=" + _AD_Table_ID + " UNION" +
            " SELECT ai.MAILATTACHMENT1_ID AS ID, ai.record_ID,ai.created,'" + VIS.Msg.getMsg("InboxMail") + "' AS TYPE, ai.TITLE AS Subject,au.name  FROM mailattachment1 ai JOIN AD_User au on au.AD_User_ID=ai.createdby WHERE ai.record_id=" + _Record_ID;
            if (searchText != "undefined" && searchText != null && searchText != "") {
                strApp += " AND upper(ai.title)  like upper('%" + searchText + "%')";
            }
            strApp += " And ai.attachmenttype='I' And ai.ad_table_id=" + _AD_Table_ID + " UNION" +
            " SELECT ai.MAILATTACHMENT1_ID AS ID, ai.record_ID,ai.created,'" + VIS.Msg.getMsg("Letter") + "' AS TYPE, ai.TITLE AS Subject,au.name  FROM mailattachment1 ai JOIN AD_User au on au.AD_User_ID=ai.createdby WHERE ai.record_id=" + _Record_ID;
            if (searchText != "undefined" && searchText != null && searchText != "") {
                strApp += " AND upper(ai.title)  like upper('%" + searchText + "%')";
            }
            strApp += " And ai.attachmenttype='L' And ai.ad_table_id=" + _AD_Table_ID + ") ORDER BY created DESC";
            var ds = VIS.DB.executeDataSetPaging(strApp, historyPageNo, PAGESIZE);
            if (ds != null && ds.getTables().length > 0) {
                createInbox(ds);
            }
        };

        /* Loads info for showing in Ralted history of current record */
        function loadRelatedInfo(searchText) {
            if (searchText == undefined || searchText == null) {
                searchText = "";
            }
            $.ajax({
                url: VIS.Application.contextUrl + "AttachmentHistory/RelatedHistory",
                datatype: "json",
                type: "get",
                cache: false,
                data: { keyColumnID: _Record_ID, pageSize: PAGESIZE, pageNo: BPhistoryPageNo, searchText: VIS.Utility.encodeText(searchText), keyColName: keyColumnName },
                success: function (data) {
                    var result = JSON.parse(data);
                    createRaltedInfo(result);

                    if (BPhistoryCount == undefined || BPhistoryCount == 0 || isSearch == true) {
                        BPhistoryCount = result.TotalRecords;
                        var tp = parseInt(BPhistoryCount / PAGESIZE);
                        BPhistoryPageNo = 1;
                        bphistoryTotalpages = tp + ((BPhistoryCount % PAGESIZE) > 0 ? 1 : 0);

                        $selectPages = $pageCombo.find('select');
                        $selectPages.empty();

                        for (var c = 1; c <= bphistoryTotalpages; c++) {
                            $selectPages.append('<option>' + c + '</option>');
                        }

                        $firstPage.css("opacity", "0.6");
                        $previousPage.css("opacity", "0.6");
                        displayRelatedDiv();
                    }
                    else {
                        refreshBPDiv();
                    }
                    $bsyDiv[0].style.visibility = "hidden";
                    isSearch = false;

                    // $visattachhistoryrightwrap.find('*').show();
                },
                error: function (err) {
                    console.log(err);
                    $bsyDiv[0].style.visibility = "hidden";
                    isSearch = false;
                }
            });
        };

        /* Loads info for showing in Ralted history of current record */
        function loadUserInfo(searchText) {
            if (searchText == undefined || searchText == null) {
                searchText = "";
            }
            $.ajax({
                url: VIS.Application.contextUrl + "AttachmentHistory/UserHistory",
                datatype: "json",
                type: "get",
                cache: false,
                data: { C_BPartner_ID: c_BPartner_ID, pageSize: PAGESIZE, pageNo: userhistoryPageNo, searchText: VIS.Utility.encodeText(searchText) },
                success: function (data) {
                    var result = JSON.parse(data);
                    createUserInfo(result);

                    if (userHistoryCount == undefined || userHistoryCount == 0 || isSearch == true) {
                        userHistoryCount = result.TotalRecords;
                        var tp = parseInt(userHistoryCount / PAGESIZE);
                        userhistoryPageNo = 1;
                        userTotalPages = tp + ((userHistoryCount % PAGESIZE) > 0 ? 1 : 0);

                        $selectPages = $pageCombo.find('select');
                        $selectPages.empty();

                        for (var c = 1; c <= userTotalPages; c++) {
                            $selectPages.append('<option>' + c + '</option>');
                        }

                        $firstPage.css("opacity", "0.6");
                        $previousPage.css("opacity", "0.6");
                        displayUserDiv();
                    }
                    else {
                        refreshUserDiv();
                    }
                    $bsyDiv[0].style.visibility = "hidden";
                    isSearch = false;

                    //$visattachhistoryrightwrap.find('*').show();
                },
                error: function (err) {
                    console.log(err);
                    $bsyDiv[0].style.visibility = "hidden";
                    isSearch = false;
                }
            });
        };

        /* Create Array of data retervied for showing in datagrid   of User record */
        function createUserInfo(results) {
            userColumns = [];
            userRows = [];
            var result = results.RHistory;


            userColumns.push({ field: "ID", caption: VIS.Msg.getMsg("id"), size: '150px', hidden: true });
            userColumns.push({ field: "Record_ID", caption: VIS.Msg.getMsg("record_id"), size: '150px', hidden: true });
            userColumns.push({ field: "Created", caption: VIS.Msg.getMsg("Date"), size: '150px', hidden: false });
            userColumns.push({ field: "Type", caption: VIS.Msg.getMsg("Type"), size: '150px', hidden: false });

            if (VIS.Application.isRTL) {
                userColumns.push({
                    field: "TableName", caption: VIS.Msg.getMsg("Table"), size: '150px', hidden: false, resizable: true, style: 'text-align: right', render: function (record) {
                        var img = $('<img class="findImg" data-ids="' + record.Record_ID + '-' + record.AD_Table_ID + '" style="margin-left:10px;cursor:pointer" src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-zoom.png" alt="email"  >');
                        var html = $('<div >').append(img).append(record.TableName);
                        return html.html();
                    }
                });
            }
            else {
                userColumns.push({
                    field: "TableName", caption: VIS.Msg.getMsg("Table"), size: '150px', hidden: false, resizable: true, style: 'text-align: left', render: function (record) {
                        var img = $('<img class="findImg" data-ids="' + record.Record_ID + '-' + record.AD_Table_ID + '" style="margin-right:10px;cursor:pointer" src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-zoom.png" alt="email"  >');
                        var html = $('<div >').append(img).append(record.TableName);
                        return html.html();
                    }
                });
            }
            userColumns.push({ field: "Subject", caption: VIS.Msg.getMsg("Subject"), size: '150px', hidden: false });
            userColumns.push({ field: "UserName", caption: VIS.Msg.getMsg("UserName"), size: '150px', hidden: false });


            if (result.length > 0) {
                usercolKeys = Object.keys(result[0]);
            }

            for (var c = 0; c < usercolKeys.length; c++) {

                if (usercolKeys[c] == "ID" || usercolKeys[c] == "Record_ID" || usercolKeys[c] == "Created" || usercolKeys[c] == "Type" || usercolKeys[c] == "TableName" || usercolKeys[c] == "Subject"
                    || usercolKeys[c] == "UserName") {
                    continue;
                }
                else {
                    userColumns.push({ field: usercolKeys[c], caption: VIS.Msg.getMsg(usercolKeys[c]), size: '100px', hidden: true });
                }
            }



            for (var i = 0; i < result.length; i++) {
                var singleRow = {};
                singleRow['recid'] = i;
                for (var c = 0; c < usercolKeys.length; c++) {
                    if (usercolKeys[c] == "Created") {
                        singleRow[usercolKeys[c]] = new Date(result[i][usercolKeys[c]]).toLocaleString();
                    }
                    else if (usercolKeys[c] == "Type") {
                        if (result[i][usercolKeys[c]] == "A") {
                            singleRow[usercolKeys[c]] = VIS.Msg.getMsg("Appointment");
                        }
                        else if (result[i][usercolKeys[c]] == "L") {
                            singleRow[usercolKeys[c]] = VIS.Msg.getMsg("Letter");
                        }
                        else if (result[i][usercolKeys[c]] == "M") {
                            singleRow[usercolKeys[c]] = VIS.Msg.getMsg("SentMail");
                        }
                        else if (result[i][usercolKeys[c]] == "Z") {
                            singleRow[usercolKeys[c]] = VIS.Msg.getMsg("InboxMail");
                        }
                    }
                    else {
                        singleRow[usercolKeys[c]] = VIS.Utility.encodeText(result[i][usercolKeys[c]]);
                    }
                }
                userRows.push(singleRow);
            }
        };


        /* Create Array of data retervied for showing in datagrid   of Related record */
        function createRaltedInfo(results) {
            relatedcolumns = [];
            relatedrows = [];
            var result = results.RHistory;


            relatedcolumns.push({ field: "ID", caption: VIS.Msg.getMsg("id"), size: '150px', hidden: true });
            relatedcolumns.push({ field: "Record_ID", caption: VIS.Msg.getMsg("record_id"), size: '150px', hidden: true });
            relatedcolumns.push({ field: "Created", caption: VIS.Msg.getMsg("Date"), size: '150px', hidden: false });
            relatedcolumns.push({ field: "Type", caption: VIS.Msg.getMsg("Type"), size: '150px', hidden: false });
            if (VIS.Application.isRTL) {
                relatedcolumns.push({
                    field: "TableName", caption: VIS.Msg.getMsg("Table"), size: '150px', hidden: false, resizable: true, style: 'text-align: right', render: function (record) {
                        var img = $('<img class="findImg" data-ids="' + record.Record_ID + '-' + record.AD_Table_ID + '" style="margin-left:10px;cursor:pointer" src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-zoom.png" alt="email"  >');
                        var html = $('<div >').append(img).append(record.TableName);
                        return html.html();
                    }
                });
            }
            else {
                relatedcolumns.push({
                    field: "TableName", caption: VIS.Msg.getMsg("Table"), size: '150px', hidden: false, resizable: true, style: 'text-align: left', render: function (record) {
                        var img = $('<img class="findImg" data-ids="' + record.Record_ID + '-' + record.AD_Table_ID + '" style="margin-right:10px;cursor:pointer" src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-zoom.png" alt="email"  >');
                        var html = $('<div >').append(img).append(record.TableName);
                        return html.html();
                    }
                });
            }
            relatedcolumns.push({ field: "Subject", caption: VIS.Msg.getMsg("Subject"), size: '150px', hidden: false });


            if (result.length > 0) {
                colkeys = Object.keys(result[0]);
            }

            for (var c = 0; c < colkeys.length; c++) {

                if (colkeys[c] == "ID" || colkeys[c] == "Record_ID" || colkeys[c] == "Created" || colkeys[c] == "Type" || colkeys[c] == "TableName" || colkeys[c] == "Subject") {
                    continue;
                }
                else {
                    relatedcolumns.push({ field: colkeys[c], caption: VIS.Msg.getMsg(colkeys[c]), size: '100px', hidden: true });
                }
            }



            for (var i = 0; i < result.length; i++) {
                var singleRow = {};
                singleRow['recid'] = i;
                for (var c = 0; c < colkeys.length; c++) {
                    if (colkeys[c] == "Created") {
                        singleRow[colkeys[c]] = new Date(result[i][colkeys[c]]).toLocaleString();
                    }
                    else if (colkeys[c] == "Type") {
                        if (result[i][colkeys[c]] == "A") {
                            singleRow[colkeys[c]] = VIS.Msg.getMsg("Appointment");
                        }
                        else if (result[i][colkeys[c]] == "L") {
                            singleRow[colkeys[c]] = VIS.Msg.getMsg("Letter");
                        }
                        else if (result[i][colkeys[c]] == "M") {
                            singleRow[colkeys[c]] = VIS.Msg.getMsg("SentMail");
                        }
                        else if (result[i][colkeys[c]] == "I") {
                            singleRow[colkeys[c]] = VIS.Msg.getMsg("InboxMail");
                        }
                    }
                    else {
                        singleRow[colkeys[c]] = VIS.Utility.encodeText(result[i][colkeys[c]]);
                    }
                }
                relatedrows.push(singleRow);
            }
        };



        /* Create Array of data retervied for showing in datagrid   of current record */
        function createInbox(ds) {
            columns = [];
            rows = [];

            for (var c = 0; c < ds.tables[0].columns.length; c++) {

                if (ds.tables[0].columns[c].name == "id") {
                    columns.push({ field: ds.tables[0].columns[c].name, caption: VIS.Msg.getMsg("id"), size: '150px', hidden: true });
                }
                else if (ds.tables[0].columns[c].name == "record_id") {
                    columns.push({ field: ds.tables[0].columns[c].name, caption: VIS.Msg.getMsg("record_id"), size: '150px', hidden: true });
                }
                else if (ds.tables[0].columns[c].name == "created") {
                    columns.push({ field: ds.tables[0].columns[c].name, caption: VIS.Msg.getMsg("Date"), size: '150px', hidden: false });
                }
                else if (ds.tables[0].columns[c].name == "type") {
                    columns.push({ field: ds.tables[0].columns[c].name, caption: VIS.Msg.getMsg("Type"), size: '150px', hidden: false });
                }
                else if (ds.tables[0].columns[c].name == "name") {
                    columns.push({ field: ds.tables[0].columns[c].name, caption: VIS.Msg.getMsg("CreatedBy"), size: '150px', hidden: false });
                }
                else if (ds.tables[0].columns[c].name == "subject") {
                    if (isip == true) {
                        columns.push({ field: ds.tables[0].columns[c].name, caption: VIS.Msg.getMsg("Subject"), size: '150px', hidden: false });
                    }
                    else {
                        columns.push({ field: ds.tables[0].columns[c].name, caption: VIS.Msg.getMsg("Subject"), size: '230px', hidden: false });
                    }
                }
                else {
                    columns.push({ field: ds.tables[0].columns[c].name, caption: VIS.Msg.getMsg(ds.tables[0].columns[c].name), size: '100px', hidden: true });
                }
            }

            if (ds.tables[0].rows.length > 0) {
                colkeys = Object.keys(ds.tables[0].rows[0].cells);
            }

            for (var r = 0; r < ds.tables[0].rows.length; r++) {
                var singleRow = {};

                singleRow['recid'] = r;
                for (var c = 0; c < colkeys.length; c++) {
                    var colna = colkeys[c];
                    if (colkeys[c] == "created") {
                        singleRow[colkeys[c]] = new Date(ds.tables[0].rows[r].cells[colna]).toLocaleString();
                    }
                    else {
                        singleRow[colna] = VIS.Utility.encodeText(ds.tables[0].rows[r].cells[colna]);
                    }
                }
                rows.push(singleRow);
            }

        };


        /* it will display data in grid. it will be invoked after Form display otherwise datagrid will not render. */
        function displayUserDiv() {
            if ($datagrdUserRecordInfo != undefined && $datagrdUserRecordInfo != null) {
                $datagrdUserRecordInfo.destroy();
                $datagrdUserRecordInfo = null;
            }
            $datagrdUserRecordInfo = $userInfoDiv.w2grid({
                name: 'userhistorygrid',
                recordHeight: 30,
                show: { toolbar: true },
                multiSelect: false,
                columns: userColumns,
                records: userRows
            });

            $datagrdUserRecordInfo.on("select", dataChanged);

            $datagrdUserRecordInfo.on("search", filter);

            if (userRows.length > 0) {
                $datagrdUserRecordInfo.select(0);
                $visattachhistoryrightwrapNotFound.hide();
                $visattachhistoryrightwrap.show();
            }
            else {
                $visattachhistoryrightwrapNotFound.show();
                $visattachhistoryrightwrap.hide();
            }

            $('.findImg').on("click", function (e) {

                var ids = $(e.target).data("ids").split('-');
                VIS.AEnv.zoom(ids[1], ids[0]);
            });


        };



        /* it will display data in grid. it will be invoked after Form display otherwise datagrid will not render. */
        function displayRelatedDiv() {
            if ($datagrdRaltedRecordInfo != undefined && $datagrdRaltedRecordInfo != null) {
                $datagrdRaltedRecordInfo.destroy();
                $datagrdRaltedRecordInfo = null;
            }
            $datagrdRaltedRecordInfo = $relatedInfoDiv.w2grid({
                name: 'realtedhistorygrid',
                recordHeight: 30,
                show: { toolbar: true },
                multiSelect: false,
                columns: relatedcolumns,
                records: relatedrows
            });

            $datagrdRaltedRecordInfo.on("select", dataChanged);

            $datagrdRaltedRecordInfo.on("search", filter);

            if (relatedrows.length > 0) {
                $datagrdRaltedRecordInfo.select(0);
                $visattachhistoryrightwrapNotFound.hide();
                $visattachhistoryrightwrap.show();
            }
            else {
                $visattachhistoryrightwrapNotFound.show();
                $visattachhistoryrightwrap.hide();
            }

            $('.findImg').on("click", function (e) {

                var ids = $(e.target).data("ids").split('-');
                VIS.AEnv.zoom(ids[1], ids[0]);
            });


        };

        /* it will display data in grid. it will be invoked after Form display otherwise datagrid will not render. */
        this.displayInboxDiv = function () {
            $datagrdRecordInfo = $inboxDiv.w2grid({
                name: 'historyinboxgrid',
                recordHeight: 30,
                show: { toolbar: true },
                multiSelect: false,
                columns: columns,
                records: rows
            });
            $datagrdRecordInfo.on("select", dataChanged);
            $datagrdRecordInfo.on("search", filter);
            if (rows.length > 0) {
                $datagrdRecordInfo.select(0);
                $visattachhistoryrightwrapNotFound.hide();
                $visattachhistoryrightwrap.show();
            }
            else {
                $visattachhistoryrightwrapNotFound.show();
                $visattachhistoryrightwrap.hide();
            }
            $bsyDiv[0].style.visibility = "hidden";

            $('.vis-attachhistory-search-icon').on("click", search);
        };

        function refreshInboxDiv() {

            $datagrdRecordInfo.destroy();
            $datagrdRecordInfo = null;

            $datagrdRecordInfo = $inboxDiv.w2grid({
                name: 'historyinboxgrid',
                recordHeight: 30,
                show: { toolbar: true },
                multiSelect: false,
                columns: columns,
                records: rows
            });
            $datagrdRecordInfo.on("select", dataChanged);
            $datagrdRecordInfo.on("search", filter);

            if (rows.length > 0) {
                $datagrdRecordInfo.select(0);
                $visattachhistoryrightwrapNotFound.hide();
                $visattachhistoryrightwrap.show();
            }
            else {
                $visattachhistoryrightwrapNotFound.show();
                $visattachhistoryrightwrap.hide();
            }
            $bsyDiv[0].style.visibility = "hidden";
            $bsyDiv[0].style.visibility = "hidden";
        };


        function refreshBPDiv() {

            $datagrdRaltedRecordInfo.destroy();
            $datagrdRaltedRecordInfo = null;

            $datagrdRaltedRecordInfo = $relatedInfoDiv.w2grid({
                name: 'realtedhistorygrid',
                recordHeight: 30,
                show: { toolbar: true },
                multiSelect: false,
                columns: relatedcolumns,
                records: relatedrows
            });
            $datagrdRaltedRecordInfo.on("select", dataChanged);
            $datagrdRaltedRecordInfo.on("search", filter);
            //if (relatedrows.length > 0) {
            //    $datagrdRaltedRecordInfo.select(0);
            //}

            if (relatedrows.length > 0) {
                $datagrdRaltedRecordInfo.select(0);
                $visattachhistoryrightwrapNotFound.hide();
                $visattachhistoryrightwrap.show();
            }
            else {
                $visattachhistoryrightwrapNotFound.show();
                $visattachhistoryrightwrap.hide();
            }



            $bsyDiv[0].style.visibility = "hidden";
            $('.findImg').off("click");
            $('.findImg').on("click", function (e) {

                var ids = $(e.target).data("ids").split('-');
                VIS.AEnv.zoom(ids[1], ids[0]);
            });


        };

        function refreshUserDiv() {

            $datagrdUserRecordInfo.destroy();
            $datagrdUserRecordInfo = null;

            $datagrdUserRecordInfo = $userInfoDiv.w2grid({
                name: 'userhistorygrid',
                recordHeight: 30,
                show: { toolbar: true },
                multiSelect: false,
                columns: userColumns,
                records: userRows
            });
            $datagrdUserRecordInfo.on("select", dataChanged);
            $datagrdUserRecordInfo.on("search", filter);
            //if (relatedrows.length > 0) {
            //    $datagrdRaltedRecordInfo.select(0);
            //}

            if (userRows.length > 0) {
                $datagrdUserRecordInfo.select(0);
                $visattachhistoryrightwrapNotFound.hide();
                $visattachhistoryrightwrap.show();
            }
            else {
                $visattachhistoryrightwrapNotFound.show();
                $visattachhistoryrightwrap.hide();
            }



            $bsyDiv[0].style.visibility = "hidden";
            $('.findImg').off("click");
            $('.findImg').on("click", function (e) {

                var ids = $(e.target).data("ids").split('-');
                VIS.AEnv.zoom(ids[1], ids[0]);
            });


        };


        /*Events on all Controls */
        function eventHandling() {
            $visattachhistoryappsactionul.on("click", tabClick);

            $visattachhistorysearchwrap.find('input').on("keydown", search);
            $visattachhistorysearchwrap.find('img').on("click", printData);
            $ulAttach.on("click", downLoadAttach);
            $visattachhistoryrightwrap.on("keydown", save)

            $visattachhistoryrightwrap.on("click", save);
            $nextPage.on("click", nextPage);
            $previousPage.on("click", previousPage);
            $pageCombo.on("change", pageChange);
            $firstPage.on("click", firstPage);
            $lastPage.on("click", lastPage);
            $menu.on(VIS.Events.onTouchStartOrClick, "LI", function (e) {
                var action = $(this).data("type");
                panelAction(action, e);
            });
        };

        function panelAction(data, e) {
            var email = null;
            if (data == "R") {

            }
            else if (data == "F") {
                email = new VIS.Email("", null, null, _Record_ID, true, true, _AD_Table_ID, $detail.html(), $title.text(), attachID);
            }
            var c = new VIS.CFrame();
            c.setName(VIS.Msg.getMsg("EMail"));
            c.setTitle(VIS.Msg.getMsg("EMail"));
            c.hideHeader(true);
            c.setContent(email);
            c.show();
            email.initializeComponent();
            ch.close();
        };

        function printData(e) {
            if ($visattachhistorygriddataForAppoint != undefined && $visattachhistorygriddataForAppoint.is(':visible') == true) {

                //  $visattachhistorygriddataForAppoint.find(".vis-his-attachs").find('li').after('</br>');

                $('.vis-attachhistory-right-row > ul > li').css('float', 'left');
                $('.vis-attachhistory-right-row > ul').css("height", "auto");
                
                
                finalPrint($visattachhistorygriddataForAppoint.html());
                $('.vis-attachhistory-right-row > ul > li').css('float', 'none');
                $('.vis-attachhistory-right-row > ul').css("height", "45px");
              //  $visattachhistorygriddataForAppoint.find(".vis-his-attachs").find('br').remove();
            }
            else if ($visattachhistorygriddata != undefined && $visattachhistorygriddata.is(':visible') == true) {
                //$visattachhistorygriddata.find(".vis-his-attachs").find('li').after('</br>');
                $('.vis-attachhistory-right-row > ul > li').css('float', 'left');
                $('.vis-attachhistory-right-row > ul').css("height", "auto");
                $($('.vis-attachhistory-to').find('p')).text($($('.vis-attachhistory-to').find('p')).text().replace(/;/g, "; "));
                $($('.vis-attachhistory-bcc').find('p')).text($($('.vis-attachhistory-bcc').find('p')).text().replace(/;/g, "; "));
                $($('.vis-attachhistory-cc').find('p')).text($($('.vis-attachhistory-cc').find('p')).text().replace(/;/g, "; "));
                finalPrint($visattachhistorygriddata.html());
                $('.vis-attachhistory-right-row > ul > li').css('float', 'none');
                $('.vis-attachhistory-right-row > ul').css("height", "45px");
                $($('.vis-attachhistory-to').find('p')).text($($('.vis-attachhistory-to').find('p')).text().replace(/; /g, ";"));
                $($('.vis-attachhistory-bcc').find('p')).text($($('.vis-attachhistory-bcc').find('p')).text().replace(/; /g, ";"));
                $($('.vis-attachhistory-cc').find('p')).text($($('.vis-attachhistory-cc').find('p')).text().replace(/; /g, ";"));
            }

        };

        function finalPrint(html) {
            var mywindow = window.open();
            var link = '<link rel="stylesheet" href="' + VIS.Application.contextUrl + 'Areas/VIS/Content/VISAD.css" />';
            mywindow.document.write(link + html);
            mywindow.print();
            mywindow.close();
        };


        var isSearch = false;
        function search(e) {
            if (e.keyCode != undefined && e.keyCode != 13) {
                return;
            }
            if (searchTextbox == undefined || searchTextbox == null) {
                return;
            }


            isSearch = true;
            //|| searchTextbox.val() == null || searchTextbox.val().trim() == ""
            if ($inboxDiv.is(':visible')) {
                $bsyDiv[0].style.visibility = "visible";
                loadRecordDataCount(searchTextbox.val());
                loadRecordData(searchTextbox.val());
                hisSearch = searchTextbox.val();
                refreshInboxDiv();
            }
            else if ($relatedInfoDiv.is(':visible')) {
                $bsyDiv[0].style.visibility = "visible";
                loadRelatedInfo(searchTextbox.val());
                bpSearch = searchTextbox.val();
            }
            else {
                $bsyDiv[0].style.visibility = "visible";
                loadUserInfo(searchTextbox.val());
                UserSearch = searchTextbox.val();
            }


        };

        function nextPage(e) {

            if ($inboxDiv.is(':visible')) {
                if (historyPageNo < historyTotalpages) {
                    $bsyDiv[0].style.visibility = "visible";
                    historyPageNo++;
                    $selectPages.val(historyPageNo);
                    loadRecordData();
                    refreshInboxDiv();
                }
                sethistoryPageButtons();
            }
            else if ($relatedInfoDiv.is(':visible')) {
                if (BPhistoryPageNo < bphistoryTotalpages) {
                    $bsyDiv[0].style.visibility = "visible";
                    BPhistoryPageNo++;
                    $selectPages.val(BPhistoryPageNo);
                    loadRelatedInfo();
                    setBPhistoryPageButtons();
                }
            }
            else {
                if (userhistoryPageNo < userTotalPages) {
                    $bsyDiv[0].style.visibility = "visible";
                    userhistoryPageNo++;
                    $selectPages.val(userhistoryPageNo);
                    loadUserInfo();
                    setUserhistoryPageButtons();
                }
            }
        };

        function previousPage(e) {

            if ($inboxDiv.is(':visible')) {
                if (historyPageNo > 1) {
                    $bsyDiv[0].style.visibility = "visible";
                    historyPageNo--;
                    $selectPages.val(historyPageNo);
                    loadRecordData();
                    refreshInboxDiv();
                }
                sethistoryPageButtons();
            }
            else if ($relatedInfoDiv.is(':visible')) {
                if (BPhistoryPageNo > 1) {
                    $bsyDiv[0].style.visibility = "visible";
                    BPhistoryPageNo--;
                    $selectPages.val(BPhistoryPageNo);
                    loadRelatedInfo();
                }
                setBPhistoryPageButtons();
            }
            else {
                if (userhistoryPageNo > 1) {
                    $bsyDiv[0].style.visibility = "visible";
                    userhistoryPageNo--;
                    $selectPages.val(userhistoryPageNo);
                    loadUserInfo();
                }
                setUserhistoryPageButtons();
            }
        };

        function pageChange(e) {
            if ($inboxDiv.is(':visible')) {
                $bsyDiv[0].style.visibility = "visible";
                historyPageNo = $selectPages.val();


                loadRecordData();
                refreshInboxDiv();
                sethistoryPageButtons();
            }
            else if ($relatedInfoDiv.is(':visible')) {
                $bsyDiv[0].style.visibility = "visible";
                BPhistoryPageNo = $selectPages.val();


                loadRelatedInfo();
                setBPhistoryPageButtons();
            }
            else {
                $bsyDiv[0].style.visibility = "visible";
                userhistoryPageNo = $selectPages.val();


                loadUserInfo();
                setUserhistoryPageButtons();
            }
        };

        function firstPage(e) {
            if ($inboxDiv.is(':visible')) {
                $bsyDiv[0].style.visibility = "visible";
                historyPageNo = 1;
                $selectPages.val(historyPageNo);
                loadRecordData();
                refreshInboxDiv();
                sethistoryPageButtons();
            }
            else if ($relatedInfoDiv.is(':visible')) {
                $bsyDiv[0].style.visibility = "visible";
                BPhistoryPageNo = 1;
                $selectPages.val(BPhistoryPageNo);
                loadRelatedInfo();
                setBPhistoryPageButtons();
            }
            else {
                $bsyDiv[0].style.visibility = "visible";
                userhistoryPageNo = 1;
                $selectPages.val(userhistoryPageNo);
                loadUserInfo();
                setUserhistoryPageButtons();
            }
        };

        function lastPage(e) {
            if ($inboxDiv.is(':visible')) {
                $bsyDiv[0].style.visibility = "visible";
                historyPageNo = historyTotalpages;
                $selectPages.val(historyPageNo);
                loadRecordData();
                refreshInboxDiv();
                sethistoryPageButtons();
            }
            else if ($relatedInfoDiv.is(':visible')) {
                $bsyDiv[0].style.visibility = "visible";
                BPhistoryPageNo = bphistoryTotalpages;
                $selectPages.val(BPhistoryPageNo);
                loadRelatedInfo();
                setBPhistoryPageButtons();
            }
            else {
                $bsyDiv[0].style.visibility = "visible";
                userhistoryPageNo = userTotalPages;
                $selectPages.val(userhistoryPageNo);
                loadUserInfo();
                setUserhistoryPageButtons();
            }
        };

        function sethistoryPageButtons() {
            if (historyPageNo == 1 && historyPageNo < historyTotalpages) {
                $firstPage.css("opacity", "0.6");
                $previousPage.css("opacity", "0.6");
                $nextPage.css("opacity", "1");
                $lastPage.css("opacity", "1");
            }
            else if (historyPageNo > 1 && historyPageNo < historyTotalpages) {
                $firstPage.css("opacity", "1");
                $previousPage.css("opacity", "1");
                $nextPage.css("opacity", "1");
                $lastPage.css("opacity", "1");
            }
            else if (historyPageNo == historyTotalpages && historyTotalpages == 1) {
                $firstPage.css("opacity", "0.6");
                $previousPage.css("opacity", "0.6");
                $nextPage.css("opacity", "0.6");
                $lastPage.css("opacity", "0.6");
            }
            else if (historyPageNo == historyTotalpages) {
                $firstPage.css("opacity", "1");
                $previousPage.css("opacity", "1");
                $nextPage.css("opacity", "0.6");
                $lastPage.css("opacity", "0.6");
            }
        };

        function setBPhistoryPageButtons() {
            if (BPhistoryPageNo == 1 && BPhistoryPageNo < bphistoryTotalpages) {
                $firstPage.css("opacity", "0.6");
                $previousPage.css("opacity", "0.6");
                $nextPage.css("opacity", "1");
                $lastPage.css("opacity", "1");
            }
            else if (BPhistoryPageNo > 1 && BPhistoryPageNo < bphistoryTotalpages) {
                $firstPage.css("opacity", "1");
                $previousPage.css("opacity", "1");
                $nextPage.css("opacity", "1");
                $lastPage.css("opacity", "1");
            }
            else if (BPhistoryPageNo == bphistoryTotalpages && bphistoryTotalpages == 1) {
                $firstPage.css("opacity", "0.6");
                $previousPage.css("opacity", "0.6");
                $nextPage.css("opacity", "0.6");
                $lastPage.css("opacity", "0.6");
            }
            else if (BPhistoryPageNo == bphistoryTotalpages) {
                $firstPage.css("opacity", "1");
                $previousPage.css("opacity", "1");
                $nextPage.css("opacity", "0.6");
                $lastPage.css("opacity", "0.6");
            }
        };


        function setUserhistoryPageButtons() {
            if (userhistoryPageNo == 1 && userhistoryPageNo < userTotalPages) {
                $firstPage.css("opacity", "0.6");
                $previousPage.css("opacity", "0.6");
                $nextPage.css("opacity", "1");
                $lastPage.css("opacity", "1");
            }
            else if (userhistoryPageNo > 1 && userhistoryPageNo < userTotalPages) {
                $firstPage.css("opacity", "1");
                $previousPage.css("opacity", "1");
                $nextPage.css("opacity", "1");
                $lastPage.css("opacity", "1");
            }
            else if (userhistoryPageNo == userTotalPages && userTotalPages == 1) {
                $firstPage.css("opacity", "0.6");
                $previousPage.css("opacity", "0.6");
                $nextPage.css("opacity", "0.6");
                $lastPage.css("opacity", "0.6");
            }
            else if (userhistoryPageNo == userTotalPages) {
                $firstPage.css("opacity", "1");
                $previousPage.css("opacity", "1");
                $nextPage.css("opacity", "0.6");
                $lastPage.css("opacity", "0.6");
            }
        };

        /*tab Chaneg event*/
        function tabClick(e) {


            var data = $(e.target).data('type');


            if (data == "History") {
                if (searchTextbox != "undefined" || searchTextbox != null) {
                    searchTextbox.val(hisSearch);
                }
                $selectPages = $pageCombo.find('select');
                $selectPages.empty();

                for (var c = 1; c <= historyTotalpages; c++) {
                    $selectPages.append('<option>' + c + '</option>');
                }

                //  $visattachhistoryrightwrap.find('*').hide();
                sethistoryPageButtons();
                $inboxDiv.show();
                $userInfoDiv.hide();
                $relatedInfoDiv.hide();

                $selectPages.val(historyPageNo);
                //  $visattachhistoryrightwrap.find('*').show();
                if (rows.length > 0) {
                    $datagrdRecordInfo.select(0);
                    $datagrdRecordInfo.refresh();
                    $visattachhistoryrightwrapNotFound.hide();
                    $visattachhistoryrightwrap.show();
                }
                else {
                    $visattachhistoryrightwrapNotFound.show();
                    $visattachhistoryrightwrap.hide();
                }
            }
            else if (data == "RelatedHistory") {
                if (searchTextbox != "undefined" || searchTextbox != null) {
                    searchTextbox.val(bpSearch);
                }
                //if (c_BPartner_ID == null || c_BPartner_ID == 0) {
                //    VIS.ADialog.info("BPartnerNotFound");
                //    return;
                //}
                //   $visattachhistoryrightwrap.find('*').hide();


                $selectPages = $pageCombo.find('select');
                $selectPages.empty();

                for (var c = 1; c <= bphistoryTotalpages; c++) {
                    $selectPages.append('<option>' + c + '</option>');
                }


                if ($datagrdRaltedRecordInfo == undefined || $datagrdRaltedRecordInfo == null) {
                    $bsyDiv[0].style.visibility = "visible";
                    loadRelatedInfo();
                    $selectPages.val(BPhistoryPageNo);
                }
                else {
                    $visattachhistoryrightwrap.find('*').show();
                    if (relatedrows.length > 0) {
                        $datagrdRaltedRecordInfo.select(0);
                        $datagrdRaltedRecordInfo.refresh();
                        $selectPages.val(BPhistoryPageNo);
                    }
                }


                $('.findImg').on("click", function (e) {

                    var ids = $(e.target).data("ids").split('-');
                    VIS.AEnv.zoom(ids[1], ids[0]);
                });


                if (relatedrows.length > 0) {
                    $datagrdRaltedRecordInfo.select(0);
                    $visattachhistoryrightwrapNotFound.hide();
                    $visattachhistoryrightwrap.show();
                }
                else {
                    $visattachhistoryrightwrapNotFound.show();
                    $visattachhistoryrightwrap.hide();
                }

                $inboxDiv.hide();
                $userInfoDiv.hide();
                $relatedInfoDiv.show();


            }
            else if (data == "UserHistory") {
                if (searchTextbox != "undefined" || searchTextbox != null) {
                    searchTextbox.val(UserSearch);
                }

                if (c_BPartner_ID == null || c_BPartner_ID == 0) {
                    VIS.ADialog.info("BPartnerNotFound");
                    return;
                }

                //if (ad_User_ID == null || ad_User_ID == 0) {
                //    VIS.ADialog.info("UserNotFound");
                //    return;
                //}
                //   $visattachhistoryrightwrap.find('*').hide();


                $selectPages = $pageCombo.find('select');
                $selectPages.empty();

                for (var c = 1; c <= userTotalPages; c++) {
                    $selectPages.append('<option>' + c + '</option>');
                }


                if ($datagrdUserRecordInfo == undefined || $datagrdUserRecordInfo == null) {
                    $bsyDiv[0].style.visibility = "visible";
                    loadUserInfo();
                    $selectPages.val(userhistoryPageNo);
                }
                else {
                    $visattachhistoryrightwrap.find('*').show();
                    if (userRows.length > 0) {
                        $datagrdUserRecordInfo.select(0);
                        $datagrdUserRecordInfo.refresh();
                        $selectPages.val(userhistoryPageNo);
                    }
                }


                $('.findImg').on("click", function (e) {

                    var ids = $(e.target).data("ids").split('-');
                    VIS.AEnv.zoom(ids[1], ids[0]);
                });


                if (userRows.length > 0) {
                    $datagrdUserRecordInfo.select(0);
                    $visattachhistoryrightwrapNotFound.hide();
                    $visattachhistoryrightwrap.show();
                }
                else {
                    $visattachhistoryrightwrapNotFound.show();
                    $visattachhistoryrightwrap.hide();
                }

                $inboxDiv.hide();
                $relatedInfoDiv.hide();
                $userInfoDiv.show();
            }


            $(e.target).addClass('vis-attachhistory-apanel-tab-selected');
            $(e.target).siblings('li').removeClass('vis-attachhistory-apanel-tab-selected');
        };


        function filter(e) {

            e.onComplete = function (eve) {
                if ($inboxDiv.is(':visible')) {

                    if ($datagrdRecordInfo.last.searchIds.length > 0) {
                        $datagrdRecordInfo.select($datagrdRecordInfo.last.searchIds[0]);
                    }
                }
                else {
                    if ($datagrdRaltedRecordInfo.last.searchIds.length > 0) {
                        $datagrdRaltedRecordInfo.select($datagrdRaltedRecordInfo.last.searchIds[0]);
                    }
                }
            };

        };

        /**/
        function dataChanged(e) {
            var target;
            $bsyDiv[0].style.visibility = "visible";


            if (e.target == "historyinboxgrid") {
                target = $datagrdRecordInfo.get(e.recid);
            }

            else if (e.target == "realtedhistorygrid") {
                target = $datagrdRaltedRecordInfo.get(e.recid);
            }
            else {
                target = $datagrdUserRecordInfo.get(e.recid);
            }
            $('.vis-attachhistory-view-comments').text(VIS.Msg.getMsg('ViewMoreComments'));

            if (target.type == VIS.Msg.getMsg("Appointment") || target.Type == "Appointment") {
                if ($visattachhistorygriddataForAppoint != undefined && $visattachhistorygriddataForAppoint.is(':visible') == false) {
                    $($visattachhistoryrightcontentForAppoint[0].children[0]).hide();
                    $visattachhistorygriddataForAppoint.show();
                }
            }
            else {
                if ($visattachhistorygriddata != undefined && $visattachhistorygriddata.is(':visible') == false) {
                    $($visattachhistoryrightcontentFormail[0].children[0]).hide();
                    $visattachhistorygriddata.show();
                }
            }




            if (target.type != undefined) {
                switch (target.type) {
                    case VIS.Msg.getMsg("Appointment"):
                        showAppointmentInfo(target.id);
                        break;
                    case VIS.Msg.getMsg("SentMail"):
                        showSentMail(target.id);
                        break;
                    case VIS.Msg.getMsg("InboxMail"):
                        showInboxMail(target.id);
                        break;
                    case VIS.Msg.getMsg("Letter"):
                        showLetter(target.id);
                        break;
                };
            }
            else {
                switch (target.Type) {
                    case VIS.Msg.getMsg("Appointment"):
                        showAppointmentInfo(target.ID);
                        break;
                    case VIS.Msg.getMsg("SentMail"):
                        showSentMail(target.ID);
                        break;
                    case VIS.Msg.getMsg("InboxMail"):
                        showInboxMail(target.ID);
                        break;
                    case VIS.Msg.getMsg("Letter"):
                        showLetter(target.ID);
                        break;
                };
            }

        };

        /**/
        function showAppointmentInfo(ID) {
            var strApp = "SELECT AI.AppointmentsInfo_ID, AI.Subject,AI.Location,AI.Description,AI.AD_Table_ID, AI.Record_ID, " +
             " ( " +
             " CASE Label " +
             "   WHEN 1   " +
             "  THEN  '" + VIS.Msg.getMsg("Important", true) + "' " +
             "   WHEN 2 " +
             "   THEN '" + VIS.Msg.getMsg("Business", true) + "' " +
             "   WHEN 3 " +
             "   THEN   '" + VIS.Msg.getMsg("Personal", true) + "' " +
             "   WHEN 4 " +
             "   THEN '" + VIS.Msg.getMsg("Vacation", true) + "' " +
             "   WHEN 5 " +
             "   THEN '" + VIS.Msg.getMsg("MustAttend", true) + "' " +
             "   WHEN 6 " +
             "   THEN '" + VIS.Msg.getMsg("TravelRequired", true) + "' " +
             "   WHEN 7 " +
             "   THEN '" + VIS.Msg.getMsg("NeedsPreparation", true) + "' " +
             "   WHEN 8 " +
             "   THEN '" + VIS.Msg.getMsg("BirthDay", true) + "' " +
             "   WHEN 9 " +
             "   THEN '" + VIS.Msg.getMsg("Anniversary", true) + "' " +
             "   WHEN 10 " +
             "   Then '" + VIS.Msg.getMsg("PhoneCall", true) + "' " +
             "   ELSE '" + VIS.Msg.getMsg("None", true) + "' " +
             " END ) AS label , " +
             " AI.StartDate , AI.EndDate, " +
             " ( " +
             " CASE AI.AllDay " +
             "   WHEN 'Y' " +
              "       THEN '" + VIS.Msg.getMsg("Yes", true) + "' " +
             "       ELSE '" + VIS.Msg.getMsg("No", true) + "' " +
             " END) AS Allday , " +
             " ( " +
             " CASE AI.Status " +
             "   WHEN 1 " +
             "   THEN '" + VIS.Msg.getMsg("Tentative", true) + "'  " +
             "   WHEN 2 " +
             "   THEN '" + VIS.Msg.getMsg("Busy", true) + "' " +
             "   WHEN 3 " +
             "   THEN '" + VIS.Msg.getMsg("OutOfOffice", true) + "' " +
             "   Else " +
             "    '" + VIS.Msg.getMsg("Free", true) + "' " +
             "    End) as Status, " +
             "     AI.ReminderInfo , AI.AttendeeInfo,  AI.RecurrenceInfo , " +
             "     (  " +
             "     CASE AI.IsPrivate " +
             "       WHEN 'Y' " +
             "       THEN '" + VIS.Msg.getMsg("Yes") + "' " +
             "       ELSE '" + VIS.Msg.getMsg("No") + "' " +
             "     END) AS IsPrivate,AI.comments ,ac.Name as caname" +
             "   FROM AppointmentsInfo ai LEFT OUTER JOIN appointmentcategory AC " +
            " ON AI.appointmentcategory_id=ac.appointmentcategory_id WHERE AI.AppointmentsInfo_ID=" + ID;

            VIS.DB.executeDataSet(strApp, null, function (ds) {
                if (ds != null && ds.getTables().length > 0) {

                    var zoomID = 0;

                    if ($inboxDiv.is(':visible')) {
                        zoomID = 0;
                    }
                    else {
                        zoomID = ds.tables[0].rows[0].cells["ad_table_id"] + "-" + ds.tables[0].rows[0].cells["record_id"];
                    }
                    strApp = "";
                    var attInfo = ds.tables[0].rows[0].cells["attendeeinfo"];
                    if (attInfo != null && attInfo != undefined) {
                        strApp = " SELECT name FROM AD_User WHERE AD_User_ID IN (" + attInfo.replace(/;/g, ',') + ")";
                        var names = VIS.DB.executeDataSet(strApp);
                        if (names != null && names.getTables().length > 0) {
                            strApp = "";
                            if (names.tables[0].rows.length > 0) {
                                for (var k = 0; k < names.tables[0].rows.length; k++) {
                                    strApp += names.tables[0].rows[k].cells["name"] + ", ";
                                }
                                strApp = strApp.substring(0, strApp.length - 2);
                            }
                        }
                    }


                    createRightPanelforAppointment(ID, ds.tables[0].rows[0].cells["location"], ds.tables[0].rows[0].cells["description"], ds.tables[0].rows[0].cells["label"], ds.tables[0].rows[0].cells["startdate"]
                        , ds.tables[0].rows[0].cells["enddate"], ds.tables[0].rows[0].cells["allday"], "", ds.tables[0].rows[0].cells["comments"], zoomID, ds.tables[0].rows[0].cells["subject"], ds.tables[0].rows[0].cells["caname"], "", ds.tables[0].rows[0].cells["appointmentsinfo_id"], strApp);
                }
                else {
                    $bsyDiv[0].style.visibility = "hidden";
                }

            });

        };

        /**/
        function showSentMail(ID) {


            $.ajax({
                url: VIS.Application.contextUrl + "AttachmentHistory/LoadSentMails",
                datatype: "json",
                type: "get",
                cache: false,
                data: { ID: ID },
                success: function (data) {
                    var result = JSON.parse(data);
                    var zoomID = 0;

                    if ($inboxDiv.is(':visible')) {
                        zoomID = 0;
                    }
                    else {
                        zoomID = result.AD_Table_ID + "-" + result.Record_ID;
                    }

                    createRightPanelforLatter(ID, result.Title, result.To, result.From, result.Date, result.Detail, result.Bcc, result.Cc, result.Comments, result.IsMail, result.IsLetter, result.Attach, zoomID, result.ID);
                }
            });

        };

        /**/
        function showInboxMail(ID) {
            $.ajax({
                url: VIS.Application.contextUrl + "AttachmentHistory/LoadInboxMails",
                datatype: "json",
                type: "get",
                cache: false,
                data: { ID: ID },
                success: function (data) {
                    var result = JSON.parse(data);
                    var zoomID = 0;

                    if ($inboxDiv.is(':visible')) {
                        zoomID = 0;
                    }
                    else {
                        zoomID = result.AD_Table_ID + "-" + result.Record_ID;
                    }
                    createRightPanelforLatter(ID, result.Title, result.To, result.From, result.Date, result.Detail, result.Bcc, result.Cc, result.Comments, result.IsMail, result.IsLetter, result.Attach, zoomID, result.ID);
                }
            });
        };

        /**/
        function showLetter(ID) {


            $.ajax({
                url: VIS.Application.contextUrl + "AttachmentHistory/LoadLetters",
                datatype: "json",
                type: "get",
                cache: false,
                data: { ID: ID },
                success: function (data) {
                    var result = JSON.parse(data);
                    var zoomID = 0;

                    if ($inboxDiv.is(':visible')) {
                        zoomID = 0;
                    }
                    else {
                        zoomID = result.AD_Table_ID + "-" + result.Record_ID;
                    }
                    createRightPanelforLatter(ID, result.Title, "", "", result.Date, result.Detail, "", "", result.Comments, false, true, result.Attach, zoomID, result.ID);
                }
            });

        };



        var attachID = 0;

        /**/
        function createRightPanelforLatter(IDS, title, to, from, date, detail, bcc, cc, comments, isMail, isLetter, attachInfo, zoomID, recID) {
            if ($visattachhistoryrightcontentForAppoint != undefined) {
                $visattachhistoryrightcontentForAppoint.hide();
            }
            isAppointment = false;
            if ($date == undefined || $date == null) {
                $title = $('<p>' + VIS.Utility.encodeText(title) + '</p>');
                $to = $('<p>' + VIS.Utility.encodeText(to) + '</p>');
                $bcc = $('<p>' + VIS.Utility.encodeText(bcc) + '</p>');
                $cc = $('<p>' + VIS.Utility.encodeText(cc) + '</p>');
                $from = $(' <p>' + VIS.Utility.encodeText(from) + '</p>');
                $date = $('<p>' + VIS.Utility.encodeText(date) + '</p>');
                $emaildropdown = $('<a class="vis-attachhistory-email-dropdown"></a>');


                if ($detail == undefined || $detail == null) {
                    $detail = $('<p class="vis-attachhistory-detail"></p>');
                }
                $detail.html(detail);
                if ($txtArea == undefined || $txtArea == null) {
                    $txtArea = $('<input type="text" placeholder="' + VIS.Msg.getMsg('TypeComment') + '"></input>');
                }
                $titleIcon = $('<img src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-email.png" alt="email">');
                if (VIS.Application.isRTL) {
                    $zoomIcon = $('<img style="float:left;cursor:pointer;margin-top:3px;margin-right:5px" data-ids="' + zoomID + '" src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-zoom.png" alt="email">');
                }
                else {
                    $zoomIcon = $('<img style="float:right;cursor:pointer;margin-top:3px;margin-right:5px" data-ids="' + zoomID + '" src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-zoom.png" alt="email">');
                }

                $visattachhistoryrightcontentFormail = $('<div class="vis-attachhistory-right-content">');

                $visattachhistorygriddata = $('<div class="vis-attachhistory-grid-data">');

                $visattachhistorygriddata.append($('<div class="vis-attachhistory-right-row2">').append(($('<h6>' + VIS.Msg.getMsg("Title") + '</h6>').append($titleIcon))).append($title));
                $visattachhistorygriddata.append($('<div class="vis-attachhistory-right-row3"></div>').append($emaildropdown).append($zoomIcon));


                if (zoomID == 0) {
                    $zoomIcon.hide();
                }
                else {
                    $zoomIcon.show();
                }

                if (isMail == true) {
                    $titleIcon.prop("src", VIS.Application.contextUrl + 'Areas/vis/Images/history-email.png');
                }
                else if (isLetter == true) {
                    $titleIcon.prop("src", VIS.Application.contextUrl + 'Areas/vis/Images/history-letter.png');
                }

                $visattachhistorygriddata.append($('<div class="vis-attachhistory-right-row vis-attachhistory-to">').append('<h6>' + VIS.Msg.getMsg("To") + '</h6> ').append($to));
                if (to == "undefined" || to == null || to == "" || isLetter == true) {
                    $visattachhistorygriddata.find(".vis-attachhistory-right-row").last().hide();
                }

                $visattachhistorygriddata.append($('<div value="bccDiv" class="vis-attachhistory-right-row  vis-attachhistory-bcc">').append('<h6>' + VIS.Msg.getMsg("Bcc") + '</h6> ').append($bcc));
                if (bcc == "undefined" || bcc == null || bcc == "" || isLetter == true) {
                    $visattachhistorygriddata.find(".vis-attachhistory-right-row").last().hide();
                }


                $visattachhistorygriddata.append($('<div  value="ccDiv"  class="vis-attachhistory-right-row vis-attachhistory-cc">').append('<h6>' + VIS.Msg.getMsg("Cc") + '</h6> ').append($cc));
                if (cc == "undefined" || cc == null || cc == "" || isLetter == true) {
                    $visattachhistorygriddata.find(".vis-attachhistory-right-row").last().hide();
                }


                $visattachhistorygriddata.append($('<div class="vis-attachhistory-right-row">').append('<h6>' + VIS.Msg.getMsg("From") + '</h6>').append($from));
                if (isLetter == true) {
                    $visattachhistorygriddata.find(".vis-attachhistory-right-row").last().hide();
                }

                if (isLetter == true) {
                    $visattachhistorygriddata.append($('<div class="vis-attachhistory-right-row3">').append($date));
                }

                $visattachhistorygriddata.append($('<div class="vis-attachhistory-right-row">').append('<h6>' + VIS.Msg.getMsg("Attachments") + '</h6>'));


                if (attachInfo != undefined && attachInfo.length > 0) {
                    for (var k = 0; k < attachInfo.length; k++) {
                        $ulAttach.append('<li><a data-IDs="' + attachInfo[k].ID + '">' + VIS.Utility.encodeText(attachInfo[k].Name) + '</a><span class="vis-attachhistory-attach-download"><img src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-download.png" alt="email"></span></li>');
                    }
                }
                else {
                    $visattachhistorygriddata.find(".vis-attachhistory-right-row").last().hide();
                }

                $visattachhistorygriddata.find('.vis-attachhistory-right-row').last().append($ulAttach);

                $visattachhistorygriddata.append($('<div class="vis-attachhistory-right-row">').append('<h6>' + VIS.Msg.getMsg("Details") + '</h6>').append($detail));

                resltGrdforMail = $('<div class="vis-attachhistory-bottom"></div>');

                hisCommentforMail = $('<div class="vis-attachhistory-comments"></div>');

                hisCommentforMail.append($txtArea).append('<span class="vis-attachhistory-comment-icon"></span>');

                resltGrdforMail.append(($('<div class="vis-attachhistory-right-row" style="margin-top:0px">').append(hisCommentforMail).append('<p class="vis-attachhistory-view-comments" style="float:right;width:auto">' + VIS.Msg.getMsg('ViewMoreComments') + '</p>')));

                $visattachhistoryrightcontentFormail.append('<div style="display:none" class="vis-attachhistory-grid-data">').append($visattachhistorygriddata).append(resltGrdforMail);
                if ($visattachhistorysearchwrap.parent() != undefined) {
                    $visattachhistoryrightwrap.append($visattachhistoryrightcontentFormail);
                }
                else {
                    $visattachhistoryrightwrap.append($visattachhistoryrightcontentFormail);
                }

                $zoomIcon.on("click", function (e) {
                    var ids = $(e.target).data("ids").split('-');
                    VIS.AEnv.zoom(ids[0], ids[1]);
                });

            }
            else {
                $visattachhistoryrightcontentFormail.show();
                $($visattachhistoryrightcontentFormail[0].children[0]).hide();
                if ($emaildropdown == undefined || $emaildropdown == null) {
                    $emaildropdown = $('<a class="vis-attachhistory-email-dropdown"></a>');
                }

                if (isMail == true) {
                    $titleIcon.prop("src", VIS.Application.contextUrl + 'Areas/vis/Images/history-email.png');
                    $emaildropdown.show();
                }
                else if (isLetter == true) {
                    $titleIcon.prop("src", VIS.Application.contextUrl + 'Areas/vis/Images/history-letter.png');
                    $emaildropdown.hide();
                }

                $title.text(VIS.Utility.encodeText(title));
                if (to == "undefined" || to == null && to == "" || isLetter == true) {
                    $($to.parent()).hide();
                }
                else {
                    $to.text(VIS.Utility.encodeText(to));
                    $($to.parent()).show();
                }

                if (bcc == "undefined" || bcc == null || bcc == "" || isLetter == true) {
                    $($bcc.parent()).hide();
                }
                else {
                    $bcc.text(VIS.Utility.encodeText(bcc));
                    $($bcc.parent()).show();
                }

                if (cc == "undefined" || cc == null || cc == "" || isLetter == true) {
                    $($cc.parent()).hide();
                }
                else {
                    $cc.text(VIS.Utility.encodeText(cc));
                    $($cc.parent()).show();
                }

                if (isLetter == true) {
                    $($from.parent()).hide();
                }
                else {
                    $from.text(VIS.Utility.encodeText(from));
                    $($from.parent()).show();
                }

                $zoomIcon.data("ids", zoomID);
                if (zoomID == 0) {
                    $zoomIcon.hide();
                }
                else {
                    $zoomIcon.show();
                }

                $date.text(VIS.Utility.encodeText(date));

                if (attachInfo != undefined && attachInfo.length > 0) {
                    $ulAttach.empty();
                    for (var k = 0; k < attachInfo.length; k++) {
                        $ulAttach.append('<li><a  data-IDs="' + attachInfo[k].ID + '">' + VIS.Utility.encodeText(attachInfo[k].Name) + '</a><span class="vis-attachhistory-attach-download"><img src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-download.png" alt="email"></span></li>');
                    }
                    $($ulAttach.parent()).show();
                }
                else {
                    $($ulAttach.parent()).hide();

                }

                $detail.html(detail);
            }


            $('.vis-attachhistory-view-comments').off("click");

            $('.vis-attachhistory-view-comments').on("click",
                function () {
                    viewAll(recID, false, this)
                });

            if (isMail) {
                attachID = recID;
                $emaildropdown.show();
                $('.vis-attachhistory-email-dropdown').off("click");
                $('.vis-attachhistory-email-dropdown').on("click", function () {
                    $(this).w2overlay($menu.clone(true), { css: { height: '300px' } });
                });
            }
            else {
                $emaildropdown.hide();
            }


            //   $btnSave.data("ID", IDS);

            $('.vis-attachhistory-comment-icon').data("ID", IDS);
            if (comments != undefined) {
                $txtArea.val(VIS.Utility.encodeText(comments));
            }
            else {
                $txtArea.val("");
            }
            $bsyDiv[0].style.visibility = "hidden";
        };

        /**/
        function createRightPanelforAppointment(IDS, location, description, label, startDate, endDate, allDay, detail, comment, zoomID, subject, category, contacts, recID, ContactNames) {
            if ($visattachhistoryrightcontentFormail != undefined) {
                $visattachhistoryrightcontentFormail.hide();
            }
            isAppointment = true;
            if ($startDate == undefined || $startDate == null) {
                $location = $('<p>' + VIS.Utility.encodeText(location) + '</p>');
                $subjectApp = $('<p>' + VIS.Utility.encodeText(subject) + '</p>');
                $description = $('<p>' + VIS.Utility.encodeText(description) + '</p>');
                $category = $('<p>' + VIS.Utility.encodeText(category) + '</p>');
                $contacts = $('<p>' + VIS.Utility.encodeText(ContactNames) + '</p>');
                $label = $('<p>' + VIS.Utility.encodeText(label) + '</p>');
                $startDate = $('<p>' + VIS.Utility.encodeText(new Date(startDate).toLocaleString()) + '</p>');
                $endDate = $(' <p>' + VIS.Utility.encodeText(new Date(endDate).toLocaleString()) + '</p>');
                $allDay = $('<p>' + VIS.Utility.encodeText(allDay) + '</p>');
                //if ($detail == undefined || $detail == null) {
                //    $detail = $('<p class="vis-attachhistory-detail"></p>');
                //}
                //$detail.html(detail);

                if ($txtAreaAppoint == undefined || $txtAreaAppoint == null) {
                    $txtAreaAppoint = $('<input type="text" placeholder="' + VIS.Msg.getMsg('TypeComment') + '"></input>');
                }
                if (VIS.Application.isRTL) {
                    $bpzoomIcon = $('<img style="float:left;cursor:pointer" data-ids="' + zoomID + '" src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-zoom.png" alt="email">');
                }
                else {
                    $bpzoomIcon = $('<img style="float:right;cursor:pointer" data-ids="' + zoomID + '" src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-zoom.png" alt="email">');
                }
                $visattachhistoryrightcontentForAppoint = $('<div class="vis-attachhistory-right-content">');

                $visattachhistorygriddataForAppoint = $('<div class="vis-attachhistory-grid-data">');

                var div1 = $('<div style="float:left;width:100%" ></div>');

                div1.append($('<div class="vis-attachhistory-right-row2">').append($('<h6>' + VIS.Msg.getMsg("Title") + ' <img src="' + VIS.Application.contextUrl + 'Areas/vis/Images/history-appointment.png"  alt="email"></h6>').append($bpzoomIcon)).append($subjectApp));

                if (zoomID == 0) {
                    $bpzoomIcon.hide();
                }
                else {
                    $bpzoomIcon.show();
                }

                div1.append($('<div class="vis-attachhistory-right-row3"  style="margin-bottom:11px" >').append('<h6>' + VIS.Msg.getMsg("Location") + '</h6> ').append($location));
                if (location == "undefined" || location == null && location == "") {
                    $visattachhistorygriddataForAppoint.find(".vis-attachhistory-right-row").last().hide();
                }
                $visattachhistorygriddataForAppoint.append(div1);


                var div2 = $('<div style="float:left;width:100%" ></div>');

                div2.append($('<div  class="vis-attachhistory-right-row2"> ').append('<h6>' + VIS.Msg.getMsg("StartDate") + '</h6> ').append($startDate));


                div2.append($('<div class="vis-attachhistory-right-row3"  style="margin-bottom:11px" >').append('<h6>' + VIS.Msg.getMsg("EndDate") + '</h6>').append($endDate));

                $visattachhistorygriddataForAppoint.append(div2);

                var div3 = $('<div style="float:left;width:100%" ></div>');

                div3.append($('<div class="vis-attachhistory-right-row2">').append('<h6>' + VIS.Msg.getMsg("AllDay") + '</h6>').append($allDay));

                div3.append($('<div class="vis-attachhistory-right-row3"  style="margin-bottom:11px" >').append('<h6>' + VIS.Msg.getMsg("Category") + '</h6> ').append($category));

                $visattachhistorygriddataForAppoint.append(div3);

                $visattachhistorygriddataForAppoint.append($('<div class="vis-attachhistory-right-row">').append('<h6>' + VIS.Msg.getMsg("Contacts") + '</h6> ').append($contacts));

                $visattachhistorygriddataForAppoint.append($('<div class="vis-attachhistory-right-row">').append('<h6>' + VIS.Msg.getMsg("Description") + '</h6> ').append($description));

                if (description == "undefined" || description == null && description == "") {
                    $visattachhistorygriddataForAppoint.find(".vis-attachhistory-right-row").last().hide();
                }

                //if ($detail.parent() != undefined) {
                //    $visattachhistorygriddataForAppoint.append($('<div class="vis-attachhistory-right-row">').append('<h6>' + VIS.Msg.getMsg("Details") + '</h6>'));
                //}
                //else {
                //    $visattachhistorygriddataForAppoint.append($('<div class="vis-attachhistory-right-row">').append('<h6>' + VIS.Msg.getMsg("Details") + '</h6>').append($detail));
                //}

                resltGrdforAppoint = $('<div class="vis-attachhistory-bottom"></div>');

                hisCommentforAppoint = $('<div class="vis-attachhistory-comments"></div>');

                hisCommentforAppoint.append($txtAreaAppoint).append('<span class="vis-attachhistory-comment-icon"></span>');

                resltGrdforAppoint.append(($('<div class="vis-attachhistory-right-row" style="margin-top:0px">').append(hisCommentforAppoint).append('<p class="vis-attachhistory-view-comments">' + VIS.Msg.getMsg('ViewMoreComments') + '</p>')));

                $visattachhistoryrightcontentForAppoint.append('<div style="display:none" class="vis-attachhistory-grid-data">').append($visattachhistorygriddataForAppoint).append(resltGrdforAppoint);

                $visattachhistoryrightwrap.append($visattachhistoryrightcontentForAppoint);

                $bpzoomIcon.on("click", function (e) {
                    var ids = $(e.target).data("ids").split('-');
                    VIS.AEnv.zoom(ids[0], ids[1]);
                });

            }
            else {
                $visattachhistoryrightcontentForAppoint.show();

                $subjectApp.text(VIS.Utility.encodeText(subject));

                $location.text(VIS.Utility.encodeText(location));

                if (description == "undefined" || description == null || description == "") {
                    $($description.parent()).hide();
                }
                else {
                    $description.text(VIS.Utility.encodeText(description));
                    $($description.parent()).show();
                }

                $contacts.text(VIS.Utility.encodeText(ContactNames));


                if (category == "undefined" || category == null || category == "") {
                    //$($category.parent()).hide();
                }
                else {
                    $category.text(VIS.Utility.encodeText(category));
                    //$($category.parent()).show();
                }

                $bpzoomIcon.data("ids", zoomID);

                if (zoomID == 0) {
                    $bpzoomIcon.hide();
                }
                else {
                    $bpzoomIcon.show();
                }
                $startDate.text(VIS.Utility.encodeText(new Date(startDate).toLocaleString()));

                $endDate.text(VIS.Utility.encodeText(new Date(endDate).toLocaleString()));

                $allDay.text(VIS.Utility.encodeText(allDay));
                $($visattachhistoryrightcontentForAppoint[0].children[0]).hide();
            }

            $('.vis-attachhistory-view-comments').off("click");

            $('.vis-attachhistory-view-comments').on("click",
                function () {
                    viewAll(recID, true, this)
                });


            if (comment != undefined) {
                $txtAreaAppoint.val(VIS.Utility.encodeText(comment));
            }
            else {
                $txtAreaAppoint.val("");
            }
            $('.vis-attachhistory-comment-icon').data("ID", IDS);
            $bsyDiv[0].style.visibility = "hidden";
        };

        function viewAll(record_ID, isAppointment, para) {

            if (isAppointment == true) {
                if ($visattachhistorygriddataForAppoint.is(':visible')) {
                    $.ajax({
                        url: VIS.Application.contextUrl + "AttachmentHistory/ViewChatonHistory",
                        datatype: "json",
                        type: "POST",
                        cache: false,
                        data: { record_ID: record_ID, isAppointment: isAppointment },
                        success: function (data) {
                            var result = JSON.parse(data);
                            createCommentsSection(result, isAppointment);
                        },
                        error: function (data) {
                            VIS.ADialog.error("RecordNotSaved");
                        }
                    });
                    $(para).text(VIS.Msg.getMsg('HideComments'));
                }
                else {
                    $visattachhistorygriddataForAppoint.show();

                    $($visattachhistoryrightcontentForAppoint[0].children[0]).hide();
                    $(para).text(VIS.Msg.getMsg('ViewMoreComments'));
                }
            }
            else {
                if ($visattachhistorygriddata.is(':visible')) {
                    $.ajax({
                        url: VIS.Application.contextUrl + "AttachmentHistory/ViewChatonHistory",
                        datatype: "json",
                        type: "POST",
                        cache: false,
                        data: { record_ID: record_ID, isAppointment: isAppointment },
                        success: function (data) {
                            var result = JSON.parse(data);
                            createCommentsSection(result, isAppointment);
                        },
                        error: function (data) {
                            VIS.ADialog.error("RecordNotSaved");
                        }
                    });
                    $(para).text(VIS.Msg.getMsg('HideComments'));
                }
                else {
                    $visattachhistorygriddata.show();

                    $($visattachhistoryrightcontentFormail[0].children[0]).hide();
                    $(para).text(VIS.Msg.getMsg('ViewMoreComments'));
                }
            }
        };


        function updateComments(str, result) {

            str += '   <div class="vis-attachhistory-comment-data"><div class="vis-attachhistory-comment-detail">';

            if (result.UserImage != "NoRecordFound" && result.UserImage != "FileDoesn'tExist" && result.UserImage != null) {
                str += '<img  class="userAvatar-Feeds"  src="' + result.UserImage + '?' + new Date() + '">';
            }
            else {
                str += '<img  class="userAvatar-Feeds" src="' + VIS.Application.contextUrl + 'Areas/VIS/Images/home/defaultUser46X46.png ">';
            }
            str += '<div class="vis-attachhistory-comment-text">';

            if (result.CreatedBy == VIS.Env.getCtx().getAD_User_ID()) {
                str += "<h6>" + VIS.Msg.getMsg("Me") + " </h6>";
            }
            else {
                str += "<h6>" + result.UserName + "</h6>"
            }

            str += ' <p>' + result.CharacterData + '</p>' +
             '</div></div><div class="vis-attachhistory-comment-dateTime"><p>' + new Date(result.Created).toLocaleString() + '</p>' +
             '</div></div>';

            return str;
        };


        function createCommentsSection(result, isappointment) {

            if (result.length > 0) {
                var str = ' <div class="vis-attachhistory-comments-container">';

                for (var i = 0; i < result.length; i++) {
                    //str += '   <div class="vis-attachhistory-comment-data"><div class="vis-attachhistory-comment-detail">';

                    //if (result[i].UserImage != "NoRecordFound" && result[i].UserImage != "FileDoesn'tExist" && result[i].UserImage != null) {
                    //    str += '<img  class="userAvatar-Feeds"  src="' + result[i].UserImage + '?' + new Date() + '">';
                    //}
                    //else {
                    //    str += '<img  class="userAvatar-Feeds" src="' + VIS.Application.contextUrl + 'Areas/VIS/Images/home/defaultUser46X46.png ">';
                    //}
                    //str += '<div class="vis-attachhistory-comment-text">';

                    //if (result[i].CreatedBy == VIS.Env.getCtx().getAD_User_ID()) {
                    //    str += "<h6>" + VIS.Msg.getMsg("Me") + " </h6>";
                    //}
                    //else {
                    //    str += "<h6>" + result[i].UserName + "</h6>"
                    //}

                    //str += ' <p>' + result[i].CharacterData + '</p>' +
                    // '</div></div><div class="vis-attachhistory-comment-dateTime"><p>' + new Date(result[i].Created).toLocaleString() + '</p>' +
                    // '</div></div>';
                    str = updateComments(str, result[i]);

                }

                str += '</div>';
            }

            if (isappointment == false) {

                if ($visattachhistorygriddata.is(':visible')) {

                    $($visattachhistoryrightcontentFormail[0].children[0]).show();
                    $($visattachhistoryrightcontentFormail[0].children[0]).empty();
                    $($visattachhistoryrightcontentFormail[0].children[0]).append(str);
                    $visattachhistorygriddata.hide();
                }
                else {
                    $visattachhistorygriddata.show();
                    $($visattachhistoryrightcontentFormail[0].children[0]).hide();
                }
            }
            else if (isappointment == true) {
                if ($visattachhistorygriddataForAppoint.is(':visible')) {

                    $($visattachhistoryrightcontentForAppoint[0].children[0]).show();
                    $($visattachhistoryrightcontentForAppoint[0].children[0]).empty();
                    $($visattachhistoryrightcontentForAppoint[0].children[0]).append(str);
                    $visattachhistorygriddataForAppoint.hide();
                }
                else {
                    $visattachhistorygriddataForAppoint.show();
                    $($visattachhistoryrightcontentForAppoint[0].children[0]).hide();
                }
            }

        };





        /**/
        function downLoadAttach(e) {

            var target = e.target;
            var name = '';
            var ID = '';

            if ($(target).is('a')) {
                name = $(target).text();
                ID = $(target).data('ids');
            }
            else if ($(target).is('img')) {
                name = $($(target).parent()).siblings().text();
                ID = $($(target).parent()).siblings().data('ids');
            }
            else if ($(target).is('span')) {
                name = $(target).siblings().text();
                ID = $(target).siblings().data('ids');
            }
            if (ID == null || ID == 0) {
                return;
            }

            $bsyDiv[0].style.visibility = "hidden";
            $.ajax({
                url: VIS.Application.contextUrl + "AttachmentHistory/DownloadAttachment",
                datatype: "json",
                type: "get",
                cache: false,
                data: { ID: ID, Name: name },
                success: function (data) {
                    var result = JSON.parse(data);
                    var url = VIS.Application.contextUrl + "TempDownload/" + result;
                    window.open(url);
                    $bsyDiv[0].style.visibility = "hidden";
                }
            });



        };

        function save(e) {

            var target = e.target;
            if (e.keyCode != undefined) {
                if (e.keyCode != 13) {
                    return;
                }
            }

            if (e.keyCode == undefined && !$(target).hasClass("vis-attachhistory-comment-icon")) {
                return;
            }

            var ID = 0;
            //if ($(target).is('span')) {
            //    ID = $(target).data("ID");
            //}
            ID = $(".vis-attachhistory-comment-icon").data("ID");
            if (ID == 0) {
                return;
            }
            var comme = '';
            if (isAppointment == true) {
                comme = $txtAreaAppoint.val();
            }
            else {
                comme = $txtArea.val();
            }

            if (comme.length == 0) {
                return;
            }

            $.ajax({
                url: VIS.Application.contextUrl + "AttachmentHistory/SaveComment",
                datatype: "json",
                type: "POST",
                cache: false,
                data: { ID: ID, Text: comme, isAppointment: isAppointment },
                success: function (data) {
                    var result = JSON.parse(data);
                    var updateComment = true;
                    if (isAppointment == false) {
                        $txtArea.val("");
                        if ($visattachhistorygriddata.is(':visible')) {
                            updateComment = false;
                        }
                    }
                    else if (isAppointment == true) {
                        $txtAreaAppoint.val("");
                        if ($visattachhistorygriddataForAppoint.is(':visible')) {
                            updateComment = false;
                        }
                    }
                    if (updateComment == true) {
                        if (result.length > 0) {
                            var str = ' <div class="vis-attachhistory-comments-container">';

                            for (var i = 0; i < result.length; i++) {
                                str = updateComments(str, result[i]);
                            }
                            str += '</div>';
                        }

                        if (isAppointment == true) {
                            $($visattachhistoryrightcontentForAppoint[0].children[0]).empty();
                            $($visattachhistoryrightcontentForAppoint[0].children[0]).append(str);
                        }
                        else {
                            $($visattachhistoryrightcontentFormail[0].children[0]).empty();
                            $($visattachhistoryrightcontentFormail[0].children[0]).append(str);
                        }
                    }
                },
                error: function (data) {
                    VIS.ADialog.error("RecordNotSaved");
                }
            });
            //}
        };

        function changePage(e) {

        }

        /* Used by CFrame so that this form can be embedded into container */
        this.getRoot = function () {
            return $mainDiv;
        };

        /*Show Form*/
        this.show = function () {
            ch = new VIS.ChildDialog();
            this.initializeComponent();
            ch.setContent($mainDiv);


            if (isip == true) {
                ch.setHeight(650);
                ch.setWidth(800);
            }
            else {
                ch.setHeight(650);
                ch.setWidth(1200);
            }
            ch.setTitle(VIS.Msg.getMsg("History"));
            ch.setModal(true);
            ch.show();
            ch.hideButtons();
            this.displayInboxDiv();
            ch.onClose = function () { self.dispose() };;
        };

        /* Dispose all objects created on form Close */
        this.dispose = function () {
            windowNo = 0;
            ctx = null;
            columns = [];
            columns = null;
            rows = [];
            rows = null;
            colkeys = [];
            colkeys = null;

            if ($historycontentwrap != null)
                $historycontentwrap.remove();
            if ($historyleftwrap != null)
                $historyleftwrap.remove();
            if ($historytabletop != null)
                $historytabletop.remove();
            if ($visapaneltabcontrol != null)
                $visapaneltabcontrol.remove();
            if ($visattachhistoryappsactionul != null)
                $visattachhistoryappsactionul.remove();
            if ($historytablewrap != null)
                $historytablewrap.remove();
            if ($visattachhistoryrightwrap != null)
                $visattachhistoryrightwrap.remove();
            if ($visattachhistoryrightcontentFormail != null)
                $visattachhistoryrightcontentFormail.remove();
            if ($visattachhistoryrightcontentForAppoint != null)
                $visattachhistoryrightcontentForAppoint.remove();
            if ($visattachhistorygriddataForAppoint != null)
                $visattachhistorygriddataForAppoint.remove();
            if (resltGrdforMail != null)
                resltGrdforMail.remove();
            if (resltGrdforAppoint != null)
                resltGrdforAppoint.remove();
            if ($visattachhistoryrightwrapNotFound != null)
                $visattachhistoryrightwrapNotFound.remove();
            if ($visattachhistorygriddata != null)
                $visattachhistorygriddata.remove();
            if ($ulAttach != null)
                $ulAttach.remove();
            if ($title != null)
                $title.remove();
            if ($to != null)
                $to.remove();
            if ($from != null)
                $from.remove();
            if ($subject != null)
                $subject.remove();
            if ($detail != null)
                $detail.remove();
            if ($date != null)
                $date.remove();
            if ($txtArea != null)
                $txtArea.remove();
            if ($bcc != null)
                $bcc.remove();
            if ($cc != null)
                $cc.remove();
            if ($titleIcon != null)
                $titleIcon.remove();
            //if ($btnSave != null)
            //    $btnSave.remove();
            //if ($btnSaveAppoint != null)
            //    $btnSaveAppoint.remove();
            if ($txtAreaAppoint != null)
                $txtAreaAppoint.remove();
            if ($location != null)
                $location.remove();

            if ($subjectApp != null)
                $subjectApp.remove();
            if ($description != null)
                $description.remove();
            if ($label != null)
                $label.remove();
            if ($startDate != null)
                $startDate.remove();
            if ($endDate != null)
                $endDate.remove();
            if ($allDay != null)
                $allDay.remove();
            if ($bsyDiv != null)
                $bsyDiv.remove();
            if (ulPagging != null)
                ulPagging.remove();
            if ($firstPage != null)
                $firstPage.remove();
            if ($lastPage != null)
                $lastPage.remove();
            if ($nextPage != null)
                $nextPage.remove();
            if ($previousPage != null)
                $previousPage.remove();
            if ($pageCombo != null)
                $pageCombo.remove();
            if ($selectPages != null)
                $selectPages.remove();

            if ($inboxDiv != null && $inboxDiv != undefined) {
                $inboxDiv.remove();
            }
            $inboxDiv = null;


            //$rightmainDiv.remove();
            //$rightmainDiv = null;
            //$relatedInfoDiv.remove();
            //$relatedInfoDiv = null;
            //$mainDiv.remove();
            //$mainDiv = null;
            //ch = null;


            if ($datagrdRecordInfo != null && $datagrdRecordInfo != undefined) {
                $datagrdRecordInfo.destroy();
            }


            $datagrdRecordInfo = null;
            if (w2ui['historyinboxgrid'] != undefined) {
                w2ui['historyinboxgrid'].destroy();
            }

            if ($datagrdRaltedRecordInfo != null && $datagrdRaltedRecordInfo != undefined) {
                $datagrdRaltedRecordInfo.destroy();
            }
            $datagrdRaltedRecordInfo = null;
            if (w2ui['realtedhistorygrid'] != undefined) {
                w2ui['realtedhistorygrid'].destroy();
            }

            if ($datagrdUserRecordInfo != null && $datagrdUserRecordInfo != undefined) {
                $datagrdUserRecordInfo.destroy();
            }
            $datagrdUserRecordInfo = null;
            if (w2ui['userhistorygrid'] != undefined) {
                w2ui['userhistorygrid'].destroy();
            }


            self = null;
        };
    };

})(VIS, jQuery);