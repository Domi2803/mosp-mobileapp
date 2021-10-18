import React, { Component } from 'react'
import { Text, View, FlatList } from 'react-native'
import NewsItem from '../components/NewsItem'
import AlertBox from '../components/AlertBox'
import * as rssParser from 'react-native-rss-parser';
import PTRView from 'react-native-pull-to-refresh';
import global from '../global'
import * as Analytics from 'expo-firebase-analytics';


export default class News extends Component {

    static navigationOptions = {
        title: "Informationen",
        headerShown: true
    }

    state={
        rss: {},
        loading: true,
    }

    componentDidMount(){
        this.fetchRSSFeed();

        this.props.navigation.addListener('didFocus', ()=>{

            Analytics.setCurrentScreen("News");
        });
    }

    fetchRSSFeed(){
        fetch('http://word-press.igs-hamm-sieg.de/feed')
        .then((response) => response.text())
        .then((responseData) => rssParser.parse(responseData))
        .then((rss) => {
            this.setState({rss: rss, loading: false});
        });
    }

    render() {
        var data = [];
        if(this.state.rss.items){
            
            var keys = Object.keys(this.state.rss.items);
            for (let i = 0; i < keys.length; i++) {
                const element = keys[i];
                data.push(this.state.rss.items[element]);
            }
        }
        return (
            <View>

            <FlatList
                style={{maxWidth: 600, alignSelf: "center"}}
                data={data}
                refreshing={this.state.loading}
                onRefresh={()=>{
                    this.setState({loading:false}, ()=>{
                        this.fetchRSSFeed();
                    })
                }}
                renderItem={({item})=>{
                    var date = new Date(Date.parse(item.published));
                    return <NewsItem date={date.getDate()+"."+date.getMonth()+"."+date.getFullYear()} title={item.title} description={item.description} link={item.id} content={item.content} />
                } }
                />
                </View>
        )
    }
}


