setInterval(cycle, 100);
setInterval(getdownloads, 900000)
getdownloads();

var downloads = 0;

function cycle() {
    document.getElementById("downloads").innerHTML = downloads.toString();
}

async function getdownloads() {
    var authordata = JSON.parse(httpGet("https://api.cfwidget.com/author/search/inzhefop"));
    var projectids = []
    for (var i = 0; i <= 21; i++) {
        projectids.push(authordata.projects[i].id)
    }

    downloads = 0;
    for (var i = 0; i < projectids.length; i++) {
        var projectdata = await JSON.parse(httpGet("https://api.cfwidget.com/" + projectids[i]));
        downloads += projectdata.downloads.total;
    }
    console.log(downloads);
    
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

