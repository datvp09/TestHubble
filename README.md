# TestHubble
React Native get github issues app, using React Native 0.61.5, React 16.9.0 and axios v0.19.1

App's features:

* Pull to refresh issues
* View issue's details
* Filter issues based on state

Setup project:
```
git clone https://github.com/datvp09/TestHubble.git

cd TestHubble && npm install

cd ios

pod install && pod update && cd ..
```
Make sure SDK Enviroment is setup properly and run:
```
react-native run-android/ios
```
To test app using Jest run:
```
npm run test
```
