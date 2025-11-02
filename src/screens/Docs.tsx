import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import tw from 'twrnc';

const DOCS_BASE_URL = 'https://i1st4r.github.io/YourTimeMobile/';

const Docs = () => {
  const [currentUrl, setCurrentUrl] = useState(DOCS_BASE_URL);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = (navState: any) => {
    setCurrentUrl(navState.url);
    setCanGoBack(navState.canGoBack);
  };

  const handleShouldStartLoadWithRequest = (request: any) => {
    const { url } = request;
    
    const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    const normalizedBase = DOCS_BASE_URL.endsWith('/') ? DOCS_BASE_URL.slice(0, -1) : DOCS_BASE_URL;
    
    if (
      normalizedUrl.startsWith(normalizedBase) ||
      url.startsWith('https://github.com/I1ST4R/YourTimeMobile')
    ) {
      return true;
    }
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
    }
    
    return false;
  };

  const handleGoBack = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />
      
      <View style={tw`bg-white px-4 py-3 border-b border-gray-200 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center flex-1`}>
          {canGoBack && (
            <TouchableOpacity
              onPress={handleGoBack}
              style={tw`mr-3 px-3 py-2 bg-purple-100 rounded-lg`}
            >
              <Text style={tw`text-purple-600 font-semibold`}>← Назад</Text>
            </TouchableOpacity>
          )}
          <Text style={tw`text-lg font-semibold text-gray-800`}>Документация</Text>
        </View>
      </View>

      <View style={tw`flex-1 relative`}>
        {loading && (
          <View style={tw`absolute inset-0 items-center justify-center bg-white z-10`}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={tw`mt-4 text-gray-600`}>Загрузка документации...</Text>
          </View>
        )}
        
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={tw`flex-1`}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          injectedJavaScript={`
            const meta = document.createElement('meta');
            meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
            meta.setAttribute('name', 'viewport');
            document.getElementsByTagName('head')[0].appendChild(meta);
          `}
        />
      </View>
    </View>
  );
};

export default Docs;

