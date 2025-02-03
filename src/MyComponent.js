// MyComponent.js
import React, { useEffect, useState } from 'react'

const MyComponent = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch('/api/data')
            .then(response => response.json())
            .then(data => setData(data.data))
    }, [])

    return (
        <div>
            {data ? <p>{data}</p> : <p>Loading...</p>}
        </div>
    )
}

export default MyComponent
