import React, { useEffect, useState } from 'react'
import AutoCompleteTextView from '../atomiccomponent/AutoCompleteTextView'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import GoogleMaps from '../atomiccomponent/GoogleMaps'
import '../sass/locationinput.scss'
import { useSelector, useDispatch } from 'react-redux'
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import EditText from '../atomiccomponent/EditText'
import { constantValues } from '../utils/constants'

const LocationInput = ({ getLocation, defaultlocation, defaultCondoValue, getCondoNumber }) => {
    // const geocoder = new window.google.maps.Geocoder();
    const [autocompleteOptions, setAutocompleteOptions] = useState([])
    const [autoComplete, setAutoComplete] = useState({})
    const [location, setLocation] = useState()
    const [isCollpase, setCollpase] = useState(false)
    const [condoNumber, setCondoNumber] = useState(defaultCondoValue || '')
    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesService({
        apiKey: constantValues.GOOGLE_API_KEY,
    })

    const onSelectItem = (index) => {
        console.log('autocompleteOptions', autocompleteOptions[index])
        placesService && placesService.getDetails(
            {
                placeId: autocompleteOptions[index].place_id,

            }, ((place, status) => {
                if (status == window.google.maps.places.PlacesServiceStatus.OK) {
                    console.log('place', place.geometry.location.lng())
                    setLocation(place.geometry.location)
                    setAutoComplete(autocompleteOptions[index].description)
                }
            })
        )
    }

    // const { isLoaded } = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: 'AIzaSyDao5jHYWwwCyJPmIf_qFlWVvSvUePHM_4',
    //     libraries: ["places"]
    // })

    const getLatLng = (location) => {

    }

    const onNextButtonClick = () => {
        // const outerDiv = document.querySelector('.location-outer')
        // outerDiv.classList.add('location-outer-collapse')
        // setCollpase(true)
       location && getLocation(location, autoComplete)
    }

    // useEffect(() => {
    //     const outerDiv = document.querySelector('.location-outer')
    //     console.log('height--', window.innerHeight, ' ', outerDiv.offsetTop, ' ', window.screen.height)
    //     const calculatedHeight = window.innerHeight - outerDiv.offsetTop
    //     outerDiv.style.height = `${calculatedHeight}px`
    // }, [])
    useEffect(() => {
        // fetch place details for the first element in placePredictions array
        // geocoder
        //     .geocode({ placeId: 'ChIJgYw-uqobuIARrjdijuMnBJc' }).then(({ results }) => {
        //         console.log('oppp',results)
        //     })

        if (placePredictions.length) {
            console.log('placePredictions', placePredictions)
            setAutocompleteOptions([])
            const tempAutoomplete = []
            console.log('test-->', placePredictions)
            placePredictions.forEach(place => {
                const placeObj = {
                    ...place,
                    name: place.description,
                    value: place.place_id
                }
                tempAutoomplete.push(placeObj)
            })

            setAutocompleteOptions(tempAutoomplete)
        }

    }, [placePredictions])

    const onLocationDivClick = (elem) => {
        console.log('elem', elem)

        if (elem.target.classList.contains('location-outer-collapse')) {
            elem.target.classList.remove('location-outer-collapse')
            setCollpase(false)
        }

    }

    const onCondoChange = (value) => {
        console.log('9999', value)
        setCondoNumber(value)
    }

    const onCondoBlur = (value) => {
        getCondoNumber(value)
    }

    return (
        <div className="location-outer">
            {/* {
                <div className="row">
                    <div className="col-12 google-image">
                        <GoogleMaps location={location} showMap={!isCollpase} />
                    </div>
                </div>
            } */}

            <div className="row collpase-div">
                <div className="col-12 col-md-4 condo-text">
                    {/* {
                        !isCollpase && (<div className="label-holder"><label>Condo Nr.</label></div>)
                    } */}

                    <EditText placeholder="if applicable" type="text" defaultValue={condoNumber} onChange={onCondoChange} onBlur={onCondoBlur} />
                </div>

                <div className="col-12 col-md-8 mr-5 location-text">
                    {/* {
                        !isCollpase && (<div className="label-holder"><label>Property Location</label></div>)
                    } */}
                    <AutoCompleteTextView listItems={autocompleteOptions} style={{ width: '100%' }}
                        placeHolder="Start Typing, then pick from suggestions" location={defaultlocation?.desc}
                        getPlacePredictions={getPlacePredictions} onSelectItem={onSelectItem} getLatLng={getLatLng} />
                </div>

            </div>
            <div className="row">
                <div className="col-12">
                    <p>Let me know when you are <span>ready</span> for next step. <span onClick={onNextButtonClick}>Click here</span></p>
                </div>
            </div>
            {/* {
                !isCollpase && location && location?.lat !== '' && location?.lng !== '' && (<button className="next-button" onClick={onNextButtonClick}>Next</button>)
            } */}

        </div>
    )
}

export default LocationInput