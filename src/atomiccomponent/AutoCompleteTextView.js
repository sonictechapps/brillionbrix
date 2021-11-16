import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PostData } from '../http/AsyncService'
import { loadingData, onLocationFailure, onLocationSuccess } from '../redux/actioncreator/LocationAction'
import '../sass/autocompletetextview.scss'
import { constantValues } from '../utils/constants'
import { searchWithDebounce } from '../utils/debounceUtility'

const AutoCompleteTextView = ({ listItems, style, placeHolder, name, getPlacePredictions }) => {
    let currentFocus
    const [searchValue, setSearchValue] = useState('')
    const dispatch = useDispatch()

    const closeAllLists = (inpElem, elmnt) => {
        let x = document.getElementsByClassName("autocomplete-items")

        for (let i = 0; i < x.length; i++) {
            x[i].parentNode.removeChild(x[i]);
        }
    }

    const callApi = () => {
        dispatch(PostData(`${constantValues.GOOGLE_PLACE_API}input=${searchValue}&key=${constantValues.GOOGLE_API_KEY}`, 'get', undefined, onLocationSuccess, onLocationFailure, loadingData))
    }

    const onSearchChange = (e) => {
        setSearchValue(e.target.value)
        getPlacePredictions({ input: e.target.value });
    }

    const onTextInputChange = (e) => {

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
        closeAllLists(inp)
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
                b.addEventListener('click', function (e) {
                    inp.value = this.getElementsByTagName('input')[0].value
                    closeAllLists()
                })
                a.appendChild(b)
                console.log('inp==2', inp)
            }
        }

    }, [listItems])


    return (
        <div className="autocomplete" style={style}>
            <input type="text" id="search" name="search" Placeholder={placeHolder} value={searchValue} autoComplete="off"
                onChange={(evt) => {
                    onSearchChange(evt)

                }} />
        </div>
    )
}

export default AutoCompleteTextView