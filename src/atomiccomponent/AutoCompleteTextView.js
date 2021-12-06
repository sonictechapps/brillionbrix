import React, { useEffect, useState } from 'react'
import '../sass/autocompletetextview.scss'
import { editTextBorderColor, getColor } from '../utils/utility'

const AutoCompleteTextView = ({ listItems, style, placeHolder, getPlacePredictions, onSelectItem, location }) => {
    let currentFocus
    const [searchValue, setSearchValue] = useState(location || '')

    const closeAllLists = () => {
        let x = document.getElementsByClassName("autocomplete-items")
        for (let i = 0; i < x.length; i++) {
            x[i].parentNode.removeChild(x[i]);
        }
    }

    const onSearchChange = (e) => {
        setSearchValue(e.target.value)
        getPlacePredictions({ input: e.target.value });
    }

    useEffect(() => {
        if (searchValue === '') {
            const a = document.getElementsByClassName('autocomplete-items')[0]
            if (a) a.style.display = 'none'
        }
    }, [searchValue])

    useEffect(() => {
        const inp = document.getElementById('search')
        let a, b, i, val = searchValue
        closeAllLists()
        if (!val) { return false }
        currentFocus = -1
        a = document.createElement("DIV")
        a.setAttribute("id", 'search' + "autocomplete-list")
        a.setAttribute("class", "autocomplete-items")
        a.style.width = '100%'
        inp.parentNode.appendChild(a)
        for (i = 0; i < listItems.length; i++) {
            if (listItems[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV")
                b.innerHTML = "<strong>" + listItems[i].name.substr(0, val.length) + "</strong>"
                b.innerHTML += listItems[i].name.substr(val.length)
                b.innerHTML += "<input type='hidden' value='" + listItems[i].name + "'>"
                b.innerHTML += "<input type='hidden' value='" + i + "'>"
                b.addEventListener('click', function (e) {
                    setSearchValue(this.getElementsByTagName('input')[0].value)
                    let index = this.getElementsByTagName('input')[1].value
                    onSelectItem(index)
                    closeAllLists()
                })
                a.appendChild(b)
            }
        }

    }, [listItems])

    const onAutoCompleteBlur = (e) => {
        e.target.style.borderColor = editTextBorderColor
    }

    const onFocus = (e) => {
        e.target.style.borderColor = getColor()
    }
    return (
        <div className="autocomplete" style={style}>
            <input type="text" id="search" name="search" Placeholder={placeHolder} value={searchValue} autoComplete="off"
                onChange={(evt) => {
                    onSearchChange(evt)

                }} onBlur={(e) => onAutoCompleteBlur(e)} onFocus={onFocus} />
        </div>
    )
}

export default React.memo(AutoCompleteTextView)