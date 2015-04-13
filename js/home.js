/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        try{
            getfile("recallsfilemap.txt");
        } catch (e) { alert(e);}
        //readfile('vehicles.txt');
    }

};

var mans = window.sessionStorage.getItem("mans");
var recalls = window.sessionStorage.getItem("recalls");
var newdata = false;

function getfile(filename) {
   var ch = window.sessionStorage.getItem("checked");
   //if (!ch || ch != "1")
   check3(filename);

}
var countfail = 0;


function check3(fileName) {
    store = cordova.file.dataDirectory;
    window.resolveLocalFileSystemURL(store + fileName, appStart, function (asset) { return downloadAsset(asset, fileName); });
}
function appStart(entry) {
   
    var file = entry.file(gotfile, downloadAsset(entry, 'recallsfilemap.txt'));

    //store = cordova.file.dataDirectory;
    ////cordova.file.dataDirectory.getFile(store + "test.txt", { create: false }, gotfile, downloadAsset); //of requestFileSystem
    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
    //    alert("directory filesystem = " + fs.root.toURL());
    //}, function () {
    //    alert("failed to get file system")
    //});

}
function downloadAsset(asset,filename) {
    //alert(JSON.stringify(filename)); 
    //alert("http://www.leadyourweb.com/" + filename);
    var fileTransfer = new FileTransfer();
    
    var uri = encodeURI("http://www.leadyourweb.com/" + filename);
    file_path = cordova.file.dataDirectory;
    //alert("About to start transfer");
    fileTransfer.download(uri, file_path + filename,
    	function (entry) {
    	    //alert("Success!" + file_path + filename);
    	    //checkfileexist(file_path + 'test.txt');
    	    newdata = true;
    	    appStart(entry);
    	},
    	function (err) {
    	    console.log("Error");
    	    //alert(JSON.stringify(err));
    	});
}
function gotfile(entry) {
    //alert(JSON.stringify(entry));
    var d = new Date();
    var filedate = entry.lastModifiedDate;
    var now = d.getTime();
    var diff = now - filedate;

 

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var days = diff / msPerDay;
    window.sessionStorage.setItem("checked", "1");
    window.sessionStorage.setItem("lastchecked", filedate);

    if (days > 7 && entry.name == "recallsfilemap.txt") {
        //alert('refres');
        downloadAsset(entry, 'recallsfilemap.txt');
        vm.progress("Checking new recalls");
    }
    else {

        //vm.recalls(bet.data);
        //vm.getmans(bet.data);
        //vm.isloading(false);
        $('.help').addClass("hidden");
        //alert('opening');
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            //alert("read success");
            try {
                //data = $.csv2Array(evt.target.result);
                // Parse CSV string
                //alert(evt.target.result);
                if (entry.name == "recallsfilemap.txt" && newdata) {

                    var lines = this.result.split('\r\n');
                    vm.totalfiles(lines.length);
                    for (var line = 0; line < lines.length; line++) {
                        if (lines[line].length > 0) {
                            getfile(lines[line]);
                        }
                        else { vm.totalfiles(vm.totalfiles() - 1); }


                    }
                }
                else
                    vm.isloading(false);

                if (entry.name.indexOf(".csv") > -1)
                {
var bet = Papa.parse(evt.target.result.toString(), { header: true });
                //alert(JSON.stringify(bet));
                //setmans(bet.data);
                
                    //fillrecalls(bet.data);
//ko.mapping.fromJS(bet.data, vm.mans());
vm.getmans(bet.data);
                    //window.localStorage.setItem("mans", ko.toJSON(vm.mans()));

vm.filesread(vm.filesread() + 1);
                    

if (vm.filesread() == vm.totalfiles()) {
    //alert(ko.toJSON(vm.mans(), null, 2));
    // vm.status(vm.status() + "<br>Read files " + vm.filesread() + " of " + vm.totalfiles());
    //alert('star writing');

    //vm.mans().sort(function (left, right) { return left.Make == right.Make ? 0 : (left.Make < right.Make ? -1 : 1) });
    writefile("mans.txt", ko.toJSON(vm.mans(), null, 2));

    vm.isloading(false);


}
else {
    vm.isloading(true);
    
    vm.progress((((vm.filesread() / vm.totalfiles()) * 100)).toFixed(0) + " %");

}
//alert(vm.filesread());
 if (!bet.data & countfail < 2) {
                    countfail += 1;
                    downloadAsset(entry, 'recallsfilemap.txt');
                }
                if (countfail >= 2)
                    alert("Error Occured!");
                }
                
                //vm.isloading(true);
                //var m = processData(evt.target.result);
                //alert(bet.data);

               
                //
                try{

                //alert(JSON.stringify(vm.mans()));
                } catch (e) { alert(e) }
                //ko.mapping.fromJS(mans, vm.mans());
                //alert(data.length);
                //vm.recalls(data);
                //alert(vm.mans().length);
                //var csvAsArray = evt.target.result.csvToArray();
                // alert(JSON.stringify(data));
            } catch (e) { alert(e) }
        };
        reader.readAsText(entry);

    }

}
function writefile(fileName, data) {
    //store = cordova.file.dataDirectory;
    //alert("trywrote");
    //createdir(fileName, fileName);
    //window.resolveLocalFileSystemURL(store + fileName, writeme, writeme);
    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) { return gotFS(fileSystem, fileName, data); }, fail);
    // window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function (fs) {
    //    fs.root.getFile(fileName, { create: true, exclusive: false },
    //      function (entry) {
    //          fileTransfer.download(
    //                  store+fileName, // the filesystem uri you mentioned
    //                  entry.fullPath,
    //                  function (entry) {
    //                      // do what you want with the entry here
    //                      console.log("download complete: " + entry.fullPath);
    //                  },
    //                  function (error) {
    //                      console.log("error source " + error.source);
    //                      console.log("error target " + error.target);
    //                      console.log("error code " + error.code);
    //                  },
    //                  false,
    //                  null
    //          );
    //      }, function () {
    //          alert("file create error");
    //      });
    //}, null);


    function gotFS(fileSystem, fileName, data) {
        store = cordova.file.dataDirectory;
        //alert(fileName);
        //alert(data);
        fileSystem.root.getFile(store + fileName, { create: true, exclusive: false }, function (gotfile) { return gotFileEntry(gotfile, fileName, data); }, fail);
        function gotFileEntry(fileEntry, fileName, data) {

            fileEntry.createWriter(function (writer) { return gotFileWriter(writer, fileName, data); }, fail);
        }
        function gotFileWriter(writer, fileName, data) {
           // alert(fileName);
           // alert(data);
            writer.onwriteend = function (evt) {
               // alert("contents of file now 'some sample text'");
                //writer.truncate(11);
                writer.onwriteend = function (evt) {
                    //console.log("contents of file now 'some sample'");
                    //writer.seek(4);
                    //writer.write(" different text");
                    writer.onwriteend = function (evt) {
                        console.log("contents of file now 'some different text'");
                    }
                };
            };
            writer.write(data);
        }

    }
    function fail() { }

}

function writefile(fileName, data) {
    store = cordova.file.dataDirectory;
    //alert(store);
    window.resolveLocalFileSystemURI(store, onSuccess, onError);
    try {
        function onSuccess(entry) {
            entry.getDirectory("", { create: true, exclusive: false }, function (dir) { return direxist(dir, fileName, data); }, nodir);
        }
        function onError(error) {
            console.log(error);
        }
        function direxist(entry, fileName, data) {
            //alert("gettingfile" + fileName);
            entry.getFile(fileName, { create: true, exclusive: false }, function (file) { return myfile(file, fileName, data); }, nodir);

            //alert(JSON.stringify(entry));
        }
        function myfile(entry, fileName, data) {

            entry.createWriter(function (writer) { return writenow(writer, fileName, data); }, nodir);

        }
        function writenow(writer, fileName, data) {
            //alert('writing now' + data);
            writer.onwriteend = function (evt) {
               // alert("contents of file now 'some sample text'");
                //writer.truncate(11);
                writer.onwriteend = function (evt) {
                    //console.log("contents of file now 'some sample'");
                    //writer.seek(4);
                    //writer.write(" different text");
                    writer.onwriteend = function (evt) {
                        console.log("contents of file now 'some different text'");
                    }
                };
            };
            writer.write(data);
           
        }
        function nodir(entry) {

            alert("Error Occured!");
        }
    } catch (e) { alert(e); }
}

function processData(allText) {
    var record_num = 14;  // or however many elements there are in each row
    var allTextLines = allText.split(/\r\n|\n/);
    //alert(allTextLines.length + 'line');
    var entries = allTextLines[0].split(',');
    //alert(entries.length + 'hhead');
    var lines = [];

    var headings = entries.splice(0, record_num);
    while (entries.length > 0) {
        var tarr = [];
        for (var j = 0; j < record_num; j++) {
            tarr.push(headings[j] + ":" + entries.shift());
        }
        lines.push(tarr);
    }
    return lines;
}

function readfile(fileName) {
    try{
        store = cordova.file.dataDirectory;
    } catch (e) { alert(e);}
    window.resolveLocalFileSystemURL(store + fileName, function (reader) { return openfile(reader, fileName); }, filenotfound);
}
function openfile(entry, fileName) {
    //alert('ead' + ".txt" + JSON.stringify(entry.File()));
    var file = entry.file(function (reader) { return readthis(reader, fileName); }, downloadAsset(entry, 'recallsfilemap.txt'));
}
function filenotfound() {
    //alert("file not found!");
}
function readthis(entry,fileName) {

    //alert('opening');
    var reader = new FileReader();
    reader.onloadend = function (evt) {
        //alert("read success");
        try {
            var son = ko.utils.parseJson(evt.target.result);
            //ko.mapping.fromJS(son, vm.searchresult());
            //alert(fileName + ">"+evt.target.result);
            var i ;
            for (i = 0; i < son.length; i++)
            {
                if (!son[i]) {

                    son.splice(i, 1);
                    //writefile(fileName, son);
                }
            }
            ko.mapping.fromJS(son, vm.searchresult);
            //vm.isloading(false);

            //vm.searchresult(son);
            //alert('afte reaad:'+vm.searchresult().length);
            //alert(JSON.stringify(vm.searchresult()));
            //alert(JSON.stringify(vm.searchresult()));
            //alert(son);
            $('.help').addClass("hidden");
        } catch (e) { alert(e) }
    };
    reader.readAsText(entry);



}

function setmans(array) {
    try {
        var output =[];
        var outputstr='';
        
        //    outputstr = window.sessionStorage.getItem("mans");
        //alert(outputstr);
        var son;
        if (window.sessionStorage.getItem("mans")) {
            son = window.sessionStorage.getItem("mans");//ko.utils.parseJson(outputstr);
        }
        //alert("ess" +JSON.stringify( son));
        //ko.mapping.fromJS(son, vm.searchresult());
        var i;
        for (i = 0; i < son.length; i++) {
            if (!son[i]) {

                son.splice(i, 1);
                //writefile(fileName, son);
            }
        }
        try{
            if (son)
                ko.mapping.fromJS(son, output);
        } catch (e) { alert('frf' +e);}

       
        var flags = [],  l = array.length, i;
        for (i = 0; i < l; i++) {
            if (flags[array[i].Make]) continue;
            flags[array[i].Make] = true;
            //alert(array[i].Make);
            var mymake = new make();
            mymake.Make(array[i].Make);
            mymake.getmodels(array[i].Make);
            //mymake.Models(models);
            if (array[i].Make && array[i].Make.toString().trim().length > 0)
                output.push(mymake);
            // alert()
        }
        //alert(output);
        //ko.mapping.fromJS(output,this.mans());
        mans = output;
        window.sessionStorage.setItem("mans", JSON.stringify(output));
        writefile("mans.txt", ko.toJSON(mans, null, 2));
        // alert(this.mans().length);
        //alert(JSON.stringify(output));
        readfile("mans.txt");
    } catch (e) { alert('145' + e); }
}

function getmodels(make, recalls) {
    try {

        var flags = [], output = [], l = recalls.length, i;
        for (i = 0; i < l; i++) {

            if (vm.recalls()[i].Make == make.Make()) {
                //alert('getting models for ' + self.Make() + '' + vm.recalls()[i].Model + '<<' + vm.recalls()[i].Model);
                var found = false;
                for (var j = 0; j < output.length; j++) {
                    if (output[j] === vm.recalls()[i].Model) {
                        found = true;
                    }
                }
                if (!found) output.push(vm.recalls()[i].Model);

                //alert(JSON.stringify(output));
                //output.push('hello');

            }
        }
        //ko.mapping.fromJS(output,this.mans());
        //alert(output + '<<');
        output.sort();
        self.Models(output);
        // alert(this.mans().length);
        //alert(JSON.stringify(output));
    } catch (e) { alert('103' + e); }
}



