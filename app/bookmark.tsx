import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, BackHandler } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-5333424817197074/5264778937'; // Replace with actual ad unit ID in production

type BookmarkedImage = {
  imageUrl: string;
  title: string;
};

export default function BookmarkedImagesPage() {
  const navigation = useNavigation();
  const router = useRouter();
  const [adLoaded, setAdLoaded] = useState(false);

  // Create the interstitial ad
  const interstitial = InterstitialAd.createForAdRequest(adUnitId);

  const [bookmarkedImages, setBookmarkedImages] = useState<BookmarkedImage[]>([]);
  const { index, title, imageUrl, originalName } = useLocalSearchParams<{
    index: string;
    title: string;
    imageUrl: string;
    originalName: string;
  }>();
  const imageSrc = imageUrl || '';

  // Set up the navigation header with back button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title || 'Bookmarked Styles',
      headerTitleAlign: 'center',
      headerTitleStyle: { fontWeight: 'bold' },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (interstitial.loaded) {
              interstitial.show();
            } else {
              navigation.goBack();
            }
          }}
          style={{ paddingHorizontal: 10 }}
        >
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, interstitial]);

  // Handle system back button
  useEffect(() => {
    const backAction = () => {
      if (interstitial.loaded) {
        interstitial.show();
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [interstitial, navigation]);

  // Load interstitial ad and set up event listener
  useEffect(() => {
    const onAdEvent = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      navigation.goBack(); // Navigate back after ad is dismissed
    });

    interstitial.load(); // Load the interstitial ad

    return () => {
      onAdEvent(); // Clean up the ad event listener
    };
  }, [interstitial, navigation]);

  useEffect(() => {
    loadBookmarkedImages();
  }, []);

  const loadBookmarkedImages = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      setBookmarkedImages(bookmarks ? JSON.parse(bookmarks) : []);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  };

  const removeBookmark = async (imageUrl: string) => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      const parsedBookmarks = bookmarks ? JSON.parse(bookmarks) : [];
      const updatedBookmarks = parsedBookmarks.filter((item: BookmarkedImage) => item.imageUrl !== imageUrl);
      await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarkedImages(updatedBookmarks);
      Toast.show({
        type: 'info',
        text1: 'Bookmark removed!',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Failed to update bookmarks:', error);
    }
  };

  const downloadImage = async (imageUrl: string) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${originalName || 'image'}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

      if (downloadResult.status === 200) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Image downloaded successfully!',
          visibilityTime: 2000,
        });
      } else {
        throw new Error('Download failed with status: ' + downloadResult.status);
      }
    } catch (error) {
      console.error('Download failed:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'An error occurred during download.',
        visibilityTime: 2000,
      });
    }
  };

  const renderImageItem = ({ item }: { item: BookmarkedImage }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="stretch" />
      <View style={styles.iconContainerWrapper}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => downloadImage(item.imageUrl)}
        >
          <FontAwesome name="download" size={24} color="tomato" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => removeBookmark(item.imageUrl)}
        >
          <FontAwesome name="bookmark" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Banner Ad */}
      <BannerAd
        unitId="ca-app-pub-5333424817197074/3170751028" // Replace with your banner ad unit ID
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />

      <FlatList
        data={bookmarkedImages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderImageItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No bookmarked images yet.</Text>}
      />
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  iconContainerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
