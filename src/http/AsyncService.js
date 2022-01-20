import axios from 'axios'

export const PostData = (url, type = 'get', params = undefined, successFun, failireFun, loadFun, header) => {

    return async (dispatch) => {
        dispatch(loadFun())
        if (type === 'get') {
            let geturl
            if (params.entries().next().value)
                geturl = url + '?'
            else
                geturl = url
            for (var [key, value] of params.entries()) {
                geturl = geturl + key + '=' + value + '&'
            }
            await axios.get(geturl, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...header
                }
            })
                .then((response) => {
                    dispatch(successFun(response.data))
                }).catch(error => {
                    dispatch(failireFun(error.error))
                })
        }

        else {
            await axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then((response) => {
                dispatch(successFun(response.data))
            }).catch(error => {
                dispatch(failireFun(error))
            })
        }
    }
}

export const PostImage = (url, formData = undefined, successFun, errorFun, loadingFun, header = undefined) => {
    return async (dispatch) => {
        dispatch(loadingFun());
        await axios.post(url, formData, header || {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',

            }
        }).then((response) => {
            dispatch(successFun(response.data))
        }).catch(error => {
            dispatch(errorFun(error.error))
        })
    }
}

export const getWithRawRequest = (url, successFun, errorFun, loadingFun, requestJSON) => {
    return async (dispatch) => {
        dispatch(loadingFun());
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                dispatch(successFun(JSON.parse(this.responseText)))
               
            }
        });
        xhr.addEventListener("error", function () {
            if (this.readyState === 4) {
                dispatch(errorFun(this.responseText))
            }
        });
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(requestJSON);
    }
}

export const multiplePostData = (axiosArray, successFun, failireFun, loadFun) => {
    return async (dispatch) => {
        dispatch(loadFun())
        try {
            Promise.allSettled(axiosArray).then((responses) => {
                dispatch(successFun(responses))
            }).catch(errors => {
                dispatch(failireFun(errors))
            })

        } catch (err) {
            dispatch(failireFun(err))
        }
    }
}