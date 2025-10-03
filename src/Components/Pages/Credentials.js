import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Credentials() {
  const [client, Setclient] = useState([])

  const fetchClients = async () => {
    
      const response = await axios.get('http://localhost:3000/api/v1/credentials')

      .then((response) => {
        if (response.status === 200) {
          Setclient(response.data)
          localStorage.setItem('client', response.data.client_id)
          console.log(response.data)
        }
        else {
          console.log('error')
        }
      }).catch((error) => {
        console.log(error)
      }).finally((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <div>
      
    </div>
  )
}

export default Credentials
