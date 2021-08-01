import React,{useState, useEffect} from 'react';
import mqtt from 'mqtt';
import './App.css';

function App() {

  const [conectado, setConectado] = useState(false);
  const [ mensaje, setMensaje] = useState('');
    
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
      }});
    console.log(client)
    client.on('connect', ()=>{
      console.log('ya nos conectamos');
      console.log(client)
      setConectado(true)
      client.subscribe('home', function (err) {
        if (!err) {
          client.publish('presence', 'Hello mqtt')
          
        }
      })
    })
    client.publish('home', 'ya la hicimos');
    client.on('message',(topic, payload)=>{
      setMensaje(payload.toString());
    })

  },[ ])

  return (
    <div className="App">
       <h1>{conectado ? 'Conectado al servidor Emqx': 'Desconectados del servidor'}</h1>
       <h2>{mensaje}</h2>
    </div>
  );
}

export default App;
