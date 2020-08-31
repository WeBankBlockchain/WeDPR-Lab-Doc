const updateCopyButtonImages = () => {
    const copybuttonimages = document.querySelectorAll('a.copybtn img')
    copybuttonimages.forEach((img, index) => {
    img.setAttribute('src', 'http://www.clker.com/cliparts/2/2/8/6/11949945221692172998copy.svg.hi.png')
    })
}

runWhenDOMLoaded(updateCopyButtonImages)
