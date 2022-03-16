

const modalDiv = document.getElementById('myModal')
const widgetDiv = document.getElementsByClassName('widget')[0]
const modalHeader = document.getElementsByClassName('modal-header1')[0]
const headingTitle = document.getElementsByClassName('header-title')[0]
const listInfoTable = document.getElementsByClassName('list-info-table')[0]
const langTable = document.getElementsByClassName('lang-table')[0]
const estimationList = document.getElementsByClassName('estimation-list')[0]
const escrowOfficeList = document.getElementsByClassName('escrow-office-list')[0]
const widgetFAQList = document.getElementsByClassName('widget-faq-list')[0]

let resultValue
widgetDiv.onclick = () => {
    modalDiv.style.display = "block"
    widgetDiv.classList.add('show-modal')
    fetch('http://localhost:3004/input').then(res => res.json()).then(data => {
        console.log('data-->', data)
        resultValue = data?.response?.body
        modalHeader.style.backgroundColor = resultValue?.titleCompanyInfo?.companyBGColor || 'green'
    })
}

document.getElementsByClassName('close')[0].onclick = () => {
    modalDiv.style.display = "none"
    widgetDiv.classList.remove('show-modal')
    langTable.style.display = 'block'
    estimationList.style.display = 'none'
    escrowOfficeList.style.display = 'none'
    widgetFAQList.style.display = 'none'
}

window.onclick = function (event) {
    if (event.target == modalDiv) {
        modalDiv.style.display = "none";
    }
}
let langtype
const onEnglishclick = (e) => {
    e.preventDefault()
    headingTitle.style.display = 'block'
    listInfoTable.style.display = 'block'
    langTable.style.display = 'none'

    langtype = 'en'
    getinformation()
}

const onSpanishClick = (e) => {
    e.preventDefault()
    headingTitle.style.display = 'block'
    listInfoTable.style.display = 'block'
    langTable.style.display = 'none'
    langtype = 'es'
    getinformation()
}

const onEstimateClick = (e) => {
    e.preventDefault()
    headingTitle.innerHTML = getContext('let_me_estimate')
    estimationList.style.display = 'block'
    listInfoTable.style.display = 'none'
    estimationList.getElementsByTagName('h5')[0].innerHTML = getContext('estimate_quote')
    for (let i = 0; i < resultValue.listOfProducts.length; i++) {
        const estimateListOuterDiv = document.createElement('div')
        estimateListOuterDiv.onclick = () => {
            let url = langtype === 'en'  ? resultValue.listOfProducts[i].productUrl :
            `${resultValue.listOfProducts[i].productUrl}&languageid=ES`
            window.open(url, '_blank')
        }
        estimateListOuterDiv.classList.add('list-info-outer-div')
        const estimateImg = document.createElement('img')
        getImageMap(langtype === 'en' ? resultValue.listOfProducts[i].productName : resultValue.listOfProducts[i].productName_es, estimateImg)
        estimateImg.classList.add('list-img-option')
        const estimateInnerDiv = document.createElement('div')
        estimateInnerDiv.classList.add('list-info-inner-div')
        const estimateH5 = document.createElement('h5')
        estimateH5.classList.add('list-h5')
        estimateH5.innerHTML = langtype === 'en' ? resultValue.listOfProducts[i].productName : resultValue.listOfProducts[i].productName_es
        estimateInnerDiv.appendChild(estimateH5)
        estimateListOuterDiv.appendChild(estimateImg)
        estimateListOuterDiv.appendChild(estimateInnerDiv)
        estimationList.appendChild(estimateListOuterDiv)
    }
}

const onFAQClick = (e) => {
    e.preventDefault()
    widgetFAQList.style.display = 'block'
    listInfoTable.style.display = 'none'
    widgetFAQList.getElementsByTagName('h5')[0].innerHTML = getContext('info_widgetfaq')
    let faqList = langtype === 'en' ? resultValue.widgetFAQInfo : resultValue.widgetFAQInfo_es
    for (let key of Object.keys(faqList)) {
        const accordionBtn = document.createElement('button')
        accordionBtn.classList.add('accordion')
        accordionBtn.innerHTML = key
        const panel = document.createElement('div')
        panel.classList.add('panel')
        panel.innerHTML = faqList[key]
        widgetFAQList.appendChild(accordionBtn)
        widgetFAQList.appendChild(panel)
    }
    let acc = collapseArr = document.getElementsByClassName("accordion");
    let i
    for (i = 0; i < acc.length; i++) {

        acc[i].onclick = function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
            for (j = 0; j < collapseArr.length; j++) {
                if (collapseArr[j] === this) continue
                collapseArr[j].classList.remove("active")
                var panel = collapseArr[j].nextElementSibling;
                panel.style.maxHeight = null
            }
        }
    }
}

const onEscrowOfficeClick = (e) => {
    e.preventDefault()
    escrowOfficeList.style.display = 'block'
    listInfoTable.style.display = 'none'
    escrowOfficeList.getElementsByTagName('h5')[0].innerHTML = getContext('info_escrow_office')
    let escrowList = langtype === 'en' ? resultValue.widgetTitlenEscrowFAQInfo : resultValue.widgetTitlenEscrowFAQInfo_es
    for (let key of Object.keys(escrowList)) {
        const accordionBtn = document.createElement('button')
        accordionBtn.classList.add('accordion')
        accordionBtn.innerHTML = key
        const panel = document.createElement('div')
        panel.classList.add('panel')
        panel.innerHTML = escrowList[key]
        escrowOfficeList.appendChild(accordionBtn)
        escrowOfficeList.appendChild(panel)
    }
    let acc = collapseArr = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {

        acc[i].onclick = function () {

            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
            for (j = 0; j < collapseArr.length; j++) {
                if (collapseArr[j] === this) continue
                collapseArr[j].classList.remove("active")
                var panel = collapseArr[j].nextElementSibling;
                panel.style.maxHeight = null
            }
        }
    }
}
const getImageMap = (productName, estimateImg) => {
    let img
    switch (productName) {
        case 'Title Quote':
        case 'Cita del título':
            img = 'images/BuyerPays.png'
            break
        case 'Buyer\'s Estimate':
        case 'Estimación del comprador':
            img = 'images/no_hoa.png'
            break
        case 'Seller\'s Netsheet':
        case 'Hoja de red del vendedor':
            img = 'images/two_mortgage.png'
            break
        case 'Lender\'s Calculator':
        case 'Calculadora del prestamista':
            img = 'images/SellerPays.png'
            break
        case 'Closing Disclosure':
        case 'Divulgación de cierre':
            img = 'images/refinance.png'
            break
    }

    estimateImg.src = img
}
const infoEs = ['Información sobre su título y oficina de depósito en garantía', 'Estime su costo de cierre, ganancias netas, refinanciar costo u obtener una cotización de título',
    'información que necesita para un cierre sin problemas']


const info = ['Information regarding your title and escrow office', 'Estimaste your closing cost, net proceeds, refinance cost or get a title quote',
    'information you need for a smooth closing'
]



const context = {
    'let_me': 'Let me know how can I help you',
    'let_me_es': 'Déjame saber cómo puedo ayudarte',
    'let_me_estimate': 'Let me help you to calculate your closing cost',
    'let_me_estimate_es': 'Déjame ayudarte a calcular tu costo de cierre',
    'info_escrow_office': 'Information regarding your title and escro office',
    'info_escrow_office_es': 'Información sobre su título y oficina de escro',
    'estimate_quote': 'Estimaste your closing cost, net proceeds, refinance cost or get a title quote',
    'estimate_quote_es': 'Estime su costo de cierre, ganancias netas, refinanciar costo u obtener una cotización de título',
    'info_widgetfaq': 'Information you need for a smooth closing',
    'info_widgetfaq_es': 'Información que necesita para un cierre sin problemas',
}

const getinformation = (key) => {
    const listH5 = document.getElementsByClassName('list-h5')
    for (let i = 0; i < listH5.length; i++) {
        listH5[i].innerHTML = langtype === 'es' ? infoEs[i] : info[i]
    }
    headingTitle.innerHTML = getContext('let_me')
}

const getContext = (key) => {
    return context[langtype === 'es' ? key + '_es' : key]
}