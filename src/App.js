import axios from 'axios';
import { useEffect, useState } from 'react';
import './style.scss'
import './helpers.scss'
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


function App() {
  
  const [coordinates,setCoordinates] = useState(null)



  useEffect(()=>{
    axios.get(
      'https://geo.ipify.org/api/v1?apiKey=at_Vxi01lIGawCsvejGeJeu1DXMUFTU5&ipAddress=8.8.8.8'
    )
    .then(res=>{
      if (res.status===200) {
        setCoordinates({
          ...res.data,
          point:[res.data.location.lat,res.data.location.lng]
        
        })
      }
    })
  },[])


  const [ipState,setIpState] = useState('')

  const requestApi = ()=>{
    const ipify  = `https://geo.ipify.org/api/v1?apiKey=at_Vxi01lIGawCsvejGeJeu1DXMUFTU5&ipAddress=${ipState}`;

    if (ipState !=='') {
      axios.get(
        ipify
      )
      .then(res=>{
        console.log('Response Created',res);
        if (res.status===200) {
          setCoordinates({
            ...res.data,
            point:[res.data.location.lat,res.data.location.lng]
          
          })
        }
      })
      .catch(err=>{
        console.log('Axios eror',err);
        if (err.response) {
          if (err.response.status===422) {
          
            setCoordinates({
              point:coordinates.point
            })
          }
        }
      })
      .then(()=>setIpState(''))

        
    }
    
  }


  return (
    <>
      <div className="App" style={{paddingTop:'2em'}}> 
        <div className="">
          <div className="wyt head flexC">
              IP ADDRESS TRACKER
          </div>
          <form onSubmit={e=>{e.preventDefault();requestApi()}} className="flex section flexC search">
            <input type="text" name="" id="" 
             onChange={(e)=>setIpState(e.target.value)}
             placeholder='Search for any IP address'
             value={ipState}
            />
            <div onClick={()=>requestApi()} className='fullFlex darkgrey button cursor paddBoth'>
               <img src="./icon-arrow.svg" alt="arrow" />
            </div>

          </form>


        
        </div>
      </div>

      <div className='canvas relative'>
          <div>
            {
             coordinates  && 
             <MapContainer
              className='leafletMap'
              style={{ height: "450px", width: "100%" }} 
                center={
                  coordinates.point                
                }  
              zoomControl={false}
              zoom={20}
              >

                <img src="./icon-location.svg" className='location' alt="" />

              <TileLayer
                   attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>  contributors'
                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

             </MapContainer>
            }
          </div>
      </div>
    
      <div className={`ipCard ${coordinates && coordinates.ip !==undefined}`}>
        {   
          coordinates && coordinates.ip?
          <>     
            <div>
              <div className='grey'>IP ADDRESS</div>
              <div className="head">
                {coordinates.ip}
              </div>
            </div>

            <div>
              <div className="grey">LOCATION</div>
              <div className="smallM head">
                {coordinates.location.region},{coordinates.location.city}
              </div>
            </div>

            <div>
              <div className="grey">TIMEZONE</div>
              <div className="smallM head">
                UTC{coordinates.location.timezone}
              </div>
            </div>

            <div className='last'>
              <div className="grey">ISP</div>
              <div className="smallM head">
                {coordinates.isp}
              </div>
            </div>
          </>
          :coordinates && !coordinates.ip?
          <div className="flexC">
            <div className="doubleflex flexAl">
              <div className="head flexAl" style={{fontSize:'24px'}}>No Loan Items match your search</div>
              <i className='fa fa-exclamation-triangle head' style={{fontSize:'30px'}}></i>
            </div>
          </div>:null
        }

      </div>

    </>
  );
}

export default App;
