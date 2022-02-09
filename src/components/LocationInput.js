import React, { useEffect, useState } from 'react'
import AutoCompleteTextView from '../atomiccomponent/AutoCompleteTextView'
import '../sass/locationinput.scss'
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import EditText from '../atomiccomponent/EditText'
import { constantValues } from '../utils/constants'
import Card from '../atomiccomponent/Card';
import CollapseDetails from './CollpaseDetails';
import { getColor, getStingOnLanguage, isNextButton } from '../utils/utility';

const LocationInput = ({ getLocation, defaultCondoValue, instruction, onCollapseClick }) => {
    const [autocompleteOptions, setAutocompleteOptions] = useState([])
    const [location, setLocation] = useState({
        location: '',
        condo: '',
        description: ''
    })
    const [condoNumber, setCondoNumber] = useState(defaultCondoValue || '')
    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesService({
        apiKey: constantValues.GOOGLE_API_KEY,
    })
    const [isExpand, setExpand] = useState(true)
    const [locationInstruction, setLocationInstruction] = useState(instruction)
    const onSelectItem = (index) => {
        placesService && placesService.getDetails(
            {
                placeId: autocompleteOptions[index].place_id,

            }, ((place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    let locObj = {}
                    for (let comp of place.address_components) {
                        if (comp.types.includes('street_number')) {
                            locObj['streetNumber'] = comp.long_name || ''
                        }
                        if (comp.types.includes('route')) {
                            locObj['streetName'] = comp.long_name || ''
                        }
                        if (comp.types.includes('locality')) {
                            locObj['city'] = comp.long_name || ''
                        }
                        if (comp.types.includes('postal_code')) {
                            locObj['zipCode'] = comp.long_name || ''
                        }
                        if (comp.types.includes('administrative_area_level_1')) {
                            locObj['state'] = comp.short_name || ''
                        }
                        if (comp.types.includes('country')) {
                            locObj['county'] = comp.short_name || ''
                        }
                    }
                    setLocation({
                        ...location,
                        ...locObj,
                        location: place.geometry.location,
                        description: autocompleteOptions[index].description
                    })
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
        setExpand(false)
        setLocationInstruction()
        location?.location !== '' && location?.description !== '' && getLocation(location)
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
        setLocation({
            ...location,
            condo: value
        })
    }

    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
            setLocation({
                location: '',
                condo: '',
                description: ''
            })
            setLocationInstruction(ins)
        }, 'Location')
    }

    const getAddress = () => {
        const address =  `${location.streetNumber | ''} ${location.streetName || ''}, ${location.condo? `${getStingOnLanguage('UNIT')}${location.condo}, `: ''}${location.city}, ${location.state}, ${location.county}`
        return (
            <span>{`${getStingOnLanguage('LOCATION_SPAN')} ${address}`}</span>
        )
    }

    return (
        <Card instruction={locationInstruction}>
            {
                isExpand && (
                    <div style={{ marginTop: '40px' }}>
                        <p className="question-style">{getStingOnLanguage('LOCATION_LABEL')}</p>
                        <div className="location-outer">
                            <div className="row collpase-div">
                                <div className="col-12 col-md-8 mr-5 condo-text">
                                    <AutoCompleteTextView listItems={autocompleteOptions} style={{ width: '100%' }}
                                        placeHolder={getStingOnLanguage('LOCATION_PLACEHOLDER')} location={location?.desc}
                                        getPlacePredictions={getPlacePredictions} onSelectItem={onSelectItem} getLatLng={getLatLng} />
                                </div>
                                <div className="col-12 col-md-4 location-text">
                                    <EditText placeholder={getStingOnLanguage('APT_PLACEHOLDER')} type="text" defaultValue={condoNumber} onChange={onCondoChange} />
                                </div>



                            </div>
                            {
                                location && location?.location !== '' && (
                                    <div className="row">
                                        <div className="col-12 next-btn-center">
                                            <p>{getStingOnLanguage('LOCATION_NEXT_TEXT1')}<span style={{ color: getColor() }}>{getStingOnLanguage('LOCATION_NEXT_TEXT2')}</span>{getStingOnLanguage('LOCATION_NEXT_TEXT3')} {isNextButton(onNextButtonClick)}</p>
                                        </div>
                                    </div>
                                )
                            }


                        </div>
                    </div>
                )
            }
            {
                !isExpand && (
                    <div className="row">
                        <div className="col-12" className='dropDownCollapse-active'>
                            <CollapseDetails htmlContent={getAddress()} onEditClick={onCollpase} showEdit={true} />
                        </div>
                    </div>
                )
            }
        </Card>

    )
}

export default LocationInput