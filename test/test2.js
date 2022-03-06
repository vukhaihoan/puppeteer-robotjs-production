str = "https://translate.google.com/?sl=en&tl=vi&text=FORCE%20CLOSE%20PAGE%20DUE%20TO%20ERROR&op=translate";
// get "https://translate.google.com/" from str
function getUrl(str) {
    let url = str.split("/");
    return url;
}
console.log(getUrl(str));
