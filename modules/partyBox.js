import React,{Component} from "react";
import {StyleSheet, View,TouchableOpacity,Alert} from "react-native";
class PartyBox extends Component{
    constructor(props){
        super(props);
        // this.state = {id:""};
        this.vote = this.vote.bind(this);
    }
    vote(id){
        Alert.alert(
            `Do you want to vote for ${id} ?`,
            '',
            [
                {text: 'Yes', onPress: () => {
                        let url = "https://isr-elections.herokuapp.com/api/parties/vote/" + id;

                        try {

                            fetch(url, {
                                mode: "no-cors",
                                method: "POST",
                                headers: {
                                    "Accept": "application/json"
                                }
                            })
                                .then(response => response.text())
                                .then((response) => {
                                    if (response === "OK")
                                        alert("Your vote was submitted");
                                    else
                                        alert("Sorry, error occurred, vote again")
                                })
                                .catch((error) => {
                                    console.error(error);
                                    alert("Sorry, error occurred, vote again")
                                });
                        }
                        catch (e) {
                            console.log("API error" + e)
                        }
                    }},
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            {cancelable: false},
        );


    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={()=>this.vote(this.props.index)}>
                {this.props.children}
                </TouchableOpacity>
            </View>

        );
    }
}
export default PartyBox;

const styles = StyleSheet.create({
    container: {
        justifyContent:'flex-start',
        left: 0,
        top: 0,
        margin:3
    },
    headerText: {
        fontSize: 10
    }
});
