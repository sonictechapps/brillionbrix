var widgetDiv = document.createElement("IMG")
widgetDiv.className = 'widget'
document.getElementById('root1').appendChild(widgetDiv)
widgetDiv.src = 'images/whatsapp.png'
//////////////Modal//////////
var modalDiv = document.createElement("DIV")
modalDiv.className = 'widget-modal'
modalDiv.id = 'myModal'
var modalContent = document.createElement("DIV")
modalContent.className = 'modal-content1'

/////////////Modal Heaader///////////////
var modalHeader = document.createElement("DIV")
modalHeader.className = 'modal-header1'
var closeSpan = document.createElement("SPAN")
closeSpan.className = 'close'
closeSpan.innerHTML = '&times;'
modalHeader.appendChild(closeSpan)
document.getElementById('root1').appendChild(modalDiv)
var headerTable = document.createElement("TABLE")
headerTable.style.width = '100%'
var headerTableRow = document.createElement("TR")
var headerImageTD = document.createElement("TD")
var headerImage = document.createElement("IMG")
headerImage.src = 'images/avatar.png'
headerImage.alt = 'Avatar'
headerImage.className = 'avatar'
headerImageTD.appendChild(headerImage)
var headerDataTD = document.createElement("TD")
var h2 = document.createElement("H2")
h2.innerHTML = 'Let me help you to calculate your closing cost'
headerDataTD.appendChild(h2)
headerTableRow.appendChild(headerImageTD)
headerTableRow.appendChild(headerDataTD)
headerTable.appendChild(headerTableRow)
modalHeader.appendChild(headerTable)
modalContent.appendChild(modalHeader)


//////////////Modal Body //////////////////

var modalBodyRole = document.createElement("DIV")
modalBodyRole.className = 'modal-body-role'
var h3 = document.createElement("h3")
h3.style.textAlign = 'center'
h3.innerHTML = 'Please choose your role'
var roleTable = document.createElement("TABLE")
roleTable.style.width = '100%'
const roleArray = [{
    role: 'Title Officer',
    image: 'images/image3.png'
},
{
    role: 'Realtor',
    image: 'images/image3.png'
},
{
    role: 'Lender',
    image: 'images/image3.png'
},
{
    role: 'Buyer',
    image: 'images/image3.png'
},
{
    role: 'Seller',
    image: 'images/image3.png'
}]

for (let role of roleArray) {
    var bodyTableRow = document.createElement('TR')
    bodyTableRow.style.height = '70px'
    bodyTableRow.style.cursor = 'pointer'
    var imgTD = document.createElement('TD')
    var img = document.createElement('IMG')
    img.src = role.image
    img.alt = role.role
    img.className = 'selection'
    img.style.height = '50px'
    img.style.width = '50px'
    imgTD.appendChild(img)
    var textTD = document.createElement('TD')
    var h5 = document.createElement('H5')
    h5.innerHTML = role.role
    textTD.appendChild(h5)
    bodyTableRow.appendChild(imgTD)
    bodyTableRow.appendChild(textTD)
    roleTable.appendChild(bodyTableRow)
    bodyTableRow.onclick = () => {
        if (role.role === 'Buyer') {
            buyerCalculator()
        }
        if (role.role === 'Lender') {
            lenderCalculator()
        }
        if (role.role === 'Seller') {
            sellerCalculator()
        }
        if (role.role === 'Title Officer') {
            titleOfficerCalculator()
        }
    }
}
modalBodyRole.appendChild(h3)
modalBodyRole.appendChild(roleTable)
modalContent.appendChild(modalBodyRole)
modalDiv.appendChild(modalContent)

///////////////click//////////////

widgetDiv.onclick = () => {
    modalDiv.style.display = "block"
}

closeSpan.onclick = () => {
    modalDiv.style.display = "none"
}

window.onclick = function (event) {
    if (event.target == modalDiv) {
        modalDiv.style.display = "none";
    }
}

const getCalculator = (calArray, isTitleOfficer = false) => {
    modalBodyRole.style.display = 'none'
    var modalBodyCalculator = document.createElement("DIV")
    modalBodyCalculator.className = 'modal-body-calculator'
    var h3 = document.createElement("h3")
    h3.style.textAlign = 'center'
    h3.innerHTML = 'Please choose your Calculator'
    var roleTable = document.createElement("TABLE")
    roleTable.style.width = '100%'
    for (let role of calArray) {
        var bodyTableRow = document.createElement('TR')
        bodyTableRow.style.height = '70px'
        bodyTableRow.style.cursor = 'pointer'
        var imgTD = document.createElement('TD')
        var img = document.createElement('IMG')
        img.src = role.image
        img.alt = role.role
        img.className = 'selection'
        img.style.height = '50px'
        img.style.width = '50px'
        imgTD.appendChild(img)
        var textTD = document.createElement('TD')
        var h5 = document.createElement('H5')
        h5.innerHTML = role.role
        textTD.appendChild(h5)
        bodyTableRow.appendChild(imgTD)
        bodyTableRow.appendChild(textTD)
        roleTable.appendChild(bodyTableRow)
        bodyTableRow.onclick = () => {
            if (role.role === 'Buyer') {
                buyerCalculator()
            }
        }
    }
    modalBodyCalculator.appendChild(h3)
    modalBodyCalculator.appendChild(roleTable)
    modalContent.appendChild(modalBodyCalculator)

}

const buyerCalculator = () => {
    const calArray = [{
        role: 'Title Quote',
        image: 'images/image3.png'
    },
    {
        role: 'Buyer\'s estimate',
        image: 'images/image3.png'
    }]

    getCalculator(calArray)
}

const lenderCalculator = () => {
    const calArray = [{
        role: 'Title Quote',
        image: 'images/image3.png'
    },
    {
        role: 'Lender\'s calculator',
        image: 'images/image3.png'
    },
    {
        role: 'Closing disclosure',
        image: 'images/image3.png'
    }]

    getCalculator(calArray)
}

const sellerCalculator = () => {
    const calArray = [{
        role: 'Title Quote',
        image: 'images/image3.png'
    },
    {
        role: 'Seller\'s Netsheet',
        image: 'images/image3.png'
    }]

    getCalculator(calArray)
}

const titleOfficerCalculator = () => {
    const calArray = [{
        role: 'Title Quote',
        image: 'images/image3.png'
    },
    {
        role: 'Buyer\'s estimate',
        image: 'images/image3.png'
    },
    {
        role: 'Seller\'s Netsheet',
        image: 'images/image3.png'
    },
    {
        role: 'Lender\'s calculator',
        image: 'images/image3.png'
    },
    {
        role: 'Closing disclosure',
        image: 'images/image3.png'
    }]

    getCalculator(calArray, true)
}


