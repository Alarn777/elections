import React from 'react';
import {StyleSheet, Text, View, Image, ScrollView, Dimensions} from "react-native";
import images from "../modules/Logos/images"
class Top5Parties extends React.Component {
    static navigationOptions = {
        title: 'Top 5 Parties',
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
        this.state = {
            parties: [],
            allVotes:0,
            height:0,
            width:0
        };

        this.add = this.add.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.renderItem = this.renderItem.bind(this)
    }

    componentWillMount() {
        this.setState({
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height
        })
    }


    componentDidMount() {
        try {
            fetch('https://isr-elections.herokuapp.com/api/parties/poll-status')
                .then(response => response.json())
                .then(data => {
                    this.add(data);
                })
                .catch(err => console.error(err));
        }
        catch (e) {
            console.log("API error" + e)
        }
    }
    renderItem(item){
        let logoPath = "";
        for (let char in item['id']) {
            if(item['id'][char] !== '-')
                logoPath += item['id'][char];
        }
        let percentage = parseInt((item['votes'] / this.state.allVotes)*100);

        return(
            <View style={styles.data}
                  key={item.id}>
                <View style={{flexDirection:'row'}}>
                    <Image style={{width:40, height: 40,margin:10}}
                           source={images[logoPath]}
                    />
                    <View style={{flexDirection:'column'}}>
                        <Text style={{fontWeight: 'bold',fontSize:20,margin:5}}>{item.id}</Text>
                        <Text style={{fontSize:15,color: 'gray'}}> {"Votes: " + percentage + "%"}</Text>
                    </View>
                </View>
            </View>
        )
    }

    onLayout(e) {
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        });
    }

    add(data) {
        let allVotes = 0;
        let dictOfParties = {};
        for (let val in data) {
            dictOfParties[val] = data[val]['currentVotes'];
            allVotes += data[val]['currentVotes']
        }
        let items = Object.keys(dictOfParties).map(function(key) {
            return [key, dictOfParties[key]];
        });

        // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        // Create a new array with only the first 5 items
        for (let val in items.slice(0, 5))
        {
            this.setState(prevState => ({
                parties: [
                    ...prevState.parties, {
                        id: items[val][0],
                        votes: items[val][1]
                    }]
            }))
        }
        this.setState({allVotes: allVotes});
    }

    render(){
        return (
            <View
                onLayout={this.onLayout}
                style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Israel elections 2019</Text>
                </View>

                <ScrollView style={styles.data}>
                    {this.state.parties.map((item)=>this.renderItem(item))}
                </ScrollView>
            </View>
        );
    }
}
export default Top5Parties;

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
        borderRadius:5,
    },
    data: {
        margin:10
    }
});
