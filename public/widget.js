let modalDiv
let widgetDiv
let modalHeader
let headingTitle
let listInfoTable
let langTable
let estimationList
let escrowOfficeList
let widgetFAQList
let back
let root
let widgetImg = document.getElementById('widget1')
let resultValue
let page = 'landing'

let fontStyle, color
const onIframeLoad = () => {
    root = document.getElementById('billionbrix-iframe')
    modalDiv = document.getElementById('myModal');
    widgetDiv = document.getElementsByClassName('widget')[0];
    modalHeader = document.getElementsByClassName('modal-header1')[0]
    headingTitle = document.getElementsByClassName('header-title')[0]
    listInfoTable = document.getElementsByClassName('list-info-table')[0]
    langTable = document.getElementsByClassName('lang-table')[0]
    estimationList = document.getElementsByClassName('estimation-list')[0]
    escrowOfficeList = document.getElementsByClassName('escrow-office-list')[0]
    widgetFAQList = document.getElementsByClassName('widget-faq-list')[0]
    back = document.getElementsByClassName('back-arrow')[0]
    widgetImg = document.getElementById('widget1')
    close = document.getElementsByClassName('close')[0]
    root.style.zIndex = '100000000';
    root.style.height = '110px'
    root.style.width = '110px'
    widgetDiv.onclick = () => {
        root.style.zIndex = '100000000'
        root.style.height = '100%'
        root.style.width = '100%'
        modalDiv.style.display = "block"
        widgetDiv.classList.add('show-modal')
    }
    close.onclick = () => {
        langtype = 'en'
        modalDiv.style.display = "none"
        widgetDiv.classList.remove('show-modal')
        listInfoTable.style.display = 'none'
        langTable.style.display = 'block'
        estimationList.style.display = 'none'
        escrowOfficeList.style.display = 'none'
        widgetFAQList.style.display = 'none'
        back.style.display = 'none'
        headingTitle.innerHTML = getContext('let_me')
        root.style.height = '110px'
        root.style.width = '110px'
    }
    fetch('http://ec2-3-139-2-239.us-east-2.compute.amazonaws.com:8081/titlecalculatorservice/get-titlecompany-widget?companyId=10000').then(res => res.json()).then(data => {

        resultValue = data?.response?.body
        color = resultValue?.titleCompanyInfo?.companyBGColor
        modalHeader.style.backgroundColor = color || 'green'
        widgetImg.style.backgroundColor = color || 'green'
        fontStyle = resultValue?.titleCompanyInfo?.companyFontStyle
        WebFont.load({
            google: {
                families: [fontStyle]
            },
            active: function () {
                root.style.setProperty('font-family', fontStyle, 'important');
            }
        })
        for (let elem of document.getElementsByClassName('list-img-option')) {
            elem.onmouseover = function () {
                this.style.backgroundColor = color
            }

            elem.onmouseout = function () {
                this.style.backgroundColor = 'white'
            }
        }

    })
}






window.onclick = function (event) {
    if (event.target == modalDiv) {
        langtype = 'en'
        modalDiv.style.display = "none";
        listInfoTable.style.display = 'none'
        langTable.style.display = 'block'
        estimationList.style.display = 'none'
        escrowOfficeList.style.display = 'none'
        widgetFAQList.style.display = 'none'
        back.style.display = 'none'
        headingTitle.innerHTML = getContext('let_me')
        root.style.height = '110px'
        root.style.width = '110px'
    }
}

let langtype
const onEnglishclick = (e) => {
    e.preventDefault()
    headingTitle.style.display = 'block'
    listInfoTable.style.display = 'block'
    langTable.style.display = 'none'
    estimationList.style.display = 'none'
    back.style.display = 'block'
    langtype = 'en'
    page = 'estimationlist'
    getinformation()
}

const onSpanishClick = (e) => {
    e.preventDefault()
    headingTitle.style.display = 'block'
    listInfoTable.style.display = 'block'
    langTable.style.display = 'none'
    estimationList.style.display = 'none'
    back.style.display = 'block'
    langtype = 'es'
    page = 'estimationlist'
    getinformation()
}

const onBackClick = () => {
    switch (page) {
        case 'estimationlist':
            listInfoTable.style.display = 'none'
            langTable.style.display = 'block'
            estimationList.style.display = 'none'
            escrowOfficeList.style.display = 'none'
            widgetFAQList.style.display = 'none'
            back.style.display = 'none'
            headingTitle.style.display = 'none'
            page = 'landing'
            break
        case 'estimate':
        case 'faq':
        case 'escrowoffice':
            listInfoTable.style.display = 'block'
            langTable.style.display = 'none'
            estimationList.style.display = 'none'
            escrowOfficeList.style.display = 'none'
            widgetFAQList.style.display = 'none'
            headingTitle.innerHTML = getContext('let_me')
            page = 'estimationlist'
            break
    }
}

const onEstimateClick = (e) => {
    e.preventDefault()
    page = 'estimate'
    headingTitle.innerHTML = getContext('let_me_estimate')
    estimationList.style.display = 'block'
    listInfoTable.style.display = 'none'
    while (estimationList.hasChildNodes()) {
        estimationList.removeChild(estimationList.firstChild)

    }
    const estimateh5 = document.createElement('h5')
    estimateh5.innerHTML = getContext('estimate_quote')
    estimationList.appendChild(estimateh5)
    for (let i = 0; i < resultValue.listOfProducts.length; i++) {
        const estimateListOuterDiv = document.createElement('div')
        estimateListOuterDiv.onclick = () => {
            let url = langtype === 'en' ? resultValue.listOfProducts[i].productUrl :
                `${resultValue.listOfProducts[i].productUrl}&languageid=ES`
            window.open(url, '_blank')
        }
        estimateListOuterDiv.classList.add('list-info-outer-estimate-div')
        const estimateImg = document.createElement('img')
        getImageMap(langtype === 'en' ? resultValue.listOfProducts[i].productName : resultValue.listOfProducts[i].productName_es, estimateImg)
        estimateImg.classList.add('list-img-option')
        for (let elem of document.getElementsByClassName('list-img-option')) {
            elem.onmouseover = function () {
                this.style.backgroundColor = color
            }

            elem.onmouseout = function () {
                this.style.backgroundColor = 'white'
            }
        }
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
    page = 'faq'
    while (widgetFAQList.hasChildNodes()) {
        widgetFAQList.removeChild(widgetFAQList.firstChild)

    }
    widgetFAQList.style.display = 'block'
    listInfoTable.style.display = 'none'
    const faqh5 = document.createElement('h5')
    faqh5.innerHTML = getContext('info_widgetfaq')
    widgetFAQList.appendChild(faqh5)
    let faqList = langtype === 'en' ? resultValue.widgetFAQInfo : resultValue.widgetFAQInfo_es
    for (let key of Object.keys(faqList)) {
        const accordionBtn = document.createElement('button')
        accordionBtn.classList.add('accordion')
        accordionBtn.style.setProperty('font-family', fontStyle, 'important');
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
    page = 'escrowoffice'
    escrowOfficeList.style.display = 'block'
    listInfoTable.style.display = 'none'
    while (escrowOfficeList.hasChildNodes()) {
        escrowOfficeList.removeChild(escrowOfficeList.firstChild)

    }
    const escrowofficeh5 = document.createElement('h5')
    escrowofficeh5.innerHTML = getContext('info_escrow_office')
    escrowOfficeList.appendChild(escrowofficeh5)
    let escrowList = langtype === 'en' ? resultValue.widgetTitlenEscrowFAQInfo : resultValue.widgetTitlenEscrowFAQInfo_es
    for (let key of Object.keys(escrowList)) {
        const accordionBtn = document.createElement('button')
        accordionBtn.classList.add('accordion')
        accordionBtn.style.setProperty('font-family', fontStyle, 'important');
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
            img = 'widgetimages/titlequotecalculator.png'
            break
        case 'Buyer\'s Estimate':
        case 'Estimación del comprador':
            img = 'widgetimages/buyerestimate.png'
            break
        case 'Seller\'s Netsheet':
        case 'Hoja de red del vendedor':
            img = 'widgetimages/sellernetsheet.png'
            break
        case 'Lender\'s Calculator':
        case 'Calculadora del prestamista':
            img = 'widgetimages/lenderestimate.png'
            break
        case 'Closing Disclosure':
        case 'Divulgación de cierre':
            img = 'widgetimages/closingdiscloser.png'
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

(function () {

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = './widget.css';

    document.getElementsByTagName('HEAD')[0].appendChild(link);
    include('https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    var root = document.createElement("div");
    root.setAttribute('style', 'border:none;position: fixed;right: 0;bottom: 0;z-index: -11;');
    root.setAttribute('id', 'billionbrix-iframe');
    document.body.appendChild(root);
    let widgetAvatar = document.createElement("img");
    widgetAvatar.setAttribute('src', 'widgetimages/avatarwidget.jpg');
    widgetAvatar.setAttribute('alt', 'widget avatar');
    widgetAvatar.setAttribute('id', 'widget1');
    widgetAvatar.classList.add('widget');
    root.appendChild(widgetAvatar);
    //////////Widget Modal //////////
    var widgetModal = document.createElement("div");
    widgetModal.setAttribute('id', 'myModal');
    widgetModal.classList.add('widget-modal');
    root.appendChild(widgetModal);
    ////////widget Content//////////
    var widgetContent = document.createElement("div");
    widgetContent.classList.add('modal-content1');
    widgetModal.appendChild(widgetContent);
    /////////widget Header///////////
    var widgetHeader = document.createElement("div");
    widgetHeader.classList.add('modal-header1');
    widgetContent.appendChild(widgetHeader);
    ////////widget back image/////////
    var backImage = document.createElement("img");
    backImage.setAttribute('src', 'widgetimages/back.png');
    backImage.setAttribute('alt', 'back');
    backImage.classList.add('back-arrow');
    backImage.onclick = () => onBackClick();
    widgetHeader.appendChild(backImage);
    ///////widget header content////////
    var headercontent = document.createElement("div");
    headercontent.classList.add('header-content');
    var headervatarImage = document.createElement("img");
    headervatarImage.setAttribute('src', 'widgetimages/avatarwidget.jpg');
    headervatarImage.setAttribute('alt', 'Avatar');
    headervatarImage.classList.add('avatar');
    headercontent.appendChild(headervatarImage);

    ////////////widget header Header Message/////////
    var headerMsgP = document.createElement("p");
    headerMsgP.innerHTML = 'Let me know how can I help you';
    headerMsgP.classList.add('header-title');
    headercontent.appendChild(headerMsgP);
    widgetHeader.appendChild(headercontent);
    ///////////////Widget close icon//////////
    var headerClose = document.createElement("span");
    headerClose.innerHTML = '&times;';
    headerClose.classList.add('close');
    widgetHeader.appendChild(headerClose);
    ///////////////Widget Body////////////
    var widgetBody = document.createElement("div");
    widgetBody.classList.add('modal-body');
    widgetContent.appendChild(widgetBody);
    //////////Widget Lang Table//////////
    var widgetlangTable = document.createElement("div");
    widgetlangTable.classList.add('lang-table');
    widgetBody.appendChild(widgetlangTable);
    ////////Info List////////
    var widgetInfoList1 = document.createElement("div");
    widgetInfoList1.classList.add('list-info-outer-div');
    var widgetInfoImage1 = document.createElement("img");
    widgetInfoImage1.setAttribute('src', 'widgetimages/hi.png');
    widgetInfoImage1.setAttribute('alt', 'englihs-hi');
    widgetInfoImage1.classList.add('list-img-option');
    widgetInfoList1.appendChild(widgetInfoImage1);
    var widgetInfoInnerContent1 = document.createElement("div");
    widgetInfoInnerContent1.classList.add('list-info-inner-div');
    var widgetInfoInneranchor1 = document.createElement("a");
    widgetInfoInneranchor1.setAttribute('href', '#');
    widgetInfoInneranchor1.innerHTML = 'I\'m Sophie. How may I help you today?';
    widgetInfoInneranchor1.onclick = (e) => onEnglishclick(e);
    widgetInfoInnerContent1.appendChild(widgetInfoInneranchor1);
    widgetInfoList1.appendChild(widgetInfoInnerContent1);
    widgetlangTable.appendChild(widgetInfoList1);

    var widgetInfoList2 = document.createElement("div");
    widgetInfoList2.classList.add('list-info-outer-div');
    var widgetInfoImage2 = document.createElement("img");
    widgetInfoImage2.setAttribute('src', 'widgetimages/hola.png');
    widgetInfoImage2.setAttribute('alt', 'englihs-hi');
    widgetInfoImage2.classList.add('list-img-option');
    widgetInfoList2.appendChild(widgetInfoImage2);
    var widgetInfoInnerContent2 = document.createElement("div");
    widgetInfoInnerContent2.classList.add('list-info-inner-div');
    var widgetInfoInneranchor2 = document.createElement("a");
    widgetInfoInneranchor2.setAttribute('href', '#');
    widgetInfoInneranchor2.innerHTML = 'Soy Sophie ¿Como puedo ayudarte hoy?';
    widgetInfoInneranchor2.onclick = (e) => onSpanishClick(e);
    widgetInfoInnerContent2.appendChild(widgetInfoInneranchor2);
    widgetInfoList2.appendChild(widgetInfoInnerContent2);
    widgetlangTable.appendChild(widgetInfoList2);

    /////////////Info List 2 ////////////////////////
    var widgetInfoOptionsDiv = document.createElement("div");
    widgetInfoOptionsDiv.classList.add('list-info-table');
    const optionImage = ['widgetimages/officeinformation.png', 'widgetimages/provideestimationoftitlequoteselletnetsheetetc.png', 'widgetimages/informationforsmoothclosing.png']
    optionImage.forEach((img, index) => {
        var widgetInfoOptions = document.createElement("div");
        widgetInfoOptions.classList.add('list-info-outer-div');
        var widgetInfoOptionsImg = document.createElement("img");
        widgetInfoOptionsImg.setAttribute('src', img);
        widgetInfoOptionsImg.setAttribute('alt', 'image' + index);
        widgetInfoOptionsImg.classList.add('list-img-option');
        widgetInfoOptions.appendChild(widgetInfoOptionsImg);
        var widgetInfoOptionsDetails = document.createElement("div");
        widgetInfoOptionsDetails.classList.add('list-info-inner-div');
        var widgetInfoOptionsDetailsH5 = document.createElement("h5");
        widgetInfoOptionsDetailsH5.classList.add('list-h5');
        widgetInfoOptionsDetails.appendChild(widgetInfoOptionsDetailsH5);
        widgetInfoOptions.appendChild(widgetInfoOptionsDetails);
        switch (index) {
            case 0: widgetInfoOptions.onclick = (e) => onEscrowOfficeClick(e);
                break;
            case 1: widgetInfoOptions.onclick = (e) => onEstimateClick(e);
                break;
            case 2: widgetInfoOptions.onclick = (e) => onFAQClick(e);
                break;
        }
        widgetInfoOptionsDiv.appendChild(widgetInfoOptions);

    })
    widgetBody.appendChild(widgetInfoOptionsDiv);

    const className = ['estimation-list', 'escrow-office-list', 'widget-faq-list'];
    className.forEach(className => {
        var list = document.createElement("div");
        list.classList.add(className);
        widgetBody.appendChild(list);
    })

    onIframeLoad();

})();

function include(file) {
    var script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;
    document.getElementsByTagName('head').item(0).appendChild(script);

}
