import React, {Component} from 'react';
import {Button, StyleSheet, Text, View,ScrollView,FlatList,Image,Dimensions} from "react-native";
import PartyBox from '../modules/partyBox'
import images from "../modules/Logos/images"

class Home extends React.Component {
    static navigationOptions = {
        title: 'Home',
        headerStyle: {
            backgroundColor: 'lightblue',
        },
        headerTintColor: 'black',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    constructor(props) {
        super(props);
        this.state = { parties: [],
            width: 0,
            height: 0,
        };
        this.add = this.add.bind(this);
        this.nextID = this.nextID.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this._keyExtractor = this._keyExtractor.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentWillMount() {
        //set diemsions for image (orientation)
        let imageDim = parseInt((Dimensions.get('window').width - 10)/2);
        this.setState({height: imageDim,width:imageDim});

    }

    componentDidMount() {
        //fetch parties data
        try {
            fetch('https://isr-elections.herokuapp.com/api/parties')
                .then(response => response.json())
                .then(data => data.parties.map(item =>
                    this.add({id: item.id})))
                .catch(err => console.error(err));
        }
        catch (e) {
            console.log("API error" + e)
        }
    }

    //add data from API
    add({id = null}) {
        let logoPath = "";
        for (let char in id) {
            if(id[char] !== '-')
                logoPath += id[char];
        }
        this.setState(prevState => ({
            parties: [
                ...prevState.parties, {
                    id: id !== null ? id : this.nextID(prevState.parties),
                    logo: logoPath
                }]
        }))
    }

    nextID(parties = []) {
        let max = parties.reduce((prev, curr) => prev.id > curr.id ? prev.id : curr.id , 0);
        return ++max
    }

    //catch smart phone flip
    onLayout(e) {
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        });
    }

    _keyExtractor = (item) => item.id;

    //render each party box
    _renderItem = ({item}) => (
        <PartyBox
            index={ item.id }
            key={item.id}
        >
            <Image
                style={{flex:1,
                        width: (this.state.width/2)-10,
                        height: (this.state.width/2)-10
                }}
                source={images[item.logo]}
            />
            <Text style={styles.partyText}>{ item.id }</Text>
        </PartyBox>
    );

    render() {
        return (
            <View style={styles.container}
                                       onLayout={this.onLayout}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Israel elections 2019</Text>
                        <View style={styles.button}>
                            <Button style={styles.button} title='Top 5' onPress={()=>this.props.navigation.navigate('Top5Parties')}/>
                        </View>
                    </View>
                    <ScrollView style={styles.data}>
                        <FlatList numColumns={2}
                                  style={{width:this.state.width,margin:5}}
                                  data={this.state.parties}
                                  keyExtractor={this._keyExtractor}
                                  renderItem={this._renderItem}
                        >
                        </FlatList>
                </ScrollView>
            </View>
        );
    }
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        position: 'relative',
    },
    headerText:{
        fontSize:25
    },
    header: {
        justifyContent: "center", alignItems: "center",
        margin: 5,
        flexDirection: 'row',
        backgroundColor: '#66ffcc',
        height: '10%',
        borderRadius:5
    },
    partyText:{
        fontWeight: 'bold',
        textAlign:'center',
        fontSize:16

    },
    button:{
        justifyContent: "center",
        width: '20%',
        borderRadius:5,
        height: '80%',
        marginLeft:30,
        borderColor:'blue',
        backgroundColor:'lightblue'
    },
    data: {
        flexWrap:'wrap',
        flex:1,
        flexDirection: 'row'
    }
});