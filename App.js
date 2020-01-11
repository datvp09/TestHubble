import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Toast, NavigationHeader} from './src/components';
import {filterIcon} from './src/Constants';
import axios from 'axios';
import Modal from 'react-native-modal';
import moment from 'moment';

class App extends Component {
  state = {
    issues: [],
    selectedItemIndex: 0,
    filterState: 'open',
    isLoading: false,
    modalDetailShow: false,
    modalFilterShow: false,
  };

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh = () => {
    this.setState({isLoading: true});

    axios
      .get('https://api.github.com/repos/nnluukhtn/employment_bot/issues')
      .then(res => {
        if (!res || res.status != 200) {
          Toast('Lỗi lấy dữ liệu');
          return;
        }

        this.setState({issues: res.data});
      })
      .catch(e => {
        console.log('get-error', e);
      })
      .finally(() => this.setState({isLoading: false}));
  };

  showModalDetail = index =>
    this.setState({modalDetailShow: true, selectedItemIndex: index});

  dismissModalDetail = () => this.setState({modalDetailShow: false});

  showModalFilter = () => this.setState({modalFilterShow: true});

  dismissModalFilter = () => this.setState({modalFilterShow: false});

  onOpenStateFilter = () =>
    this.setState({filterState: 'open', modalFilterShow: false});

  onCloseStateFilter = () =>
    this.setState({filterState: 'close', modalFilterShow: false});

  onAllStateFilter = () =>
    this.setState({filterState: 'all', modalFilterShow: false});

  renderRightView = () => {
    return (
      <TouchableOpacity
        style={styles.rightIconWrap}
        onPress={this.showModalFilter}>
        <Image source={filterIcon} style={styles.rightIcon} />
      </TouchableOpacity>
    );
  };

  renderItems = ({item, index}) => {
    const {
      created_at,
      author_association,
      user,
      title,
      state,
      number,
      labels,
    } = item;
    const openDate = moment(created_at).format('MMM DD, YYYY');
    const opener = author_association == 'OWNER' ? user.login : '';

    return (
      <TouchableOpacity
        onPress={() => this.showModalDetail(index)}
        style={[styles.item, index == 0 && {marginTop: 10}]}>
        <View style={styles.itemTitleRow}>
          <Text style={styles.itemTitle}>{title}</Text>
          {labels.map((x, id) => (
            <View style={styles.labelWrap}>
              <Text key={id} style={styles.itemText}>
                {x.name}
              </Text>
            </View>
          ))}
        </View>
        <Text>{`State: ${state}`}</Text>
        <Text>{`#${number} opened on ${openDate} by ${opener}`}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      issues,
      filterState,
      selectedItemIndex,
      isLoading,
      modalDetailShow,
      modalFilterShow,
    } = this.state;
    let filteredList = issues;
    if (filterState != 'all') {
      filteredList = issues.filter(x => x.state.toLowerCase() == filterState);
    }

    return (
      <>
        <StatusBar barStyle="light-content" />
        <View style={styles.screen}>
          <NavigationHeader
            style={{height: 60}}
            title={'Repository Issues'}
            rightView={this.renderRightView}
          />
          <FlatList
            data={filteredList}
            extraData={issues}
            keyExtractor={item => `${item.id}`}
            renderItem={this.renderItems}
            style={styles.list}
            refreshing={isLoading}
            onRefresh={this.onRefresh}
          />
          {issues.length > 0 ? (
            <Modal
              isVisible={modalDetailShow}
              animationIn="fadeIn"
              animationOut="fadeOut"
              backdropTransitionOutTiming={0}
              onBackButtonPress={this.dismissModalDetail}
              onBackdropPress={this.dismissModalDetail}>
              <View style={styles.detailContainer}>
                <View style={styles.itemTitleRow}>
                  <Text style={styles.itemTitle}>
                    {issues[selectedItemIndex].title}
                  </Text>
                  {issues[selectedItemIndex].labels.map((x, id) => (
                    <View style={styles.labelWrap}>
                      <Text key={id} style={styles.itemText}>
                        {x.name}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text>{`State: ${issues[selectedItemIndex].state}`}</Text>
                <Text>{`#${issues[selectedItemIndex].number} opened on ${moment(
                  issues[selectedItemIndex].created_at,
                ).format('MMM DD, YYYY')} by ${
                  issues[selectedItemIndex].author_association == 'OWNER'
                    ? issues[selectedItemIndex].user.login
                    : ''
                }\n`}</Text>
                <Text>{`Detail: \n${issues[selectedItemIndex].body}`}</Text>
              </View>
            </Modal>
          ) : null}
          <Modal
            isVisible={modalFilterShow}
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropTransitionOutTiming={0}
            onBackButtonPress={this.dismissModalFilter}
            onBackdropPress={this.dismissModalFilter}>
            <View
              style={[
                styles.detailContainer,
                {width: '70%', alignSelf: 'center'},
              ]}>
              <Text style={styles.itemTitle}>{'State\n'}</Text>
              <TouchableOpacity
                onPress={this.onOpenStateFilter}
                style={[styles.itemTitleRow, {marginBottom: 12}]}>
                <View style={styles.blackDot} />
                <Text style={styles.itemTitle}>{'Open'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.onCloseStateFilter}
                style={[styles.itemTitleRow, {marginBottom: 12}]}>
                <View style={styles.blackDot} />
                <Text style={styles.itemTitle}>{'Close'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.onAllStateFilter}
                style={[styles.itemTitleRow, {marginBottom: 12}]}>
                <View style={styles.blackDot} />
                <Text style={styles.itemTitle}>{'All'}</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#d0d0d0',
  },
  list: {
    flex: 1,
  },
  rightIconWrap: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    tintColor: 'white',
    width: 18,
    height: 18,
  },
  item: {
    marginVertical: 5,
    marginHorizontal: 7,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 15,
    marginRight: 7,
  },
  itemText: {color: 'white'},
  labelWrap: {
    backgroundColor: 'green',
    borderRadius: 4,
    padding: 3,
    paddingHorizontal: 4,
  },
  detailContainer: {
    padding: 15,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  blackDot: {
    width: 10,
    height: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 10,
  },
});

export default App;
