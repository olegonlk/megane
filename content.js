const parser = new DOMParser();

images = document.getElementsByTagName('img')

function getFromTextbox(textarea){
    exploit = textarea[0].textContent
    startingPoint = exploit.search('src="') + 5
    endingPoint = exploit.search('" />') - 4

    return exploit.slice(startingPoint, endingPoint)
}

for(let i = 0; i < images.length; i++){
    //Home page
    images[i].src = images[i].src.replace("manganew_thumbs_blur", "manganew_thumbs")

    //Search page
    if (images[i].src.search(".jpg") == -1 && images[i].src.search(".png") == -1 && images[i].src.search(".gif") == -1 && images[i].src.search(".webp") == -1){
        try{
            fetch(images[i].parentNode.nextSibling.nextSibling.childNodes[1].childNodes[0].href).then(r => r.text()).then(result => {
                htmlDocument = parser.parseFromString(result, "text/html")
                textareal = htmlDocument.getElementsByTagName('textarea')

                tocheck = images[i]
                var z = 0; //checking if this node first or second
                while((tocheck = tocheck.previousSibling) != null) z++;

                if (z == 1){
                    images[i].src = getFromTextbox(textareal).replace("imgcover.", "img.").replace("manganew_thumbs_blur","manganew_thumbs") + ".jpg"
                } else {
                    chrome.runtime.sendMessage(result, function(response) { //Hey, background script! I need your help!
                        images[i].src = response
                    })
                }
            })
        }
        catch(err){
            //yep, i don't give a fuck
        }
    }

    //Manga page
    if (images[i].id == "cover" && images[i].src.search(".html") != -1){
        textareal = document.getElementsByTagName('textarea')
        images[i].src = getFromTextbox(textareal).replace("imgcover.", "img.").replace("manganew_thumbs_blur","showfull_retina/manga") + ".jpg"
    }
}