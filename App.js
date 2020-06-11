import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
  TouchableNativeFeedback,
  PermissionsAndroid,
  FlatList,
  InteractionManager
} from 'react-native';

var SendSMS = NativeModules.SendSMS;

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import _ from './global'

var timer = null
var next = false
var sended = []

const App: () => React$Node = () => {
  var [result, setRes] = useState({next:false,out:'Inicio'})
  var [inicio, setInicio] = useState(false)
  var bucle = ()=>{
    if (!next) {
      setInicio(false)
      return
    }
    _.fatch('Marketing/pendiente',null,b=>{
        setRes(b)
        if (b.cel && b.msg && b.id){
          SendSMS.send(b.id, b.cel, b.msg, (result)=>{
            b.result = result
            sended.push(b)
            sender.slice(Math.max(sender.length - 20, 0))
            _.fatch('Marketing/resultado',b,b=>{
              if (!b.next || !next){
                setInicio(false)
                next = false
              } else bucle()
            })
          });
        }
    })
  }
  const [veces, setVeces] = useState(1)

  return (
    <>
      <StatusBar barStyle="light-content" />

      <SafeAreaView>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <TouchableNativeFeedback onPress={async ()=>{
                if (inicio){
                  setInicio(false)
                  next = false
                  return
                }
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.SEND_SMS,
                    {
                      title: "Permisos para enviar SMS",
                      message:
                        "Permiso para enviar SMS",
                      buttonNeutral: "Preguntarme luego",
                      buttonNegative: "Cancelar",
                      buttonPositive: "Si"
                    }
                  );
                if (granted === PermissionsAndroid.RESULTS.GRANTED){
                  next = true
                  setInicio(true)
                  bucle()
                  console.log('setinicio','true', inicio)
                  //
                }
              }}>
                <Text style={styles.sectionTitle}>{inicio?'Parar':'Iniciar2'}</Text>
              </TouchableNativeFeedback>
            </View>
            <View style={{flexDirection: 'row',margin: 5}}>
              <Text >Res:{(result &&result.next)?'Hay pendientes':'No hay pendiwntes'}</Text>
            </View>
            <View style={{flexDirection: 'row',margin: 5}}>
              <Text >Res:{result && result.out}</Text>
            </View>
          </View>
        <FlatList
          // contentInsetAdjustmentBehavior="automatic"
           style={styles.scrollView}
                data={sended}
                renderItem={({ item }) =>
                  <>
                    <Text>{item.id}</Text>
                    <Text>{item.cel}</Text>
                    <Text>{item.result}</Text>
                  </>}
                keyExtractor={(item, index) => `k-${index}`}
              />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
