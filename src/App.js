import React,{useState, useEffect} from 'react';
import mqtt from 'mqtt';
import './App.css';

function App() {

  const [conectado, setConectado] = useState(false);
  const [client, setClient] = useState();
  const [ledState, setLedState] = useState();
    
  useEffect(()=>{
    const client = mqtt.connect('ws://www.controlmanza.net:8083/mqtt',{
      keepalive: 30,
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
      }}
    );

    setClient(client);

    client.on('connect', ()=>{
      console.log('ya nos conectamos');
      setConectado(true)
      client.subscribe('home1', function (err) {
        if (!err) {
          
        }
      })
      
    })

    client.publish('home', 'ya la hicimos');

    client.subscribe('LED', function (err) {
      if (!err) {
        client.publish('presence', 'Hello mqtt')
        
      }
    })

    client.on('message',(topic, payload)=>{
      // console.log(topic, payload.toString())
      if(topic === 'LED' && payload.toString() === 'LED ENCENDIDO'){
        setLedState(true);
      }
      if(topic === 'LED' && payload.toString() === 'LED APAGADO'){
        setLedState(false);
      }
    })



  },[ ledState ])
  


  const handleEncenderLED = ()=>{
    client.publish('inTopic', '1');
  }

  const handleApagarLED = ()=>{
    client.publish('inTopic', '0');
  }

  return (
    <div className="App">
       <h1>{conectado ? 'Conectado al servidor Emqx': 'Desconectados del servidor'}</h1>
       <div className="status">
        <div className={ledState ? 'greenLED': 'redLED' }>

        </div>
       </div>
       
       <button onClick={handleEncenderLED} >
         Encender
       </button>
       <button onClick={handleApagarLED}>
         Apagar
       </button>
    </div>
  );
}

export default App;
