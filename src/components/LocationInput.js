import React, { useEffect, useState } from 'react'
import AutoCompleteTextView from '../atomiccomponent/AutoCompleteTextView'
import '../sass/locationinput.scss'
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import EditText from '../atomiccomponent/EditText'
import { constantValues } from '../utils/constants'

const LocationInput = ({ getLocation, defaultlocation, defaultCondoValue, getCondoNumber }) => {
    // const geocoder = new window.google.maps.Geocoder();
    const [autocompleteOptions, setAutocompleteOptions] = useState([])
    const [autoComplete, setAutoComplete] = useState({})
    const [location, setLocation] = useState()
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
        placesService && placesService.getDetails(
            {
                placeId: autocompleteOptions[index].place_id,

            }, ((place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
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
       location && getLocation(location, autoComplete)
    }

    useEffect(() => {
        if (placePredictions.length) {
            setAutocompleteOptions([])
            const tempAutoomplete = []
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

    const onCondoChange = (value) => {
        setCondoNumber(value)
    }

    const onCondoBlur = (value) => {
        getCondoNumber(value)
    }

    return (
        <div className="location-outer">
            <div className="row collpase-div">
                <div className="col-12 col-md-4 condo-text">
                    <EditText placeholder="if applicable" type="text" defaultValue={condoNumber} onChange={onCondoChange} onBlur={onCondoBlur} />
                </div>

                <div className="col-12 col-md-8 mr-5 location-text">
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

        </div>
    )
}

export default LocationInput