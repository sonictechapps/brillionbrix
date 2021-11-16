import { Popover } from 'bootstrap'
import React, { useEffect } from 'react'
import '../sass/tabelement.scss'

const Tabs = ({ children }) => {
    let ulElement
    let childList

    const onTabClick = (e) => {
        const liList = document.querySelectorAll('.active')
        for (let li of liList) {
            li.classList.remove('active')
        }
        for (let childNode of childList) {
            if (e.target.innerHTML === childNode.outerText) {
                e.target.parentNode.classList.add('active')
                break
            }
        }

    }

    useEffect(() => {
        ulElement = document.getElementsByTagName('UL')[0]
        childList = ulElement.childNodes
        console.log('childList', childList[0].outerText)

    }, [])

    useEffect(() => {
        let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new Popover(popoverTriggerEl, {

                title: '<b>Please Sign In1</b>',
                content: '<b>You Need to be signed of to display the item</b>',
                html: true,
                //template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                container: 'body'
            })
        })
    })
    return (
        <>
            <ul className="tab-ul">
                {children}
            </ul>
        </>
    )
}

export default Tabs