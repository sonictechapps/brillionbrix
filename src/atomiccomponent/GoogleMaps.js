import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { constantValues } from '../utils/constants';

const GoogleMaps = ({ location, showMap }) => {
    console.log('location', location?.lat())
    const [latLng, setlatLng] = useState({
        lat: 0,
        lng: 0
    })
    const containerStyle = {
        width: '80%',
        height: '200px',
        margin: 'auto',
        transition: 'height 2s'
    };

    const containerStyleHideMap = {
        width: '80%',
        height: '0px',
        transition: 'height 2s'
    };


    const options = {

        disableDoubleClickZoom: true,
        disableDefaultUI: true,
        draggable: false,
        keyboardShortcuts: false,
        mapTypeControl: false,
        panControl: false
        // 'right-center' ,
        // ...otherOptions
    }

    const [map, setMap] = React.useState(null)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDao5jHYWwwCyJPmIf_qFlWVvSvUePHM_4',
        libraries: ["places"]
    })

    const onLoad = React.useCallback(function callback(map) {
        console.log('geocoder', latLng)
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds)
        // console.log('latlng', latLng)
        // map.setCenter(new window.google.maps.LatLng(-34, 151));
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    useEffect(() => {
        if (location && location.hasOwnProperty('lat') && location.hasOwnProperty('lng')) {
            console.log('location1', location)
            setlatLng({
                lat: location.lat(),
                lng: location.lng()
            })
        }
    }, [location])
    return isLoaded && (latLng.lat !== 0 && latLng.lng !== 0) ? (
        <>
            {console.log('check11,', latLng)}
            <GoogleMap
                mapContainerStyle={showMap ? containerStyle : containerStyleHideMap}
                center={latLng}
                options={options}
                clickableIcons={false}
                zoom={18}
                //onLoad={onLoad}
                onUnmount={onUnmount}
            >
                <Marker position={{ lat: latLng.lat, lng: latLng.lng }}
                    clickableIcons={false}
                    clickable={false}
                 
                    icon={{
                        url: `/images/home.png`,
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(15, 15),
                        scaledSize: new window.google.maps.Size(30, 30),
                        clickable: false
                    }}
                />

                <></>
            </GoogleMap>
        </>
    ) : <></>
}

export default GoogleMaps