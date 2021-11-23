import React, { useEffect, useState } from 'react'
import AutoCompleteTextView from '../atomiccomponent/AutoCompleteTextView'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import GoogleMaps from '../atomiccomponent/GoogleMaps'
import '../sass/inputscreen.scss'
import { useSelector, useDispatch } from 'react-redux'
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const LocationInput = ({ getLocation }) => {
    // const geocoder = new window.google.maps.Geocoder();
    const [autocompleteOptions, setAutocompleteOptions] = useState([])
    const [location, setLocation] = useState()
    const [isCollpase, setCollpase] = useState(false)

    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesService({
        apiKey: 'AIzaSyDao5jHYWwwCyJPmIf_qFlWVvSvUePHM_4',
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
                    getLocation(place.geometry.location)
                }
            })
        )
    }

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDao5jHYWwwCyJPmIf_qFlWVvSvUePHM_4',
        libraries: ["places"]
    })

    const getLatLng = (location) => {

    }

    const onNextButtonClick = () => {
        const outerDiv = document.querySelector('.location-outer')
        outerDiv.classList.add('location-outer-collapse')
        setCollpase(true)
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

    return (
        <div className="location-outer" onClick={(e) => onLocationDivClick(e)}>
            {
                <div className="row">
                    <div className="col-12 google-image">
                        <GoogleMaps location={location} showMap={!isCollpase} />
                    </div>
                </div>
            }

            <div className="row collpase-div">

                <div className="col-12 col-md-8 mr-5 location-text">
                    {
                        !isCollpase && (<div className="label-holder"><label>Property Location</label></div>)
                    }
                    <AutoCompleteTextView listItems={autocompleteOptions} style={{ width: '100%' }}
                        placeHolder="Start Typing, then pick from suggestions"
                        getPlacePredictions={getPlacePredictions} onSelectItem={onSelectItem} getLatLng={getLatLng} />
                </div>
                <div className="col-12 col-md-4 condo-text">
                    {
                        !isCollpase && (<div className="label-holder"><label>Condo Nr.</label></div>)
                    }

                    <CurrencyEditText placeholder="if applicable" type="text" />
                </div>
            </div>
            {
                !isCollpase && location && location?.lat !== '' && location?.lng !== '' && (<button className="next-button" onClick={onNextButtonClick}>Next</button>)
            }

        </div>
    )
}

export default LocationInput