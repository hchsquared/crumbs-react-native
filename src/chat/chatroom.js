import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ListView,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
  Dimensions
} from 'react-native';

const windowSize = Dimensions.get('window');

export default class Chatroom extends Component {
  constructor(props) {

    super(props); // provides access to props.socket

    // TODO: Incorporate actual, dynamic data
    this.state = {
      message: null,
      messageList: [],
      location: '37.784-122.409',
      userLoggedIn: false,
      username: 'Hannah Test Person',
      imgUrl: 'http://fany.savina.net/wp-content/uploads/2010/04/silhouette.jpg'
    }

    this.props.socket.emit('updateMessagesState', this.state.location);

  }

  componentWillMount() {
    this.getMessagesOnMount = this.getMessagesOnMount.bind(this);
    this.onBackPress = this.onBackPress.bind(this);
    this.getMessagesOnMount();
  }

  onSendPress() {
    if (this.state.message) {
      this.emitAddMessageToChatRoom();
      this.setState({ message: ''});
      this._msgInput.setNativeProps({text: ''});   
    }
  }

  // TODO: Get actual username and location
  emitAddMessageToChatRoom() {
    console.log(this.state.message);
    this.props.socket.emit('addMessageToChatRoom', { 
        location: this.state.location,
        message: this.state.message,
        username: this.state.username 
      });
  }

  getMessagesOnMount() {
    this.props.socket.on('updateMessagesState', updatedChatRoom => {
      const messages = updatedChatRoom ? updatedChatRoom.messages : null;
      this.setState({ messageList: messages });
    })
  }

  onBackPress() {
    this.props.navigator.push({
      name: 'map'
    })
  }
// // <Image source={{uri: item.picUrl}} defaultSource={uri: 'https://pixabay.com/static/uploads/photo/2013/07/12/15/07/hat-149479_960_720.png'}/>
// <Image source={uri: 'https://pixabay.com/static/uploads/photo/2013/07/12/15/07/hat-149479_960_720.png'}/>

 
  // TODO: Turn list into separate component
  render() {
    var list = this.state.messageList.map((item, index) => {
      return (
        <View key={index}>
          <View style={styles.listIcon}>
            <Image style={styles.channelIcon} source={{uri: item.imgUrl}} />
          </View>
          <View style={styles.messageContainer}>
            <Text style={this.nameLabel}>
              {item.username}
              <Text style={styles.messageLabel}> : {item.message}</Text>
            </Text>
          </View>
        </View>
      )
    })
    
    list.reverse(); // display most recent messages first

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableHighlight
            underlayColor={'#dcf4ff'}
            onPress={this.onBackPress}
            style={{marginLeft: 15}}
          >
          <Text style={{color: 'black'}}>&lt; Back</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.chatContainer}>
          <ScrollView
            ref={(c) => this._scrollView = c}
            onScroll={this.handleScroll}
            scrollEventThrottle={16}
          >
          {list}
          </ScrollView>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.textContainer}>
            <TextInput
              style={styles.input}
              value={this.message}
              ref={component=> this._msgInput = component}
              onChangeText={(text) => this.setState({message: text})}
              />
          </View>
          <View style={styles.sendContainer}> 
            <TouchableHighlight
              underlayColor={'red'}
              onPress={() => this.onSendPress()}
              >
              <Text style={styles.sendLabel}>SEND</Text>
            </TouchableHighlight>
          </View> 
        </View>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#c2edff',
    paddingTop: 20,
  },
  chatContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#a9e5ff'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  sendContainer: {
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  sendLabel: {
    color: 'black',
    fontSize: 15
  },
  input: {
    width: windowSize.width - 70,
    color: '#555555',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    height: 32,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  channelIcon: {
    width: 30,
    height: 30
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15
  }

});
