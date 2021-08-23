import React,{ useState,useEffect } from 'react';
import mqtt from 'mqtt';

const LuzJardin = () => {

    const [ledState, setLedState] = useState();
    const [client, setClient] = useState();
    const [conectado, setConectado] = useState();

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

        

    },[ ledState ]);

    client?.on('connect', ()=>{
        console.log('ya nos conectamos');
        setConectado(true)
        client.subscribe('home1', function (err) {
          if (!err) {
            
          }
        })
        
    })

    

    client?.publish('home', 'ya la hicimos');

    client?.subscribe('LED', function (err) {
      if (!err) {
        client.publish('presence', 'Hello mqtt')
        
      }
    })

    client?.on('message',(topic, payload)=>{
      // console.log(topic, payload.toString())
      if(topic === 'LED' && payload.toString() === 'LED ENCENDIDO'){
        setLedState(true);
      }
      if(topic === 'LED' && payload.toString() === 'LED APAGADO'){
        setLedState(false);
      }
    })

    const handleEncenderLED = ()=>{
        client?.publish('inTopic', '1');
      }
    
    const handleApagarLED = ()=>{
        client?.publish('inTopic', '0');
    }

    

    

    return (
        <div>
            <div className='containerCommand'>
                
                {/* <h3 className='titleCommand'>{conectado ? 'Conectado al servidor EMQX': 'Desconectados del servidor EMQX'}</h3> */}
                <h3 className='titleCommand'>Luz Jardin</h3>
                <div className="status">
                <div className={ledState ? 'greenLED': 'redLED' }>

                </div>
                {ledState ? <p className='ledState'>Encendido</p>: <p className='ledState'>Apagado</p> }
                </div>
                
                <button className='btn-command' onClick={handleEncenderLED} >
                Encender
                </button>
                <button className='btn-command' onClick={handleApagarLED}>
                Apagar
                </button>
            </div>
        </div>
    )
}

export default LuzJardin
