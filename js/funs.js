
function XHRGet(url,f) {
    let xhr = new XMLHttpRequest();            
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { 
          f(xhr);
      }
    };
    xhr.send();
}
function XHRGet_d(url) {
    let xhr = new XMLHttpRequest();            
    xhr.open('GET', url,false);
    xhr.send();
    if (xhr.status === 200) {
        return xhr;
    }
    return null;
}
function loadFiles(loader,filesData) {
    let data=JSON.parse(filesData);
    for(i in data){
        loader.addImage(i,data[i]);
    } 
}